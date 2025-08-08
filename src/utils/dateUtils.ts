// Utility functions for date calculations

/**
 * Calcula a idade atual do beneficiário
 */
export function calculateAge(dateOfBirth: string): number {
  const birth = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Calcula os dias até o próximo aniversário
 */
export function daysUntilNextBirthday(dateOfBirth: string): number {
  const birth = new Date(dateOfBirth);
  const today = new Date();
  
  // Próximo aniversário neste ano
  const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  
  // Se já passou este ano, próximo é no ano que vem
  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }
  
  const diffTime = nextBirthday.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Formata data de aniversário para exibição
 */
export function formatBirthday(dateOfBirth: string): string {
  const birth = new Date(dateOfBirth);
  return birth.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit'
  });
}

/**
 * Verifica se é aniversário hoje
 */
export function isBirthdayToday(dateOfBirth: string): boolean {
  const birth = new Date(dateOfBirth);
  const today = new Date();
  
  return birth.getDate() === today.getDate() && 
         birth.getMonth() === today.getMonth();
}

/**
 * Verifica se é aniversário esta semana (próximos 7 dias)
 */
export function isBirthdayThisWeek(dateOfBirth: string): boolean {
  const daysUntil = daysUntilNextBirthday(dateOfBirth);
  return daysUntil <= 7;
}
