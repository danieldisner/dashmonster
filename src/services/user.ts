// Serviço mock para usuários
export interface UserWithDescription {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  tenantId: string;
  organizationId: string;
  lastLogin: string;
  createdAt: string;
  description: string;
}

import type { User } from '@/types/user-management';

const mockUsers: UserWithDescription[] = [
  {
    id: '1',
    name: 'Admin',
    email: 'admin@dashmonster.com',
    role: 'Admin',
    isActive: true,
    tenantId: 'demo-tenant',
    organizationId: '',
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    description: 'Administrador do sistema',
  },
  {
    id: '2',
    name: 'Operador',
    email: 'operador@dashmonster.com',
    role: 'Operator',
    isActive: true,
    tenantId: 'demo-tenant',
    organizationId: '',
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    description: 'Usuário operador para testes',
  },
];

export const userService = {
  async getAll(): Promise<UserWithDescription[]> {
    // Simula fetch de usuários
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUsers), 300);
    });
  },
  async getById(id: string): Promise<UserWithDescription | undefined> {
    return mockUsers.find((u) => u.id === id);
  },
  async getAvailableUsers(): Promise<UserWithDescription[]> {
    // Simula fetch de usuários disponíveis para troca
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUsers), 200);
    });
  },
};
