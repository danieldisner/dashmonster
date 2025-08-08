'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  className?: string;
  items?: BreadcrumbItem[];
}

export function Breadcrumb({ className, items }: BreadcrumbProps) {
  const pathname = usePathname();

  // Generate breadcrumb items from pathname if not provided
  const breadcrumbItems = items || generateBreadcrumbFromPath(pathname);

  return (
    <nav className={cn('flex items-center space-x-2 text-sm', className)}>
      <Link
        href="/dashboard"
        className="flex items-center text-gray-500 transition-colors dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
      >
        <Home className="w-4 h-4" />
      </Link>

      {breadcrumbItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center space-x-2"
        >
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {item.href && index < breadcrumbItems.length - 1 ? (
            <Link
              href={item.href}
              className="text-gray-500 transition-colors dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-gray-900 dark:text-white">
              {item.label}
            </span>
          )}
        </motion.div>
      ))}
    </nav>
  );
}

function generateBreadcrumbFromPath(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // Map of path segments to display names
  const segmentNames: Record<string, string> = {
    'dashboard': 'Dashboard',
    'admin': 'Administrador',
    'users': 'Usuários',
    'history': 'Histórico',
    'units': 'Unidades',
    'reports': 'Relatórios',
    'settings': 'Configurações',
    'profile': 'Perfil',
  };

  let currentPath = '';

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Skip the first 'dashboard' segment as it's represented by the home icon
    if (segment === 'dashboard' && index === 0) {
      return;
    }

    const label = segmentNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

    breadcrumbs.push({
      label,
      href: index < segments.length - 1 ? currentPath : undefined
    });
  });

  return breadcrumbs;
}
