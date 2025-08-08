'use client';

import { useState, useCallback } from 'react';

interface LoadingState {
  [key: string]: boolean;
}

interface UseLoadingReturn {
  loading: LoadingState;
  setLoading: (key: string, isLoading: boolean) => void;
  isLoading: (key: string) => boolean;
  withLoading: <T>(key: string, asyncFn: () => Promise<T>) => Promise<T>;
}

/**
 * Hook para gerenciar estados de loading de forma granular
 * Permite controlar loading individual para diferentes operações
 */
export function useLoading(): UseLoadingReturn {
  const [loading, setLoadingState] = useState<LoadingState>({});

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setLoadingState(prev => ({
      ...prev,
      [key]: isLoading
    }));
  }, []);

  const isLoading = useCallback((key: string) => {
    return loading[key] || false;
  }, [loading]);

  const withLoading = useCallback(async <T>(key: string, asyncFn: () => Promise<T>): Promise<T> => {
    setLoading(key, true);
    try {
      const result = await asyncFn();
      return result;
    } finally {
      setLoading(key, false);
    }
  }, [setLoading]);

  return {
    loading,
    setLoading,
    isLoading,
    withLoading
  };
}
