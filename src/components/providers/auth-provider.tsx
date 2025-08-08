'use client';

import React from 'react';
import { useAuthStore } from '@/store';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simular verificação de autenticação inicial
    const checkAuth = async () => {
      try {
        // Verificar se há dados persistidos
        const storedAuth = localStorage.getItem('dashmonster-auth-storage');
        if (storedAuth) {
          const parsedAuth = JSON.parse(storedAuth);
          if (parsedAuth.state?.user && parsedAuth.state?.isAuthenticated) {
            // Usuário está autenticado
            setIsLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (userData: User) => {
    login(userData);
    setIsLoading(false);
  };

  const handleLogout = () => {
    logout();
    setIsLoading(false);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}
