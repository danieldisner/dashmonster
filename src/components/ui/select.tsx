import * as React from 'react';
import { cn } from '@/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          // Base styles
          "flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Light mode styles
          "border-gray-300 bg-white text-gray-900",
          // Dark mode styles with better contrast
          "dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100",
          "dark:focus:border-blue-400 dark:focus:ring-blue-400/20",
          // Options styling for better readability in dark mode
          "[&>option]:bg-white [&>option]:text-gray-900",
          "[&>option]:dark:bg-gray-900 [&>option]:dark:text-gray-100",
          // Hover and focus states
          "hover:border-gray-400 dark:hover:border-gray-500",
          // Better focus states
          "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
          "dark:focus:border-blue-400 dark:focus:ring-blue-400/20",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';

export { Select };
