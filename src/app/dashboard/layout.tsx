'use client';

import React from 'react';
import { useAuthStore } from '@/store';
import { PageLayout } from '@/components/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isAuthenticated } = useAuthStore();

  // Se não tiver usuário autenticado, mostrar tela de carregamento
  if (!user || !isAuthenticated) {
    return React.createElement('div', {
      className: 'min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'
    }, React.createElement('div', {
      className: 'text-center'
    }, [
      React.createElement('div', {
        key: 'spinner',
        className: 'w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4'
      }),
      React.createElement('p', {
        key: 'text',
        className: 'text-gray-600 dark:text-gray-400'
      }, 'Verificando autenticação...'),
      React.createElement('button', {
        key: 'redirect',
        onClick: () => window.location.href = '/',
        className: 'mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
      }, 'Ir para Login')
    ]));
  }

  return React.createElement(PageLayout, {}, children);
}