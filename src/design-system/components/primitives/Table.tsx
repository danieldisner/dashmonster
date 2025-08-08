import React from 'react';
import { cn } from '@/utils';

interface TableProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'striped' | 'bordered';
  size?: 'sm' | 'default' | 'lg';
}

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface TableFooterProps {
  children: React.ReactNode;
  className?: string;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
  sortable?: boolean;
  onSort?: (direction: 'asc' | 'desc') => void;
  sortDirection?: 'asc' | 'desc' | null;
  style?: React.CSSProperties;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  style?: React.CSSProperties;
}

interface TableCaptionProps {
  children: React.ReactNode;
  className?: string;
}

// Table variants
const tableVariants = {
  default: 'border-border',
  striped: 'border-border [&_tbody_tr:nth-child(odd)]:bg-muted/50',
  bordered: 'border-2 border-border [&_td]:border [&_th]:border [&_td]:border-border [&_th]:border-border'
};

// Table sizes
const tableSizes = {
  sm: '[&_th]:px-2 [&_th]:py-1 [&_td]:px-2 [&_td]:py-1 text-xs',
  default: '[&_th]:px-4 [&_th]:py-3 [&_td]:px-4 [&_td]:py-2 text-sm',
  lg: '[&_th]:px-6 [&_th]:py-4 [&_td]:px-6 [&_td]:py-3 text-base'
};

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ children, className, variant = 'default', size = 'default', ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn(
          'w-full caption-bottom border-collapse',
          tableVariants[variant],
          tableSizes[size],
          className
        )}
        {...props}
      >
        {children}
      </table>
    </div>
  )
);

Table.displayName = 'Table';

export const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn('border-b bg-muted/50', className)}
      {...props}
    >
      {children}
    </thead>
  )
);

TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ children, className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    >
      {children}
    </tbody>
  )
);

TableBody.displayName = 'TableBody';

export const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ children, className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn('border-t bg-muted/50 font-medium', className)}
      {...props}
    >
      {children}
    </tfoot>
  )
);

TableFooter.displayName = 'TableFooter';

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ children, className, onClick, selected = false, ...props }, ref) => {
    const isClickable = !!onClick;
    
    return (
      <tr
        ref={ref}
        className={cn(
          'border-b transition-colors',
          isClickable && 'cursor-pointer hover:bg-muted/50',
          selected && 'bg-muted',
          className
        )}
        onClick={onClick}
        tabIndex={isClickable ? 0 : undefined}
        role={isClickable ? 'button' : undefined}
        onKeyDown={(e) => {
          if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick?.();
          }
        }}
        {...props}
      >
        {children}
      </tr>
    );
  }
);

TableRow.displayName = 'TableRow';

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ 
    children, 
    className, 
    sortable = false, 
    onSort, 
    sortDirection = null,
    ...props 
  }, ref) => {
    const handleSort = () => {
      if (sortable && onSort) {
        const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        onSort(newDirection);
      }
    };

    return (
      <th
        ref={ref}
        className={cn(
          'text-left align-middle font-medium text-muted-foreground',
          sortable && 'cursor-pointer hover:text-foreground transition-colors select-none',
          className
        )}
        onClick={sortable ? handleSort : undefined}
        tabIndex={sortable ? 0 : undefined}
        role={sortable ? 'columnheader' : 'columnheader'}
        aria-sort={
          sortable && sortDirection
            ? sortDirection === 'asc' 
              ? 'ascending' 
              : 'descending'
            : undefined
        }
        onKeyDown={(e) => {
          if (sortable && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleSort();
          }
        }}
        {...props}
      >
        <div className="flex items-center gap-2">
          {children}
          {sortable && (
            <div className="flex flex-col">
              <svg 
                className={cn(
                  'h-3 w-3 transition-colors',
                  sortDirection === 'asc' ? 'text-foreground' : 'text-muted-foreground/50'
                )}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
              <svg 
                className={cn(
                  'h-3 w-3 transition-colors rotate-180',
                  sortDirection === 'desc' ? 'text-foreground' : 'text-muted-foreground/50'
                )}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          )}
        </div>
      </th>
    );
  }
);

TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ children, className, align = 'left', ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        'align-middle',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}
      {...props}
    >
      {children}
    </td>
  )
);

TableCell.displayName = 'TableCell';

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ children, className, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn('mt-4 text-sm text-muted-foreground', className)}
      {...props}
    >
      {children}
    </caption>
  )
);

TableCaption.displayName = 'TableCaption';

// Data Table Component - More feature-rich table for data display
interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  variant?: TableProps['variant'];
  size?: TableProps['size'];
  onRowClick?: (item: T) => void;
  selectedRows?: Set<number>;
  loading?: boolean;
  emptyMessage?: string;
  caption?: string;
}

export function DataTable<T>({
  data,
  columns,
  className,
  variant = 'default',
  size = 'default',
  onRowClick,
  selectedRows,
  loading = false,
  emptyMessage = 'Nenhum item encontrado',
  caption
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof T;
    direction: 'asc' | 'desc';
  } | null>(null);

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const handleSort = (key: keyof T) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'asc' };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-muted-foreground border-t-transparent" />
      </div>
    );
  }

  return (
    <Table variant={variant} size={size} className={className}>
      {caption && <TableCaption>{caption}</TableCaption>}
      
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={String(column.key)}
              sortable={column.sortable}
              onSort={() => handleSort(column.key)}
              sortDirection={
                sortConfig?.key === column.key ? sortConfig.direction : null
              }
              style={{ width: column.width }}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {sortedData.length === 0 ? (
          <TableRow>
            <TableCell 
              className="text-center text-muted-foreground py-8" 
              style={{ gridColumn: `span ${columns.length}` }}
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          sortedData.map((item, index) => (
            <TableRow
              key={index}
              onClick={() => onRowClick?.(item)}
              selected={selectedRows?.has(index)}
            >
              {columns.map((column) => {
                const value = item[column.key];
                const displayValue = column.render ? column.render(value, item) : String(value);
                
                return (
                  <TableCell key={String(column.key)} align={column.align}>
                    {displayValue}
                  </TableCell>
                );
              })}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

DataTable.displayName = 'DataTable';
