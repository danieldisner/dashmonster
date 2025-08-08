import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const isDev = process.env.NODE_ENV !== 'production';

router.get('/demo-users', async (req, res) => {
  if (!isDev) return res.status(404).json({ error: 'Not found' });

  // Ajuste os emails conforme os seeds de dev
  const users = await prisma.user.findMany({
    where: { email: { in: ['admin@dashmonster.com', 'operador@dashmonster.com'] } },
    select: { email: true, name: true, role: true },
  });

  res.json(users);
});

export default router;
