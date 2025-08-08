'use client';

import { useCallback } from 'react';

export function useDateHelpers() {
  const calculateAge = useCallback((dateOfBirth: string): number => {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }, []);

  const formatBirthday = useCallback((dateOfBirth: string): string => {
    const birth = new Date(dateOfBirth);
    return birth.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  }, []);

  const isBirthdayToday = useCallback((dateOfBirth: string): boolean => {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    
    return birth.getMonth() === today.getMonth() && 
           birth.getDate() === today.getDate();
  }, []);

  const isBirthdayThisWeek = useCallback((dateOfBirth: string): boolean => {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    const currentYear = today.getFullYear();
    
    // Create birthday for this year
    const thisYearBirthday = new Date(currentYear, birth.getMonth(), birth.getDate());
    
    // If birthday already passed this year, check next year
    if (thisYearBirthday < today) {
      thisYearBirthday.setFullYear(currentYear + 1);
    }
    
    // Calculate days until birthday
    const diffTime = thisYearBirthday.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 7 && diffDays > 0;
  }, []);

  const daysUntilNextBirthday = useCallback((dateOfBirth: string): number => {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    const currentYear = today.getFullYear();
    
    // Create birthday for this year
    let thisYearBirthday = new Date(currentYear, birth.getMonth(), birth.getDate());
    
    // If birthday already passed this year, use next year
    if (thisYearBirthday < today) {
      thisYearBirthday = new Date(currentYear + 1, birth.getMonth(), birth.getDate());
    }
    
    // Calculate days until birthday
    const diffTime = thisYearBirthday.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, []);

  const formatCurrency = useCallback((amount: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  }, []);

  return {
    calculateAge,
    formatBirthday,
    isBirthdayToday,
    isBirthdayThisWeek,
    daysUntilNextBirthday,
    formatCurrency
  };
}
