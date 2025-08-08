import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils';

/**
 * Button Component - Design System
 * 
 * Sistema de botões baseado nos design tokens do Dashmonster DS.
 * Inclui variants semânticos, tamanhos responsivos, estados de loading
 * e suporte completo a dark/light theme.
 */

const buttonVariants = cva(
  // Base styles usando design tokens
  [
    'inline-flex items-center justify-center gap-2',
    'whitespace-nowrap rounded-md font-medium',
    'transition-all duration-200 ease-in-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-[0.98] transform',
  ],
  {
    variants: {
      variant: {
        // Primary - Cor principal do sistema
        primary: [
          'bg-blue-500 text-white shadow-sm',
          'hover:bg-blue-600 hover:shadow-md',
          'focus-visible:ring-blue-500',
          'dark:bg-blue-400 dark:hover:bg-blue-300',
        ],
        
        // Secondary - Cor secundária
        secondary: [
          'bg-violet-500 text-white shadow-sm',
          'hover:bg-violet-600 hover:shadow-md',
          'focus-visible:ring-violet-500',
          'dark:bg-violet-400 dark:hover:bg-violet-300',
        ],
        
        // Success - Para ações positivas
        success: [
          'bg-emerald-500 text-white shadow-sm',
          'hover:bg-emerald-600 hover:shadow-md',
          'focus-visible:ring-emerald-500',
          'dark:bg-emerald-400 dark:hover:bg-emerald-300',
        ],
        
        // Destructive - Para ações perigosas
        destructive: [
          'bg-red-500 text-white shadow-sm',
          'hover:bg-red-600 hover:shadow-md',
          'focus-visible:ring-red-500',
          'dark:bg-red-400 dark:hover:bg-red-300',
        ],
        
        // Outline - Botão com borda
        outline: [
          'border border-gray-300 bg-white text-gray-700',
          'hover:bg-gray-50 hover:border-gray-400',
          'focus-visible:ring-gray-500',
          'dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200',
          'dark:hover:bg-gray-700 dark:hover:border-gray-500',
        ],
        
        // Ghost - Botão transparente
        ghost: [
          'text-gray-700 hover:bg-gray-100',
          'focus-visible:ring-gray-500',
          'dark:text-gray-300 dark:hover:bg-gray-700',
        ],
        
        // Link - Estilo de link
        link: [
          'text-blue-500 underline-offset-4',
          'hover:underline hover:text-blue-600',
          'focus-visible:ring-blue-500',
          'dark:text-blue-400 dark:hover:text-blue-300',
        ],
      },
      
      size: {
        // Small - Para espaços reduzidos
        sm: [
          'h-8 px-3 text-sm',
          'rounded-md',
        ],
        
        // Default - Tamanho padrão
        default: [
          'h-10 px-4 text-sm',
          'rounded-md',
        ],
        
        // Large - Para CTAs importantes
        lg: [
          'h-12 px-6 text-base',
          'rounded-lg',
        ],
        
        // Icon - Para botões com apenas ícone
        icon: [
          'h-10 w-10',
          'rounded-md',
        ],
        
        // Icon Small
        iconSm: [
          'h-8 w-8',
          'rounded-md',
        ],
        
        // Icon Large
        iconLg: [
          'h-12 w-12',
          'rounded-lg',
        ],
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Show loading spinner */
  loading?: boolean;
  /** Icon to display at the start */
  leftIcon?: React.ReactNode;
  /** Icon to display at the end */
  rightIcon?: React.ReactNode;
  /** Make button full width */
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    children, 
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && 'w-full',
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        
        {!loading && leftIcon && (
          <span className="h-4 w-4">{leftIcon}</span>
        )}
        
        {children}
        
        {!loading && rightIcon && (
          <span className="h-4 w-4">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
