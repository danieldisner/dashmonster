'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/utils';
import { memo } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const LoadingSpinner = memo(function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Loader2 className={cn('animate-spin', sizeClasses[size])} />
      {text && <span className="text-sm">{text}</span>}
    </div>
  );
});

interface ButtonLoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
}

export const ButtonLoading = memo(function ButtonLoading({ isLoading, children, loadingText, className }: ButtonLoadingProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      <span>{isLoading && loadingText ? loadingText : children}</span>
    </div>
  );
});

interface DiscreteLoadingProps {
  isLoading: boolean;
  className?: string;
}

export const DiscreteLoading = memo(function DiscreteLoading({ isLoading, className }: DiscreteLoadingProps) {
  if (!isLoading) return null;

  return (
    <div className={cn(
      'fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 border border-gray-200 dark:border-gray-700',
      'animate-in slide-in-from-right-2 duration-200',
      className
    )}>
      <LoadingSpinner size="sm" text="Processando..." />
    </div>
  );
});
