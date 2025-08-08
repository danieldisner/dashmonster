/**
 * Utilitários para trabalhar com tipos Decimal do Prisma
 * Resolve problemas de operações aritméticas com Decimal
 */

import { Decimal } from '@prisma/client/runtime/library';

/**
 * Converte Decimal para number de forma segura
 */
export function decimalToNumber(value: Decimal | number): number {
  if (typeof value === 'number') {
    return value;
  }
  return Number(value.toString());
}

/**
 * Converte number para Decimal
 */
export function numberToDecimal(value: number): Decimal {
  return new Decimal(value);
}

/**
 * Soma valores Decimal e number de forma segura
 */
export function safeAdd(a: Decimal | number, b: Decimal | number): number {
  const numA = decimalToNumber(a);
  const numB = decimalToNumber(b);
  return numA + numB;
}

/**
 * Subtrai valores Decimal e number de forma segura
 */
export function safeSubtract(a: Decimal | number, b: Decimal | number): number {
  const numA = decimalToNumber(a);
  const numB = decimalToNumber(b);
  return numA - numB;
}

/**
 * Multiplica valores Decimal e number de forma segura
 */
export function safeMultiply(a: Decimal | number, b: Decimal | number): number {
  const numA = decimalToNumber(a);
  const numB = decimalToNumber(b);
  return numA * numB;
}

/**
 * Divide valores Decimal e number de forma segura
 */
export function safeDivide(a: Decimal | number, b: Decimal | number): number {
  const numA = decimalToNumber(a);
  const numB = decimalToNumber(b);
  if (numB === 0) {
    throw new Error('Divisão por zero não permitida');
  }
  return numA / numB;
}

/**
 * Compara valores Decimal e number de forma segura
 */
export function safeCompare(a: Decimal | number, b: Decimal | number): number {
  const numA = decimalToNumber(a);
  const numB = decimalToNumber(b);
  return numA - numB;
}

/**
 * Verifica se o primeiro valor é maior que o segundo
 */
export function isGreaterThan(a: Decimal | number, b: Decimal | number): boolean {
  return safeCompare(a, b) > 0;
}

/**
 * Verifica se o primeiro valor é menor que o segundo
 */
export function isLessThan(a: Decimal | number, b: Decimal | number): boolean {
  return safeCompare(a, b) < 0;
}

/**
 * Verifica se o primeiro valor é maior ou igual ao segundo
 */
export function isGreaterThanOrEqual(a: Decimal | number, b: Decimal | number): boolean {
  return safeCompare(a, b) >= 0;
}

/**
 * Verifica se o primeiro valor é menor ou igual ao segundo
 */
export function isLessThanOrEqual(a: Decimal | number, b: Decimal | number): boolean {
  return safeCompare(a, b) <= 0;
}

/**
 * Reduce helper para somar arrays de valores Decimal
 */
export function sumDecimalArray<T>(
  array: T[],
  getValue: (item: T) => Decimal | number
): number {
  return array.reduce((sum, item) => {
    return safeAdd(sum, getValue(item));
  }, 0);
}

/**
 * Formata valor monetário com 2 casas decimais
 */
export function formatCurrency(value: Decimal | number): string {
  const numValue = decimalToNumber(value);
  return numValue.toFixed(2);
}

/**
 * Converte Decimal para objeto JSON serializable
 */
export function decimalToJson(value: Decimal | number): number {
  return decimalToNumber(value);
}

/**
 * Helper para atualizar valores Decimal em updates do Prisma
 */
export function createDecimalUpdate(value: number): Decimal {
  return numberToDecimal(value);
}
