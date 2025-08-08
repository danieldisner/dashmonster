'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Search,
  Sun,
  Moon,
  User,
  LogOut,
  Settings,
  CreditCard,
  Menu,
  ChevronDown
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { useTheme } from '@/components/providers/theme-provider';
import { useToast } from '@/components/providers/toast-provider';
import { UserSwitcher } from '@/components/ui/user-switcher';
import { cn } from '@/utils';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
  className?: string;
}

export function Header({ onMobileMenuToggle, className }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    showToast({
      type: 'success',
      title: 'Logout realizado',
      description: 'Você foi desconectado com sucesso.'
    });
    router.push('/');
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      'Admin': 'Administrador',
      'Operator': 'Operador'
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: 'Novo crédito adicionado',
      message: 'R$ 50,00 foram adicionados à sua conta',
      time: '5 min atrás',
      read: false,
      type: 'credit'
    },
    {
      id: 2,
      title: 'Compra realizada',
      message: 'Compra de R$ 12,50 na Cantina Central',
      time: '1 hora atrás',
      read: false,
      type: 'purchase'
    },
    {
      id: 3,
      title: 'Sistema atualizado',
      message: 'Nova versão do sistema disponível',
      time: '2 horas atrás',
      read: true,
      type: 'system'
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className={cn(
      'sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700',
      className
    )}>
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMobileMenuToggle}
            className="p-2 transition-colors rounded-lg lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Greeting */}
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {getGreeting()}, {user?.name.split(' ')[0]}!
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {getRoleDisplayName(user?.role || '')}
            </p>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 hidden max-w-md mx-8 md:flex">
          <div className="relative w-full">
            <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full py-2 pl-10 pr-4 text-gray-900 placeholder-gray-500 transition-all bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Search Button (Mobile) */}
          <button
            className="p-2 transition-colors rounded-lg md:hidden hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Buscar"
          >
            <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Alternar tema"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-500" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Notificações"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 z-50 py-2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-80 dark:bg-gray-800 dark:border-gray-700"
              >
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Notificações
                  </h3>
                </div>
                <div className="overflow-y-auto max-h-64">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        'px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-l-4',
                        notification.read
                          ? 'border-transparent'
                          : 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </p>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                            {notification.message}
                          </p>
                        </div>
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          {notification.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                  <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    Ver todas as notificações
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Balance (for specific roles) */}
          {user?.role === 'AccountHolder' && typeof stats.availableCredits === 'number' && stats.availableCredits > 0 && (
            <div className="items-center hidden px-3 py-2 space-x-2 bg-green-100 rounded-lg sm:flex dark:bg-green-900/20">
              <CreditCard className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                {stats.availableCredits.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
          )}

          {/* User Switcher */}
          <UserSwitcher />

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center p-2 space-x-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Menu do usuário"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                <span className="text-sm font-semibold text-white">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 z-50 w-48 py-2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700"
              >
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
                
                <button
                  onClick={() => {
                    router.push('/dashboard/profile');
                    setShowUserMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 space-x-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <User className="w-4 h-4" />
                  <span>Perfil</span>
                </button>
                
                <button
                  onClick={() => {
                    router.push('/dashboard/settings');
                    setShowUserMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 space-x-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Settings className="w-4 h-4" />
                  <span>Configurações</span>
                </button>
                
                <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
                
                <button
                  onClick={() => {
                    handleLogout();
                    setShowUserMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 space-x-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
}
