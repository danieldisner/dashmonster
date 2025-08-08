'use client';

import { useState, useEffect, useCallback } from 'react';
import { beneficiaryService } from '@/services/beneficiaryService';
import type { Unit } from '@/types';

interface UseUnitsOptions {
  enableCache?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseUnitsReturn {
  units: Unit[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  linkUnit: (beneficiaryId: string, unitId: string) => Promise<void>;
  unlinkUnit: (beneficiaryId: string, unitId: string) => Promise<void>;
}

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos

export function useUnits(options: UseUnitsOptions = {}): UseUnitsReturn {
  const {
    enableCache = true,
    autoRefresh = false,
    refreshInterval = 60000
  } = options;

  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState(0);

  // Cache validation
  const isCacheValid = useCallback(() => {
    if (!enableCache) return false;
    return Date.now() - lastUpdated < CACHE_DURATION;
  }, [enableCache, lastUpdated]);

  // Load units
  const loadUnits = useCallback(async () => {
    if (isCacheValid()) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await beneficiaryService.getUnits();
      setUnits(response.data);
      setLastUpdated(Date.now());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar unidades';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isCacheValid]);

  // Refresh units
  const refresh = useCallback(async () => {
    setLastUpdated(0);
    await loadUnits();
  }, [loadUnits]);

  // Link unit to beneficiary
  const linkUnit = useCallback(async (beneficiaryId: string, unitId: string) => {
    try {
      await beneficiaryService.linkUnit(beneficiaryId, { unitId });
      await refresh();
    } catch (error) {
      throw error;
    }
  }, [refresh]);

  // Unlink unit from beneficiary
  const unlinkUnit = useCallback(async (beneficiaryId: string, unitId: string) => {
    try {
      await beneficiaryService.unlinkUnit(beneficiaryId, { unitId });
      await refresh();
    } catch (error) {
      throw error;
    }
  }, [refresh]);

  // Effects
  useEffect(() => {
    loadUnits();
  }, [loadUnits]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refresh();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refresh]);

  return {
    units,
    isLoading,
    error,
    refresh,
    linkUnit,
    unlinkUnit
  };
}
