'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, Moon, Sun } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { useTheme } from '@/components/providers/theme-provider';
import { useToast } from '@/components/providers/toast-provider';
import { DemoCredentials } from '@/components/ui/demo-credentials';
// import { AuthDebug } from '@/components/debug/auth-debug';
import { authService } from '@/services/auth';
import { cn } from '@/utils';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, logout, user, isAuthenticated } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleCredentialSelect = (email: string, password: string) => {
    setValue('email', email);
    setValue('password', password);
    showToast({
      type: 'success',
      title: 'Credenciais preenchidas',
      description: 'Email e senha foram preenchidos automaticamente'
    });
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      console.log('🚀 LoginPage: Iniciando processo de login para:', data.email);
      console.log('🔍 LoginPage: Estado atual - user:', user, 'isAuthenticated:', isAuthenticated);
      
      // Limpar qualquer sessão anterior
      logout();
      console.log('🧹 LoginPage: Sessão anterior limpa');
      
      const response = await authService.login(data);
      console.log('📝 LoginPage: Resposta do authService:', response);
      
      if (response.success) {
        console.log('✅ LoginPage: Login bem-sucedido, fazendo login no store');
        login(response.data);
        
        showToast({
          type: 'success',
          title: 'Login realizado com sucesso!',
          description: `Bem-vindo(a), ${response.data.name}`
        });
        
        console.log('🔄 LoginPage: Redirecionando baseado no role:', response.data.role);
        
        // Redirect based on user role
        switch (response.data.role) {
          case 'Admin':
            console.log('➡️ LoginPage: Redirecionando para /dashboard/admin');
            router.push('/dashboard/admin');
            break;
          case 'AccountHolder':
            console.log('➡️ LoginPage: Redirecionando para /dashboard/account-holder');
            router.push('/dashboard/account-holder');
            break;
          case 'Beneficiary':
            console.log('➡️ LoginPage: Redirecionando para /dashboard/beneficiary');
            router.push('/dashboard/beneficiary');
            break;
          case 'Operator':
            console.log('➡️ LoginPage: Redirecionando para /dashboard/operator');
            router.push('/dashboard/operator');
            break;
          default:
            console.log('➡️ LoginPage: Redirecionando para /dashboard (default)');
            router.push('/dashboard');
        }
      } else {
        showToast({
          type: 'error',
          title: 'Erro no login',
          description: response.message
        });
      }
    } catch {
      showToast({
        type: 'error',
        title: 'Erro no login',
        description: 'Erro interno do servidor. Tente novamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed p-2 transition-all duration-200 bg-white border border-gray-200 rounded-lg shadow-lg top-4 right-4 dark:bg-slate-800 dark:border-gray-700 hover:shadow-xl"
        aria-label="Alternar tema"
      >
        {theme === 'light' ? (
          <Moon className="w-5 h-5 text-gray-600" />
        ) : (
          <Sun className="w-5 h-5 text-yellow-500" />
        )}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="p-8 bg-white border border-gray-200 shadow-xl dark:bg-slate-800 rounded-2xl dark:border-gray-700">
          {/* Logo and Title */}
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl"
            >
              <span className="text-2xl font-bold text-white">DM</span>
            </motion.div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              Dashmonster
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sistema de Gerenciamento de Dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                autoComplete="email"
                className={cn(
                  'input',
                  errors.email && 'input-error'
                )}
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Senha
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  className={cn(
                    'input pr-10',
                    errors.password && 'input-error'
                  )}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary btn-lg"
            >
              {isLoading ? (
                <div className="w-5 h-5 mr-2 loading" />
              ) : (
                <LogIn className="w-5 h-5 mr-2" />
              )}
              {isLoading ? 'Entrando...' : 'Entrar'}
            </motion.button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8">
            <DemoCredentials onCredentialSelect={handleCredentialSelect} />
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © 2024 Dashmonster. Sistema de demonstração.
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* Debug Component */}
  {/* <AuthDebug /> */}
    </div>
  );
}
