export async function createUser(data: FormData) {
  await fetch('/api/users', {
    method: 'POST',
    body: data,
  });
}

export async function getUser(id: string) {
  const res = await fetch(`/api/users/${id}`);
  const json = await res.json();
  return json.data;
}

export async function updateUser(id: string, data: FormData) {
  await fetch(`/api/users/${id}`, {
    method: 'PUT',
    body: data,
  });
}
// Integração REST com backend para CRUD real
export async function getUsers() {
  const res = await fetch('/api/users');
  const json = await res.json();
  return json.data || [];
}

export async function deleteUser(id: string) {
  await fetch(`/api/users/${id}`, { method: 'DELETE' });
}
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
