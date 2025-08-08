import type { Unit, CreateUnitForm, ApiResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Utilitário para requisições autenticadas
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = localStorage.getItem('auth_token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

class UnitService {
  constructor() {
    // Service agora usa API real - não precisa de inicialização localStorage
  }

  /**
   * Cria uma nova unidade (cantina)
   */
  async create(data: CreateUnitForm & { organizationId: string }): Promise<ApiResponse<Unit>> {
    try {
      const unit = await apiRequest<Unit>('/units', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          isActive: true
        }),
      });

      return {
        data: unit,
        success: true,
        message: 'Unidade criada com sucesso'
      };
    } catch (error: unknown) {
      return {
        data: {} as Unit,
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao criar unidade'
      };
    }
  }

  /**
   * Busca todas as unidades
   */
  async getAll(): Promise<ApiResponse<Unit[]>> {
    try {
      const response = await apiRequest<ApiResponse<Unit[]>>('/units');
      
      // A API já retorna no formato ApiResponse, então só retornamos diretamente
      if (response.success && Array.isArray(response.data)) {
        return response;
      } else {
        return {
          data: [],
          success: false,
          message: 'Formato de resposta inválido'
        };
      }
    } catch (error: unknown) {
      return {
        data: [],
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar unidades'
      };
    }
  }

  /**
   * Busca unidade por ID
   */
  async getById(id: string): Promise<ApiResponse<Unit | null>> {
    try {
      const unit = await apiRequest<Unit>(`/units/${id}`);

      return {
        data: unit,
        success: true,
        message: 'Unidade encontrada'
      };
    } catch (error: unknown) {
      return {
        data: null,
        success: false,
        message: error instanceof Error ? error.message : 'Unidade não encontrada'
      };
    }
  }

  /**
   * Busca unidades por organização
   */
  async getByOrganization(organizationId: string): Promise<ApiResponse<Unit[]>> {
    try {
      const units = await apiRequest<Unit[]>(`/units/organization/${organizationId}`);

      return {
        data: units.filter(unit => unit.isActive),
        success: true,
        message: `${units.length} unidades encontradas`
      };
    } catch (error: unknown) {
      return {
        data: [],
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar unidades'
      };
    }
  }

  /**
   * Busca apenas unidades ativas
   */
  async getActiveUnits(): Promise<ApiResponse<Unit[]>> {
    try {
      const units = await apiRequest<Unit[]>('/units/active');

      return {
        data: units,
        success: true,
        message: `${units.length} unidades ativas encontradas`
      };
    } catch (error: unknown) {
      return {
        data: [],
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar unidades ativas'
      };
    }
  }

  /**
   * Busca unidades por nome
   */
  async searchByName(name: string, organizationId?: string): Promise<ApiResponse<Unit[]>> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('name', name);
      if (organizationId) {
        queryParams.append('organizationId', organizationId);
      }

      const units = await apiRequest<Unit[]>(`/units/search?${queryParams.toString()}`);

      return {
        data: units,
        success: true,
        message: `${units.length} unidades encontradas`
      };
    } catch (error: unknown) {
      return {
        data: [],
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar unidades'
      };
    }
  }

  /**
   * Atualiza uma unidade
   */
  async update(id: string, data: Partial<Unit>): Promise<ApiResponse<Unit>> {
    try {
      const updatedUnit = await apiRequest<Unit>(`/units/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      return {
        data: updatedUnit,
        success: true,
        message: 'Unidade atualizada com sucesso'
      };
    } catch (error: unknown) {
      return {
        data: {} as Unit,
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao atualizar unidade'
      };
    }
  }

  /**
   * Desativa uma unidade (soft delete)
   */
  async delete(id: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
    try {
      const result = await apiRequest<{ success: boolean; message: string }>(`/units/${id}`, {
        method: 'DELETE',
      });

      return {
        data: result,
        success: true,
        message: 'Unidade desativada com sucesso'
      };
    } catch (error: unknown) {
      return {
        data: { success: false, message: 'Erro ao desativar unidade' },
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao desativar unidade'
      };
    }
  }
}

// Exportar instância singleton
export const unitService = new UnitService();
