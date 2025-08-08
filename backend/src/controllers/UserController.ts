import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserController {
  // Listar usuários
  async list(req: Request, res: Response) {
    const users = await prisma.user.findMany();
    res.json({ success: true, data: users });
  }

  // Buscar usuário por ID
  async get(req: Request, res: Response) {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json({ success: true, data: user });
  }

  // Criar usuário
  async create(req: Request, res: Response) {
    const { email, password, name, role, tenantId } = req.body;
    let avatarUrl: string | undefined = undefined;
    if (req.file) {
      avatarUrl = `/uploads/${req.file.filename}`;
    }
    const user = await prisma.user.create({
      data: { email, password, name, role, avatarUrl, tenantId },
    });
    res.status(201).json({ success: true, data: user });
  }

  // Atualizar usuário
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { email, name, role, tenantId, isActive } = req.body;
    let avatarUrl: string | undefined = undefined;
    if (req.file) {
      avatarUrl = `/uploads/${req.file.filename}`;
    }
    const data: any = { email, name, role, isActive };
    if (avatarUrl) data.avatarUrl = avatarUrl;
    if (tenantId) data.tenant = { connect: { id: tenantId } };
    const user = await prisma.user.update({
      where: { id },
      data,
    });
    res.json({ success: true, data: user });
  }

  // Deletar usuário
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.json({ success: true });
  }
}
