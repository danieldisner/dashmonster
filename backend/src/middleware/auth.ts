import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  organizationId: string;
}

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Token não fornecido',
        message: 'Token de acesso é obrigatório',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer '

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Verificar se usuário ainda existe e está ativo
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Token inválido',
        message: 'Usuário não encontrado ou inativo',
      });
    }

    // Adicionar dados do usuário à requisição
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: 'Token inválido',
        message: 'Token expirado ou malformado',
      });
    }

    console.error('Erro no middleware de autenticação:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Tente novamente mais tarde',
    });
  }
};

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userRole = req.user?.role;

      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json({
          error: 'Acesso negado',
          message: 'Você não tem permissão para acessar este recurso',
        });
      }

      next();
    } catch (error) {
      console.error('Erro no middleware de role:', error);
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Tente novamente mais tarde',
      });
    }
  };
};

// Middleware específicos para cada role
export const adminOnly = roleMiddleware(['ADMIN']);
export const operatorOnly = roleMiddleware(['ADMIN', 'OPERATOR']);

// Middleware para múltiplos roles


export { AuthenticatedRequest };
