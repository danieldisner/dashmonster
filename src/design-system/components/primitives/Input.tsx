import React from 'react';
import { cn } from '@/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error' | 'success';
  inputSize?: 'sm' | 'default' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  helperText?: string;
  error?: string;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'error' | 'success';
  inputSize?: 'sm' | 'default' | 'lg';
  helperText?: string;
  error?: string;
  resize?: boolean;
}

interface InputGroupProps {
  children: React.ReactNode;
  className?: string;
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
}

// Input variant styles
const inputVariants = {
  default: 'border-border bg-background text-foreground focus:ring-primary focus:border-primary',
  error: 'border-red-500 bg-background text-foreground focus:ring-red-500 focus:border-red-500',
  success: 'border-green-500 bg-background text-foreground focus:ring-green-500 focus:border-green-500'
};

// Input size styles
const inputSizes = {
  sm: 'h-8 px-3 text-sm',
  default: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-base'
};

// Loading spinner component
const LoadingSpinner: React.FC<{ size?: 'sm' | 'default' }> = ({ size = 'default' }) => (
  <div className={cn(
    'animate-spin rounded-full border-2 border-muted-foreground border-t-transparent',
    size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
  )} />
);

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = 'text',
    variant = 'default',
    inputSize = 'default',
    leftIcon,
    rightIcon,
    isLoading = false,
    disabled,
    helperText,
    error,
    ...props 
  }, ref) => {
    const hasLeftIcon = leftIcon || isLoading;
    const hasRightIcon = rightIcon;
    const finalVariant = error ? 'error' : variant;

    return (
      <div className="relative">
        {/* Left Icon */}
        {hasLeftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {isLoading ? (
              <LoadingSpinner size={inputSize === 'lg' ? 'default' : 'sm'} />
            ) : (
              <div className={cn(
                inputSize === 'sm' ? 'h-4 w-4' : inputSize === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
              )}>
                {leftIcon}
              </div>
            )}
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          type={type}
          disabled={disabled || isLoading}
          className={cn(
            // Base styles
            'flex w-full rounded-md border transition-colors duration-200',
            'placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            
            // Variant styles
            inputVariants[finalVariant],
            
            // Size styles
            inputSizes[inputSize],
            
            // Icon padding adjustments
            hasLeftIcon && (inputSize === 'sm' ? 'pl-9' : inputSize === 'lg' ? 'pl-12' : 'pl-10'),
            hasRightIcon && (inputSize === 'sm' ? 'pr-9' : inputSize === 'lg' ? 'pr-12' : 'pr-10'),
            
            className
          )}
          {...props}
        />

        {/* Right Icon */}
        {hasRightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <div className={cn(
              inputSize === 'sm' ? 'h-4 w-4' : inputSize === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
            )}>
              {rightIcon}
            </div>
          </div>
        )}

        {/* Helper Text / Error */}
        {(helperText || error) && (
          <p className={cn(
            'mt-1 text-xs',
            error ? 'text-red-500' : 'text-muted-foreground'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    variant = 'default',
    helperText,
    error,
    resize = true,
    disabled,
    ...props 
  }, ref) => {
    const finalVariant = error ? 'error' : variant;

    return (
      <div className="relative">
        <textarea
          ref={ref}
          disabled={disabled}
          className={cn(
            // Base styles
            'flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm transition-colors duration-200',
            'placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            
            // Variant styles
            inputVariants[finalVariant],
            
            // Resize control
            resize ? 'resize-y' : 'resize-none',
            
            className
          )}
          {...props}
        />

        {/* Helper Text / Error */}
        {(helperText || error) && (
          <p className={cn(
            'mt-1 text-xs',
            error ? 'text-red-500' : 'text-muted-foreground'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export const InputGroup: React.FC<InputGroupProps> = ({
  children,
  className,
  label,
  required = false,
  error,
  helperText
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="text-sm font-medium leading-none text-foreground">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {children}
      
      {(helperText || error) && !React.isValidElement(children) && (
        <p className={cn(
          'text-xs',
          error ? 'text-red-500' : 'text-muted-foreground'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

InputGroup.displayName = 'InputGroup';

// Search Input - Specialized component
interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'type'> {
  onClear?: () => void;
  showClearButton?: boolean;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ 
    onClear, 
    showClearButton = true, 
    value,
    onChange,
    placeholder = 'Pesquisar...',
    ...props 
  }, ref) => {
    const hasValue = value && String(value).length > 0;

    return (
      <Input
        ref={ref}
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        leftIcon={
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
        rightIcon={
          showClearButton && hasValue && onClear ? (
            <button
              type="button"
              onClick={onClear}
              className="text-muted-foreground hover:text-foreground transition-colors pointer-events-auto"
              aria-label="Limpar campo"
              title="Limpar campo"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : undefined
        }
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';
