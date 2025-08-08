'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store';
import { useToast } from '@/components/providers/toast-provider';
import { userService } from '@/services/user';
import { User, Users, Settings, Shield, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import type { UserWithDescription } from '@/services/user';

interface UserSwitcherProps {
  className?: string;
}

export function UserSwitcher({ className }: UserSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<UserWithDescription[]>([]);
  const { user, login } = useAuthStore();
  const { showToast } = useToast();
  const router = useRouter();

  // Carregar usuários disponíveis
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await userService.getAvailableUsers();
        setAvailableUsers(users);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        showToast({
          type: 'error',
          title: 'Erro ao carregar usuários',
          description: 'Não foi possível carregar a lista de usuários disponíveis'
        });
      }
    };

    loadUsers();
  }, [showToast]);

  const handleUserSwitch = (newUser: UserWithDescription) => {
    console.log('🔄 UserSwitcher: Trocando de usuário:', user?.id, '->', newUser.id);
    
    login(newUser);
    setIsOpen(false);
    
    showToast({
      type: 'success',
      title: 'Usuário alterado',
      description: `Logado como ${newUser.name} (${newUser.role})`
    });

    console.log('✅ UserSwitcher: Login executado, novo usuário deveria ser:', newUser.id);
    
    // Redirecionar para o dashboard correto baseado no role
    const redirectPath = (() => {
      switch (newUser.role) {
        case 'Admin':
          return '/dashboard/admin';
        case 'AccountHolder':
          return '/dashboard/account-holder';
        case 'Beneficiary':
          return '/dashboard/beneficiary';
        case 'Operator':
          return '/dashboard/operator';
        default:
          return '/dashboard';
      }
    })();

    console.log('🔄 UserSwitcher: Redirecionando para:', redirectPath);
    router.push(redirectPath);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin':
        return <Shield className="h-4 w-4" />;
      case 'AccountHolder':
        return <Users className="h-4 w-4" />;
      case 'Operator':
        return <Settings className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'AccountHolder':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Operator':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Compact Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Trocar usuário"
        title="Trocar usuário (teste)"
      >
        <UserCheck className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
            >
              {/* Header */}
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <UserCheck className="h-4 w-4" />
                  <span>Trocar Usuário (Teste)</span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Para facilitar os testes do sistema
                </p>
              </div>

              {/* Current User */}
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getRoleIcon(user?.role || '')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                  <Badge className={`text-xs ${getRoleBadgeColor(user?.role || '')}`}>
                    Atual
                  </Badge>
                </div>
              </div>

              {/* Available Users */}
              <div className="px-2 py-2">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1">
                  Usuários disponíveis:
                </p>
                
                <div className="space-y-1">
                  {availableUsers.map((testUser) => (
                    <button
                      key={testUser.id}
                      onClick={() => handleUserSwitch(testUser)}
                      disabled={testUser.id === user?.id}
                      className={`w-full p-2 text-left rounded-lg transition-all ${
                        testUser.id === user?.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 cursor-not-allowed opacity-50'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {getRoleIcon(testUser.role)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {testUser.name}
                            </p>
                            {testUser.id === user?.id && (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xs">
                                ✓
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {testUser.description}
                          </p>
                        </div>
                        <Badge className={`text-xs flex-shrink-0 ${getRoleBadgeColor(testUser.role)}`}>
                          {testUser.role}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  💡 Esta funcionalidade é apenas para testes durante o desenvolvimento
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
