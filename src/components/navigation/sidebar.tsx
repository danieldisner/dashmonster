'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ShoppingCart,
  Package,
  Settings,
  LogOut,
  Menu,
  X,
  Wallet,
  BarChart3,
  FileText,
  MapPin
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { useToast } from '@/components/providers/toast-provider';
import { cn } from '@/utils';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
  badge?: string;
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['Admin', 'AccountHolder', 'Beneficiary', 'Operator'],
  },
  {
    name: 'Usuários',
    href: '/dashboard/admin/users',
    icon: Users,
    roles: ['Admin'],
  },
  {
    name: 'Beneficiários',
    href: '/dashboard/beneficiaries',
    icon: Users,
    roles: ['Admin', 'AccountHolder'],
  },
  {
    name: 'Meus Beneficiários',
    href: '/dashboard/my-beneficiaries',
    icon: Users,
    roles: ['AccountHolder'],
  },
  {
    name: 'Meu Saldo',
    href: '/dashboard/my-balance',
    icon: Wallet,
    roles: ['Beneficiary'],
  },
  {
    name: 'Créditos',
    href: '/dashboard/credits',
    icon: CreditCard,
    roles: ['Admin', 'AccountHolder'],
  },
  {
    name: 'Transações',
    href: '/dashboard/transactions',
    icon: ShoppingCart,
    roles: ['Admin', 'AccountHolder', 'Operator'],
  },
  {
    name: 'Histórico',
    href: '/dashboard/history',
    icon: FileText,
    roles: ['Beneficiary'],
  },
  {
    name: 'Produtos',
    href: '/dashboard/products',
    icon: Package,
    roles: ['Admin', 'Operator'],
  },
  {
    name: 'Unidades',
    href: '/dashboard/units',
    icon: MapPin,
    roles: ['Admin'],
  },
  {
    name: 'Vendas',
    href: '/dashboard/sales',
    icon: BarChart3,
    roles: ['Operator'],
  },
  {
    name: 'Relatórios',
    href: '/dashboard/reports',
    icon: BarChart3,
    roles: ['Admin', 'AccountHolder'],
  },
  {
    name: 'Configurações',
    href: '/dashboard/settings',
    icon: Settings,
    roles: ['Admin', 'AccountHolder', 'Beneficiary', 'Operator'],
  },
];

interface SidebarProps {
  className?: string;
  isMobileOpen?: boolean;
  onMobileToggle?: () => void;
  onCollapseChange?: (isCollapsed: boolean) => void;
}

export function Sidebar({ className, isMobileOpen = false, onMobileToggle, onCollapseChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { showToast } = useToast();

  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onCollapseChange?.(newCollapsedState);
  };

  const filteredNavigation = navigationItems.filter(item =>
    user && item.roles.includes(user.role)
  );

  const handleLogout = () => {
    logout();
    showToast({
      type: 'success',
      title: 'Logout realizado',
      description: 'Você foi desconectado com sucesso.'
    });
    router.push('/');
  };

  const isCurrentPath = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === `/dashboard/${user?.role.toLowerCase()}`;
    }
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <motion.div
          className="flex items-center space-x-2"
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
            <span className="text-sm font-bold text-white">C</span>
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Dashmonster
            </span>
          )}
        </motion.div>

        <button
          onClick={handleToggleCollapse}
          className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Alternar menu lateral"
        >
          <Menu className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>

        <button
          onClick={() => onMobileToggle?.()}
          className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Fechar menu"
        >
          <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500">
            <span className="text-sm font-semibold text-white">
              {user?.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.role}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = isCurrentPath(item.href);

          return (
            <motion.button
              key={item.name}
              onClick={() => {
                router.push(item.href);
                onMobileToggle?.();
              }}
              className={cn(
                'w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                isCollapsed ? 'justify-center' : 'justify-start'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className={cn(
                'h-5 w-5 flex-shrink-0',
                isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'
              )} />

              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="truncate"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>

              {item.badge && !isCollapsed && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {item.badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <motion.button
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200',
            isCollapsed ? 'justify-center' : 'justify-start'
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className="flex-shrink-0 w-5 h-5" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                Sair
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        className={cn(
          'hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg',
          className
        )}
        animate={{
          width: isCollapsed ? '5rem' : '16rem'
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => onMobileToggle?.()}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-xl dark:bg-gray-800 dark:border-gray-700 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
