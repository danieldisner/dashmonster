import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const isDemoEnabled = process.env.ENABLE_DEMO_CREDENTIALS === 'true';

// Mapeamento email → senha em texto puro (apenas para dev/demo)
const demoPasswords: Record<string, string> = {
  'admin@dashmonster.com': '123456',
  'operador@dashmonster.com': '123456',
};

if (isDemoEnabled && process.env.NODE_ENV === 'production') {
  // Fail-fast: nunca permitir rota demo em produção
  throw new Error('Rota demo não pode estar ativa em produção!');
}

if (isDemoEnabled) {
  console.warn('⚠️ Rota de credenciais demo ATIVA! Use apenas em desenvolvimento.');
}

router.get('/', async (req, res) => {
  if (!isDemoEnabled) return res.status(404).json({ error: 'Not found' });

  const users = await prisma.user.findMany({
    where: { email: { in: Object.keys(demoPasswords) } },
    select: { email: true, name: true, role: true },
  });

  const demoCreds = users.map(u => ({
    ...u,
    password: demoPasswords[u.email],
    description: u.role === 'Admin' ? 'Administrador do sistema' : 'Operador do sistema',
  }));

  res.json(demoCreds);
});

export default router;
