'use client';

import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
// import { AuthDebug } from '@/components/debug/auth-debug';

export default function DashboardRedirect() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    console.log('🏠 DashboardRedirect: useEffect executado');
    console.log('🔍 DashboardRedirect: user:', user);
    console.log('🔍 DashboardRedirect: isAuthenticated:', isAuthenticated);
    
    if (user && isAuthenticated) {
      console.log('✅ DashboardRedirect: Usuário autenticado, role:', user.role);
      // Redirect based on user role
      switch (user.role) {
        case 'Admin':
          console.log('➡️ DashboardRedirect: Redirecionando para Admin');
          router.replace('/dashboard/admin');
          break;
        case 'AccountHolder':
          console.log('➡️ DashboardRedirect: Redirecionando para AccountHolder');
          router.replace('/dashboard/account-holder');
          break;
        case 'Beneficiary':
          console.log('➡️ DashboardRedirect: Redirecionando para Beneficiary');
          router.replace('/dashboard/beneficiary');
          break;
        case 'Operator':
          console.log('➡️ DashboardRedirect: Redirecionando para Operator');
          router.replace('/dashboard/operator');
          break;
        default:
          console.log('➡️ DashboardRedirect: Redirecionando para Admin (default)');
          router.replace('/dashboard/admin');
      }
    } else {
      console.log('❌ DashboardRedirect: Usuário não autenticado, redirecionando para login');
      router.replace('/');
    }
  }, [user, isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
        <p className="text-gray-600 dark:text-gray-400">
          Redirecionando para seu dashboard...
        </p>
      </motion.div>
      
      {/* Debug Component */}
  {/* <AuthDebug /> */}
    </div>
  );
}
