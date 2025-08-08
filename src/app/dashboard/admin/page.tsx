'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Building2,
  Package,
  CreditCard,
  ShoppingCart,
  Shield,
  Settings
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { RoleGuard } from '@/components/auth';
import { dashboardService, type AdminDashboardStats, type RecentTransaction } from '@/services/dashboard';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Key única para forçar re-mount quando usuário muda
  const userKey = user?.id || 'no-user';

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);

      try {
        const [statsResponse, transactionsResponse] = await Promise.all([
          dashboardService.getAdminDashboardStats(),
          dashboardService.getRecentTransactions(5)
        ]);

        if (statsResponse.success) {
          setStats(statsResponse.data);
        }

        if (transactionsResponse.success) {
          setRecentTransactions(transactionsResponse.data);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.id]);

  // Limpar estado ao trocar usuário
  useEffect(() => {
    setStats(null);
    setRecentTransactions([]);
    setLoading(true);
  }, [user?.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="animate-pulse">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statsCards = [
      {
        title: 'Usuários',
        value: stats?.totalUsers ? stats.totalUsers.toLocaleString('pt-BR') : '0',
        icon: Users,
        color: 'text-blue-500',
        bgColor: 'bg-blue-100 dark:bg-blue-900/20'
      },
      {
        title: 'Empresas',
        value: stats?.totalCompanies ? stats.totalCompanies.toLocaleString('pt-BR') : '0',
        icon: Building2,
        color: 'text-purple-500',
        bgColor: 'bg-purple-100 dark:bg-purple-900/20'
      },
      {
        title: 'Funções (Roles)',
        value: stats?.totalRoles ? stats.totalRoles.toLocaleString('pt-BR') : '0',
        icon: Shield,
        color: 'text-green-500',
        bgColor: 'bg-green-100 dark:bg-green-900/20'
      },
      {
        title: 'Permissões',
        value: stats?.totalPermissions ? stats.totalPermissions.toLocaleString('pt-BR') : '0',
        icon: Settings,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
      },
      {
        title: 'Menus',
        value: stats?.totalMenus ? stats.totalMenus.toLocaleString('pt-BR') : '0',
        icon: Package,
        color: 'text-pink-500',
        bgColor: 'bg-pink-100 dark:bg-pink-900/20'
      },
  ];

  return (
    <RoleGuard allowedRoles={['Admin']}>
      <div key={userKey} className="space-y-6">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-lg p-6 border border-border hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${card.bgColor}`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Transações Recentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-card rounded-lg border border-border"
        >
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold">Transações Recentes</h2>
            <p className="text-muted-foreground mt-1">
              Últimas atividades do sistema
            </p>
          </div>

          <div className="divide-y divide-border">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${transaction.status === 'success'
                      ? 'bg-green-100 dark:bg-green-900/20'
                      : transaction.status === 'pending'
                        ? 'bg-yellow-100 dark:bg-yellow-900/20'
                        : 'bg-red-100 dark:bg-red-900/20'}`}>
                    {transaction.status === 'success' ? (
                      <ShoppingCart className="h-4 w-4 text-green-500" />
                    ) : transaction.status === 'pending' ? (
                      <CreditCard className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <CreditCard className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {transaction.user}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.date}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`font-medium ${transaction.status === 'success' ? 'text-green-500' : transaction.status === 'pending' ? 'text-yellow-500' : 'text-red-500'}`}> 
                    R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.status === 'success' ? 'Sucesso' : transaction.status === 'pending' ? 'Pendente' : 'Falha'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 border-t border-border">
            <button className="w-full text-center text-primary hover:text-primary/80 transition-colors">
              Ver todas as transações
            </button>
          </div>
        </motion.div>
      </div>
    </RoleGuard>
  );
}
