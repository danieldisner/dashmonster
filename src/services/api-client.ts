// API Client otimizado para o sistema Dashmonster

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { ApiResponse } from '@/types';

export interface CacheConfig {
  ttl: number; // Time to live em milissegundos
  maxSize: number; // Máximo de itens no cache
}

export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  cache: CacheConfig;
  retries: number;
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class ApiClient {
  private client: AxiosInstance;
  private cache = new Map<string, CacheItem<unknown>>();
  private config: ApiClientConfig;
  private requestQueue = new Map<string, Promise<unknown>>();

  constructor(config: ApiClientConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.setupCacheCleanup();
  }

  private setupInterceptors() {
    // Request interceptor para autenticação e logging
    this.client.interceptors.request.use(
      (config) => {
        // Adicionar token de autenticação
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Adicionar request ID para tracking
        config.headers['X-Request-ID'] = this.generateRequestId();

        // Log request em desenvolvimento
        if (process.env.NODE_ENV === 'development') {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor para erro handling e logging
    this.client.interceptors.response.use(
      (response) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        }
        return response;
      },
      async (error) => {
        await this.handleResponseError(error);
        return Promise.reject(error);
      }
    );
  }

  private setupCacheCleanup() {
    // Limpeza automática do cache a cada 5 minutos
    setInterval(() => {
      this.cleanExpiredCache();
    }, 5 * 60 * 1000);
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private generateRequestId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  private async handleResponseError(error: unknown) {
    const axiosError = error as { response?: { status?: number } };
    const status = axiosError.response?.status;
    
    switch (status) {
      case 401:
        this.handleUnauthorized();
        break;
      case 403:
        this.handleForbidden();
        break;
      case 429:
        await this.handleRateLimited(error);
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        this.handleServerError(error);
        break;
      default:
        this.handleGenericError(error);
    }
  }

  private handleUnauthorized() {
    // Logout user e redirect para login
    localStorage.removeItem('dashmonster-auth-token');
    localStorage.removeItem('dashmonster-auth-storage');
    
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  private handleForbidden() {
    console.warn('Access forbidden - insufficient permissions');
    // Mostrar toast ou modal de erro
  }

  private async handleRateLimited(error: unknown) {
    const axiosError = error as { response?: { headers?: { 'retry-after'?: string } } };
    const retryAfter = axiosError.response?.headers?.['retry-after'];
    if (retryAfter) {
      const delay = parseInt(retryAfter) * 1000;
      console.warn(`Rate limited - retrying after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  private handleServerError(error: unknown) {
    console.error('Server error:', error);
    // Log para serviço de monitoring
    if (process.env.NODE_ENV === 'production') {
      // this.logError(error);
    }
  }

  private handleGenericError(error: unknown) {
    console.error('API error:', error);
  }

  // Cache management
  private getCacheKey(url: string, params?: Record<string, unknown>): string {
    return `${url}${params ? `?${JSON.stringify(params)}` : ''}`;
  }

  private getFromCache<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const isExpired = Date.now() > item.timestamp + item.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  private setCache<T>(key: string, data: T, ttl?: number): void {
    // Verificar tamanho máximo do cache
    if (this.cache.size >= this.config.cache.maxSize) {
      // Remover item mais antigo
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.cache.ttl
    });
  }

  private cleanExpiredCache(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.timestamp + item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  public invalidateCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  // Request deduplication
  private async deduplicateRequest<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    if (this.requestQueue.has(key)) {
      return this.requestQueue.get(key) as Promise<T>;
    }

    const promise = requestFn().finally(() => {
      this.requestQueue.delete(key);
    });

    this.requestQueue.set(key, promise);
    return promise;
  }

  // Public API methods
  async get<T>(
    url: string, 
    config?: AxiosRequestConfig & { 
      useCache?: boolean; 
      cacheTtl?: number;
    }
  ): Promise<ApiResponse<T>> {
    const { useCache = true, cacheTtl, ...axiosConfig } = config || {};
    const cacheKey = this.getCacheKey(url, axiosConfig.params);

    // Verificar cache
    if (useCache) {
      const cached = this.getFromCache<ApiResponse<T>>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    try {
      const response = await this.deduplicateRequest(
        cacheKey,
        () => this.client.get<T>(url, axiosConfig)
      );

      const result: ApiResponse<T> = {
        data: response.data,
        success: true,
        message: 'Success'
      };

      // Cachear resultado
      if (useCache) {
        this.setCache(cacheKey, result, cacheTtl);
      }

      return result;
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
      return {
        data: null as T,
        success: false,
        message: axiosError.response?.data?.message || axiosError.message || 'Erro desconhecido'
      };
    }
  }

  async post<T>(
    url: string, 
    data?: Record<string, unknown>, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<T>(url, data, config);
      
      // Invalidar cache relacionado
      this.invalidateCache(url.split('/')[1]); // Invalidar por recurso

      return {
        data: response.data,
        success: true,
        message: 'Created successfully'
      };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
      return {
        data: null as T,
        success: false,
        message: axiosError.response?.data?.message || axiosError.message || 'Erro ao criar'
      };
    }
  }

  async put<T>(
    url: string, 
    data?: Record<string, unknown>, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<T>(url, data, config);
      
      // Invalidar cache relacionado
      this.invalidateCache(url);

      return {
        data: response.data,
        success: true,
        message: 'Updated successfully'
      };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
      return {
        data: null as T,
        success: false,
        message: axiosError.response?.data?.message || axiosError.message || 'Erro ao atualizar'
      };
    }
  }

  async delete(
    url: string, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<boolean>> {
    try {
      await this.client.delete(url, config);
      
      // Invalidar cache relacionado
      this.invalidateCache(url);

      return {
        data: true,
        success: true,
        message: 'Deleted successfully'
      };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
      return {
        data: false,
        success: false,
        message: axiosError.response?.data?.message || axiosError.message || 'Erro ao deletar'
      };
    }
  }

  // Batch requests para múltiplas operações
  async batch<T>(requests: Array<() => Promise<T>>): Promise<T[]> {
    return Promise.all(requests.map(request => request()));
  }

  // Health check da API
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get('/health');
      return true;
    } catch {
      return false;
    }
  }

  // Configuração dinâmica
  updateConfig(newConfig: Partial<ApiClientConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (newConfig.baseURL) {
      this.client.defaults.baseURL = newConfig.baseURL;
    }
    
    if (newConfig.timeout) {
      this.client.defaults.timeout = newConfig.timeout;
    }
  }

  // Estatísticas do cache
  getCacheStats() {
    return {
      size: this.cache.size,
      maxSize: this.config.cache.maxSize,
      hitRate: this.calculateHitRate()
    };
  }

  private calculateHitRate(): number {
    // Implementar lógica de hit rate
    return 0;
  }
}

// Configuração padrão
const defaultConfig: ApiClientConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  cache: {
    ttl: 5 * 60 * 1000, // 5 minutos
    maxSize: 100
  },
  retries: 3
};

// Instância global do cliente
export const apiClient = new ApiClient(defaultConfig);

// Hook para usar o cliente em componentes React
export function useApiClient() {
  return apiClient;
}
