// Auth service for API integration
import type { User, LoginForm, ApiResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class AuthService {
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private setAuthToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
  }

  private setRefreshToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('refresh_token', token);
  }

  private removeTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_user');
  }

  private saveUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('current_user', JSON.stringify(user));
  }

  private getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
  return localStorage.getItem('current_user') ? JSON.parse(localStorage.getItem('current_user')!) : null;
  }

  async login(credentials: LoginForm): Promise<ApiResponse<User>> {
    try {
      console.log('🔐 AuthService: Fazendo login na API para:', credentials.email);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log('❌ AuthService: Erro de login:', data.message);
        return {
          data: {} as User,
          success: false,
          message: data.message || 'Erro no login',
        };
      }

      if (data.success && data.data.user) {
        // Salvar tokens e dados do usuário
        this.setAuthToken(data.data.accessToken);
        this.setRefreshToken(data.data.refreshToken);
        this.saveUser(data.data.user);

        console.log('✅ AuthService: Login bem-sucedido para:', data.data.user.name);
        return {
          data: data.data.user,
          success: true,
          message: data.message,
        };
      }

      return {
        data: {} as User,
        success: false,
        message: 'Resposta inválida do servidor',
      };
    } catch (error) {
      console.error('❌ AuthService: Erro na requisição de login:', error);
      return {
        data: {} as User,
        success: false,
        message: 'Erro de conexão com o servidor',
      };
    }
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      const token = this.getAuthToken();
      
      if (token) {
        // Tentar fazer logout na API
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      // Sempre limpar dados locais, mesmo se a API falhar
      this.removeTokens();

      console.log('✅ AuthService: Logout realizado');
      return {
        data: undefined,
        success: true,
        message: 'Logout realizado com sucesso',
      };
    } catch (error) {
      console.error('❌ AuthService: Erro no logout:', error);
      // Ainda assim, limpar dados locais
      this.removeTokens();
      
      return {
        data: undefined,
        success: true,
        message: 'Logout realizado com sucesso',
      };
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem('dashmonster-refresh-token');
      
      if (!refreshToken) {
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        this.setAuthToken(data.data.accessToken);
        this.saveUser(data.data.user);
        return data.data.accessToken;
      }

      // Se refresh falhou, limpar tokens
      this.removeTokens();
      return null;
    } catch (error) {
      console.error('❌ AuthService: Erro no refresh token:', error);
      this.removeTokens();
      return null;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = this.getAuthToken();
      
      if (!token) {
        return this.getStoredUser();
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        // Token expirado, tentar refresh
        const newToken = await this.refreshToken();
        if (newToken) {
          // Tentar novamente com o novo token
          const retryResponse = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${newToken}`,
            },
          });

          if (retryResponse.ok) {
            const retryData = await retryResponse.json();
            if (retryData.success) {
              this.saveUser(retryData.data);
              return retryData.data;
            }
          }
        }
        
        // Se chegou aqui, não conseguiu renovar o token
        this.removeTokens();
        return null;
      }

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          this.saveUser(data.data);
          return data.data;
        }
      }

      return this.getStoredUser();
    } catch (error) {
      console.error('❌ AuthService: Erro ao buscar usuário atual:', error);
      return this.getStoredUser();
    }
  }

  isAuthenticated(): boolean {
    return this.getAuthToken() !== null || this.getStoredUser() !== null;
  }

  /**
   * Retorna credenciais de demonstração para facilitar testes
   */
  getDemoCredentials() {
    // Busca usuários de demonstração do backend Express
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    return fetch(`${baseUrl}/demo-credentials`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Erro ao buscar usuários demo');
        const data = await res.json();
        // Aceita array puro ou objeto com data
        return Array.isArray(data) ? data : (data.data || []);
      })
      .catch(() => []);
  }

  async register(): Promise<ApiResponse<User>> {
    try {
      // TODO: Implementar registro via API quando necessário
      return {
        data: {} as User,
        success: false,
        message: 'Registro não implementado ainda',
      };
    } catch (error) {
      console.error('❌ AuthService: Erro no registro:', error);
      return {
        data: {} as User,
        success: false,
        message: 'Erro interno do servidor',
      };
    }
  }
}

export const authService = new AuthService();
