import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types/auth';
import { sumDecimalArray } from '@/utils/decimal';

const prisma = new PrismaClient();

interface OwnershipConfig {
  resourceType: 'beneficiary' | 'accountHolder' | 'unit' | 'transaction' | 'creditAllocation';
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
        case 'beneficiary':
          hasAccess = await checkBeneficiaryOwnership(resourceId, user.id);
          break;
        
        case 'accountHolder':
          hasAccess = await checkAccountHolderOwnership(resourceId, user.id);
          break;
        
        case 'unit':
          hasAccess = await checkUnitOwnership(resourceId, user.organizationId);
          break;
        
        case 'transaction':
          hasAccess = await checkTransactionOwnership(resourceId, user.id);
          break;
        
        case 'creditAllocation':
          hasAccess = await checkCreditAllocationOwnership(resourceId, user.id);
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

// Funções auxiliares para verificar propriedade
async function checkBeneficiaryOwnership(beneficiaryId: string, userId: string): Promise<boolean> {
  const beneficiary = await prisma.beneficiary.findFirst({
    where: {
      id: beneficiaryId,
      accountHolder: {
        userId: userId
      }
    }
  });
  return !!beneficiary;
}

async function checkAccountHolderOwnership(accountHolderId: string, userId: string): Promise<boolean> {
  const accountHolder = await prisma.accountHolder.findFirst({
    where: {
      id: accountHolderId,
      userId: userId
    }
  });
  return !!accountHolder;
}

async function checkUnitOwnership(unitId: string, organizationId: string): Promise<boolean> {
  const unit = await prisma.unit.findFirst({
    where: {
      id: unitId,
      organizationId: organizationId
    }
  });
  return !!unit;
}

async function checkTransactionOwnership(transactionId: string, userId: string): Promise<boolean> {
  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      OR: [
        { createdById: userId },
        { 
          accountHolder: {
            userId: userId
          }
        }
      ]
    }
  });
  return !!transaction;
}

async function checkCreditAllocationOwnership(creditAllocationId: string, userId: string): Promise<boolean> {
  const creditAllocation = await prisma.creditAllocation.findFirst({
    where: {
      id: creditAllocationId,
      accountHolder: {
        userId: userId
      }
    }
  });
  return !!creditAllocation;
}

/**
 * Middleware para garantir que saldos não fiquem negativos
 */
export const ensurePositiveBalance = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { amount, beneficiaryId } = req.body;

    if (amount && amount < 0) {
      return res.status(400).json({
        error: 'Valor inválido',
        message: 'O valor não pode ser negativo'
      });
    }

    // Se é uma operação de débito, verificar se há saldo suficiente
    if (beneficiaryId && amount && req.method === 'POST' && req.url.includes('/debit')) {
      const beneficiary = await prisma.beneficiary.findUnique({
        where: { id: beneficiaryId },
        include: { creditDistributions: true }
      });

      if (!beneficiary) {
        return res.status(404).json({
          error: 'Beneficiário não encontrado',
          message: 'Beneficiário não existe'
        });
      }

      const currentBalance = sumDecimalArray(
        beneficiary.creditDistributions,
        (credit) => credit.availableAmount
      );

      if (currentBalance < amount) {
        return res.status(400).json({
          error: 'Saldo insuficiente',
          message: `Saldo atual: R$ ${currentBalance.toFixed(2)}. Valor solicitado: R$ ${amount.toFixed(2)}`
        });
      }
    }

    next();
  } catch (error) {
    console.error('Erro ao verificar saldo:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Falha na verificação de saldo'
    });
  }
};
