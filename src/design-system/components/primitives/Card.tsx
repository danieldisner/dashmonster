import React from 'react';
import { cn } from '@/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'bordered' | 'ghost';
  padding?: 'none' | 'sm' | 'default' | 'lg';
  onClick?: () => void;
  hover?: boolean;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

// Card variants using Tailwind classes
const cardVariants = {
  default: 'bg-card text-card-foreground border border-border shadow-sm',
  elevated: 'bg-card text-card-foreground border border-border shadow-lg',
  bordered: 'bg-card text-card-foreground border-2 border-border',
  ghost: 'bg-muted/50 text-card-foreground border-0'
};

const paddingVariants = {
  none: '',
  sm: 'p-4',
  default: 'p-6',
  lg: 'p-8'
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    children, 
    className, 
    variant = 'default', 
    padding = 'default',
    onClick,
    hover = false,
    ...props 
  }, ref) => {
    const isClickable = !!onClick;
    
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'rounded-lg transition-all duration-200',
          
          // Variant styles
          cardVariants[variant],
          
          // Padding styles
          paddingVariants[padding],
          
          // Interactive styles
          isClickable && [
            'cursor-pointer',
            hover && 'hover:shadow-md',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
          ],
          
          // Custom className
          className
        )}
        onClick={onClick}
        onKeyDown={(e) => {
          if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick?.();
          }
        }}
        tabIndex={isClickable ? 0 : undefined}
        role={isClickable ? 'button' : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 pb-4', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, className, as: Component = 'h3', ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        'text-lg font-semibold leading-none tracking-tight text-foreground',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
);

CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    >
      {children}
    </p>
  )
);

CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('space-y-4', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center pt-4', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

// Convenience component for common card patterns
interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  variant?: CardProps['variant'];
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  variant = 'default',
  className
}) => {
  return (
    <Card variant={variant} className={className}>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-4 w-4 text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-1">
        <div className="text-2xl font-bold text-foreground">
          {value}
        </div>
        
        {trend && (
          <p className={cn(
            'text-xs flex items-center gap-1',
            trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          )}>
            <span className="inline-flex items-center">
              {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
            </span>
            {trend.label}
          </p>
        )}
        
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

StatsCard.displayName = 'StatsCard';
