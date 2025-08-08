'use client';

import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallbackPath?: string;
}

export function RoleGuard({ allowedRoles, children, fallbackPath = '/dashboard' }: RoleGuardProps) {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    console.log('🔒 RoleGuard: Verificando permissões...');
    console.log('👤 Usuário atual:', user?.name, '(', user?.role, ')');
    console.log('🎯 Roles permitidos:', allowedRoles);
    console.log('✅ Tem permissão?', user ? allowedRoles.includes(user.role) : 'Usuário não encontrado');
    
    if (user && !allowedRoles.includes(user.role)) {
      console.log(`🚫 RoleGuard: Usuário ${user.name} (${user.role}) não tem permissão para acessar esta página. Permitido apenas: ${allowedRoles.join(', ')}`);
      
      // Redirecionar para o dashboard correto baseado no role do usuário
      const correctPath = (() => {
        switch (user.role) {
          case 'Admin':
            return '/dashboard/admin';
          case 'Operator':
            return '/dashboard/operator';
          default:
            return fallbackPath;
        }
      })();

      console.log(`🔄 RoleGuard: Redirecionando para: ${correctPath}`);
      router.replace(correctPath);
    }
  }, [user, allowedRoles, router, fallbackPath]);

  // Se não há usuário, mostrar loading
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">
          <div className="w-8 h-8 mx-auto mb-4 bg-gray-300 rounded dark:bg-gray-600"></div>
          <div className="w-32 h-4 bg-gray-300 rounded dark:bg-gray-600"></div>
        </div>
      </div>
    );
  }

  // Se o usuário não tem permissão, mostrar erro temporário antes do redirecionamento
  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 text-center"
        >
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Acesso Negado
          </h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Você não tem permissão para acessar esta página.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Redirecionando para seu dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  // Se tem permissão, renderizar o conteúdo
  return <>{children}</>;
}
