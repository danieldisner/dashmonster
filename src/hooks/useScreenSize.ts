'use client';

import { useState, useEffect } from 'react';

// Breakpoints padrão do Tailwind CSS
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;

export function useScreenSize() {
  const [screenSize, setScreenSize] = useState<{
    width: number;
    height: number;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    currentBreakpoint: Breakpoint | 'xs';
  }>({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    currentBreakpoint: 'xs'
  });

  useEffect(() => {
    function updateScreenSize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      let currentBreakpoint: Breakpoint | 'xs' = 'xs';
      if (width >= BREAKPOINTS['2xl']) currentBreakpoint = '2xl';
      else if (width >= BREAKPOINTS.xl) currentBreakpoint = 'xl';
      else if (width >= BREAKPOINTS.lg) currentBreakpoint = 'lg';
      else if (width >= BREAKPOINTS.md) currentBreakpoint = 'md';
      else if (width >= BREAKPOINTS.sm) currentBreakpoint = 'sm';

      setScreenSize({
        width,
        height,
        isMobile: width < BREAKPOINTS.md,
        isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
        isDesktop: width >= BREAKPOINTS.lg,
        currentBreakpoint
      });
    }

    // Set initial size
    updateScreenSize();

    // Add event listener
    window.addEventListener('resize', updateScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  return screenSize;
}

// Hook for checking specific breakpoint
export function useBreakpoint(breakpoint: Breakpoint) {
  const { width } = useScreenSize();
  return width >= BREAKPOINTS[breakpoint];
}

// Hook for checking if screen is smaller than breakpoint
export function useBreakpointMax(breakpoint: Breakpoint) {
  const { width } = useScreenSize();
  return width < BREAKPOINTS[breakpoint];
}
