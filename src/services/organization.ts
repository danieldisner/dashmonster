import type { Organization, CreateOrganizationForm, ApiResponse } from '@/types';

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

class OrganizationService {
  constructor() {
    // Service agora usa API real - não precisa de inicialização localStorage
  }

  /**
   * Cria uma nova organização
   */
  async create(data: CreateOrganizationForm): Promise<ApiResponse<Organization>> {
    try {
      const organization = await apiRequest<Organization>('/organizations', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          isActive: true
        }),
      });

      return {
        data: organization,
        success: true,
        message: 'Organização criada com sucesso'
      };
    } catch (error: unknown) {
      return {
        data: {} as Organization,
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao criar organização'
      };
    }
  }

  /**
   * Busca todas as organizações
   */
  async getAll(): Promise<ApiResponse<Organization[]>> {
    try {
      const organizations = await apiRequest<Organization[]>('/organizations');

      return {
        data: organizations,
        success: true,
        message: `${organizations.length} organizações encontradas`
      };
    } catch (error: unknown) {
      return {
        data: [],
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar organizações'
      };
    }
  }

  /**
   * Busca organização por ID
   */
  async getById(id: string): Promise<ApiResponse<Organization | null>> {
    try {
      const organization = await apiRequest<Organization>(`/organizations/${id}`);

      return {
        data: organization,
        success: true,
        message: 'Organização encontrada'
      };
    } catch (error: unknown) {
      return {
        data: null,
        success: false,
        message: error instanceof Error ? error.message : 'Organização não encontrada'
      };
    }
  }

  /**
   * Busca apenas organizações ativas
   */
  async getActiveOrganizations(): Promise<ApiResponse<Organization[]>> {
    try {
      const organizations = await apiRequest<Organization[]>('/organizations/active');

      return {
        data: organizations,
        success: true,
        message: `${organizations.length} organizações ativas encontradas`
      };
    } catch (error: unknown) {
      return {
        data: [],
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar organizações ativas'
      };
    }
  }

  /**
   * Busca organizações por nome
   */
  async searchByName(name: string): Promise<ApiResponse<Organization[]>> {
    try {
      const organizations = await apiRequest<Organization[]>(`/organizations/search?name=${encodeURIComponent(name)}`);

      return {
        data: organizations,
        success: true,
        message: `${organizations.length} organizações encontradas`
      };
    } catch (error: unknown) {
      return {
        data: [],
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar organizações'
      };
    }
  }

  /**
   * Atualiza uma organização
   */
  async update(id: string, data: Partial<Organization>): Promise<ApiResponse<Organization>> {
    try {
      const updatedOrganization = await apiRequest<Organization>(`/organizations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      return {
        data: updatedOrganization,
        success: true,
        message: 'Organização atualizada com sucesso'
      };
    } catch (error: unknown) {
      return {
        data: {} as Organization,
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao atualizar organização'
      };
    }
  }

  /**
   * Desativa uma organização (soft delete)
   */
  async delete(id: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
    try {
      const result = await apiRequest<{ success: boolean; message: string }>(`/organizations/${id}`, {
        method: 'DELETE',
      });

      return {
        data: result,
        success: true,
        message: 'Organização desativada com sucesso'
      };
    } catch (error: unknown) {
      return {
        data: { success: false, message: 'Erro ao desativar organização' },
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao desativar organização'
      };
    }
  }
}

// Exportar instância singleton
export const organizationService = new OrganizationService();
