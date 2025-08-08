'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { Breadcrumb } from './breadcrumb';
import { cn } from '@/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showBreadcrumb?: boolean;
  className?: string;
  breadcrumbItems?: Array<{ label: string; href?: string }>;
}

export function PageLayout({
  children,
  title,
  description,
  showBreadcrumb = true,
  className,
  breadcrumbItems
}: PageLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user } = useAuthStore();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar 
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onCollapseChange={(collapsed) => setIsSidebarCollapsed(collapsed)}
      />

      {/* Main Content */}
      <div className={cn(
        'transition-all duration-300',
        isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
      )}>
        {/* Header */}
        <Header 
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Page Content */}
        <main className="flex-1">
          {/* Page Header */}
          {(title || showBreadcrumb) && (
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="px-4 lg:px-6 py-4">
                {showBreadcrumb && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-2"
                  >
                    <Breadcrumb items={breadcrumbItems} />
                  </motion.div>
                )}
                
                {title && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {title}
                    </h1>
                    {description && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {description}
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* Page Body */}
          <div className={cn('p-4 lg:p-6', className)}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
