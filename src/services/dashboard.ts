// Serviço mock para dashboard admin

export type AdminDashboardStats = {
  totalUsers: number;
  totalCompanies: number;
  totalRoles: number;
  totalPermissions: number;
  totalMenus: number;
};

export type RecentTransaction = {
  id: string;
  date: string;
  user: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
};

export const dashboardService = {
  async getAdminDashboardStats(): Promise<{ success: boolean; data: AdminDashboardStats }> {
    // Simula fetch de métricas
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            totalUsers: 128,
            totalCompanies: 12,
            totalRoles: 5,
            totalPermissions: 24,
            totalMenus: 8,
          },
        });
      }, 300);
    });
  },

  async getRecentTransactions(limit = 5): Promise<{ success: boolean; data: RecentTransaction[] }> {
    // Simula fetch de transações recentes
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: Array.from({ length: limit }).map((_, i) => ({
            id: `tx-${i + 1}`,
            date: `2025-08-0${i + 1}`,
            user: `Usuário ${i + 1}`,
            amount: Math.round(Math.random() * 1000 + 100),
            status: ['success', 'pending', 'failed'][i % 3] as 'success' | 'pending' | 'failed',
          })),
        });
      }, 300);
    });
  },
};
