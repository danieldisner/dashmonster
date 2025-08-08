import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export class AuthController {
  /**
   * Login do usuário
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.isActive) {
        return res.status(401).json({ error: 'Credenciais inválidas', message: 'Email ou senha incorretos' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Credenciais inválidas', message: 'Email ou senha incorretos' });
      }
      const accessToken = jwt.sign({ userId: user.id, email: user.email, role: user.role, tenantId: user.tenantId }, process.env.JWT_SECRET!, { expiresIn: '30m' });
      const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
      await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
        organizationId: user.organizationId ?? '',
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      };
      res.json({ success: true, message: 'Login realizado com sucesso', data: { user: userData, accessToken, refreshToken } });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      }
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro interno do servidor', message: 'Tente novamente mais tarde' });
    }
  }

  /**
   * Logout do usuário (stub)
   */
  logout(req: Request, res: Response) {
    // Apenas retorna sucesso (ajuste conforme necessário)
    res.json({ success: true, message: 'Logout realizado com sucesso' });
  }

  /**
   * Refresh token (stub)
   */
  refresh(req: Request, res: Response) {
    // Apenas retorna sucesso (ajuste conforme necessário)
    res.json({ success: true, message: 'Token atualizado (stub)' });
  }

  /**
   * Retorna dados do usuário autenticado (stub)
   */
  me(req: Request, res: Response) {
    // Apenas retorna um stub seguro (ajuste conforme necessário)
    res.json({ success: true, message: 'Usuário autenticado (stub)' });
  }
}
