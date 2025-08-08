'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

// Criar queryClient fora do componente para evitar recriações
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache por 5 minutos
      staleTime: 5 * 60 * 1000,
      // Manter cache por 10 minutos
      gcTime: 10 * 60 * 1000,
      // Retry automático em caso de erro
      retry: (failureCount, error: any) => {
        // Não fazer retry para erros 4xx (cliente)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Máximo 3 tentativas para outros erros
        return failureCount < 3;
      },
      // Refetch ao focar na janela
      refetchOnWindowFocus: true,
      // Refetch ao reconectar
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry para mutations em caso de erro de rede
      retry: (failureCount, error: any) => {
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
