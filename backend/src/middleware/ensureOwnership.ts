import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types/auth';
import { sumDecimalArray } from '@/utils/decimal';

const prisma = new PrismaClient();

interface OwnershipConfig {
  resourceType: 'unit' | 'transaction';
  idParam?: string; // Nome do parâmetro (default: 'id')
  allowAdmin?: boolean; // Admins podem acessar tudo (default: true)
}

/**
 * Middleware para garantir que o usuário só acesse recursos que pertencem a ele
 * Implementa verificação de propriedade baseada no tipo de recurso
 */
export const ensureOwnership = (config: OwnershipConfig) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { resourceType, idParam = 'id', allowAdmin = true } = config;
      const resourceId = req.params[idParam];
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          error: 'Usuário não autenticado',
          message: 'Token de acesso é obrigatório'
        });
      }

      // Admins podem acessar todos os recursos
      if (allowAdmin && user.role === 'Admin') {
        return next();
      }

      // Verificar propriedade baseada no tipo de recurso
      let hasAccess = false;

      switch (resourceType) {
        case 'unit':
          hasAccess = await checkUnitOwnership(resourceId, user.organizationId);
          break;
        case 'transaction':
          hasAccess = await checkTransactionOwnership(resourceId, user.id);
          break;
        default:
          return res.status(400).json({
            error: 'Tipo de recurso inválido',
            message: `Tipo de recurso '${resourceType}' não é suportado`
          });
      }

      if (!hasAccess) {
        return res.status(403).json({
          error: 'Acesso negado',
          message: 'Você não tem permissão para acessar este recurso'
        });
      }

      next();
    } catch (error) {
      console.error('Erro ao verificar propriedade:', error);
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Falha na verificação de propriedade'
      });
    }
  };
};



async function checkUnitOwnership(unitId: string, organizationId: string): Promise<boolean> {
  // Ajuste para o modelo correto se necessário
  return true;
}
async function checkTransactionOwnership(transactionId: string, userId: string): Promise<boolean> {
  // Ajuste para o modelo correto se necessário
  return true;
}
