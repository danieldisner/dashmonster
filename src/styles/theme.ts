import { type ThemeConfig } from '@/types';

export const lightTheme: ThemeConfig = {
  colors: {
    primary: '#3b82f6',      // Blue-500
    secondary: '#8b5cf6',    // Violet-500
    accent: '#10b981',       // Emerald-500
    background: '#ffffff',   // White
    surface: '#f8fafc',      // Slate-50
    text: '#1e293b',         // Slate-800
    textSecondary: '#64748b', // Slate-500
    border: '#e2e8f0',       // Slate-200
    success: '#10b981',      // Emerald-500
    warning: '#f59e0b',      // Amber-500
    error: '#ef4444',        // Red-500
  }
};

export const darkTheme: ThemeConfig = {
  colors: {
    primary: '#60a5fa',      // Blue-400
    secondary: '#a78bfa',    // Violet-400
    accent: '#34d399',       // Emerald-400
    background: '#0f172a',   // Slate-900
    surface: '#1e293b',      // Slate-800
    text: '#f1f5f9',         // Slate-100
    textSecondary: '#94a3b8', // Slate-400
    border: '#334155',       // Slate-700
    success: '#34d399',      // Emerald-400
    warning: '#fbbf24',      // Amber-400
    error: '#f87171',        // Red-400
  }
};

export const themeConfig = {
  light: lightTheme,
  dark: darkTheme
};

// Theme provider utilities
export function getThemeFromStorage(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  
  const stored = localStorage.getItem('dashmonster-theme');
  if (stored && (stored === 'light' || stored === 'dark')) {
    return stored;
  }
  
  // Check system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

export function setThemeInStorage(theme: 'light' | 'dark'): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('dashmonster-theme', theme);
}

export function applyThemeToDocument(theme: 'light' | 'dark'): void {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  const themeColors = themeConfig[theme].colors;
  
  // Apply theme class
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
  
  // Apply CSS custom properties
  Object.entries(themeColors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
}

// Animation variants for theme transitions
export const themeTransition = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2 }
};
