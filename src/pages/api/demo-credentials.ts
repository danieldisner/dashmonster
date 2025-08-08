// pages/api/demo-credentials.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// Usuários de demonstração conforme seed do banco
const demoUsers = [
  {
    email: 'admin@dashmonster.com',
    password: 'senha123',
    name: 'Administrador',
    role: 'Admin',
    description: 'Acesso total ao sistema.'
  },
  {
    email: 'operador@dashmonster.com',
    password: 'senha123',
    name: 'Operador',
    role: 'Operator',
    description: 'Acesso operacional para registrar vendas.'
  },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Em produção, busque do banco de dados real
  // Aqui, apenas retorna os dados estáticos
  res.status(200).json({ success: true, data: demoUsers });
}
