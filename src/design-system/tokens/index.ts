/**
 * Dashmonster Design System - Design Tokens
 * Core design tokens that define the visual foundation
 */

// =============================================================================
// COLORS
// =============================================================================

export const colors = {
  // Primary Palette
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Main Primary
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Secondary Palette
  secondary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',  // Main Secondary
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
  
  // Success/Accent
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',  // Main Success
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  
  // Warning
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',  // Main Warning
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  // Error
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',  // Main Error
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // Neutral/Gray
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  
  // Semantic Colors
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

// =============================================================================
// SPACING
// =============================================================================

export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',   // 2px
  1: '0.25rem',      // 4px
  1.5: '0.375rem',   // 6px
  2: '0.5rem',       // 8px
  2.5: '0.625rem',   // 10px
  3: '0.75rem',      // 12px
  3.5: '0.875rem',   // 14px
  4: '1rem',         // 16px
  5: '1.25rem',      // 20px
  6: '1.5rem',       // 24px
  7: '1.75rem',      // 28px
  8: '2rem',         // 32px
  9: '2.25rem',      // 36px
  10: '2.5rem',      // 40px
  11: '2.75rem',     // 44px
  12: '3rem',        // 48px
  14: '3.5rem',      // 56px
  16: '4rem',        // 64px
  20: '5rem',        // 80px
  24: '6rem',        // 96px
  28: '7rem',        // 112px
  32: '8rem',        // 128px
  36: '9rem',        // 144px
  40: '10rem',       // 160px
  44: '11rem',       // 176px
  48: '12rem',       // 192px
  52: '13rem',       // 208px
  56: '14rem',       // 224px
  60: '15rem',       // 240px
  64: '16rem',       // 256px
  72: '18rem',       // 288px
  80: '20rem',       // 320px
  96: '24rem',       // 384px
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['Fira Code', 'monospace'],
  },
  
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
    '5xl': ['3rem', { lineHeight: '1' }],         // 48px
    '6xl': ['3.75rem', { lineHeight: '1' }],      // 60px
  },
  
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
} as const;

// =============================================================================
// BORDERS & RADIUS
// =============================================================================

export const borders = {
  width: {
    0: '0',
    DEFAULT: '1px',
    2: '2px',
    4: '4px',
    8: '8px',
  },
  
  radius: {
    none: '0',
    sm: '0.125rem',    // 2px
    DEFAULT: '0.25rem', // 4px
    md: '0.375rem',    // 6px
    lg: '0.5rem',      // 8px
    xl: '0.75rem',     // 12px
    '2xl': '1rem',     // 16px
    '3xl': '1.5rem',   // 24px
    full: '9999px',
  },
} as const;

// =============================================================================
// SHADOWS
// =============================================================================

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
} as const;

// =============================================================================
// ANIMATIONS
// =============================================================================

export const animations = {
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
  },
  
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// =============================================================================
// BREAKPOINTS
// =============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// =============================================================================
// THEME TOKENS
// =============================================================================

export const lightTheme = {
  colors: {
    primary: colors.primary[500],
    primaryHover: colors.primary[600],
    secondary: colors.secondary[500],
    secondaryHover: colors.secondary[600],
    accent: colors.success[500],
    accentHover: colors.success[600],
    
    background: colors.white,
    surface: colors.gray[50],
    surfaceHover: colors.gray[100],
    
    text: colors.gray[900],
    textSecondary: colors.gray[600],
    textMuted: colors.gray[500],
    
    border: colors.gray[200],
    borderHover: colors.gray[300],
    
    success: colors.success[500],
    warning: colors.warning[500],
    error: colors.error[500],
    
    // Component specific
    cardBg: colors.white,
    inputBg: colors.white,
    buttonPrimary: colors.primary[500],
    buttonSecondary: colors.gray[100],
  }
} as const;

export const darkTheme = {
  colors: {
    primary: colors.primary[400],
    primaryHover: colors.primary[300],
    secondary: colors.secondary[400],
    secondaryHover: colors.secondary[300],
    accent: colors.success[400],
    accentHover: colors.success[300],
    
    background: colors.gray[900],
    surface: colors.gray[800],
    surfaceHover: colors.gray[700],
    
    text: colors.gray[100],
    textSecondary: colors.gray[400],
    textMuted: colors.gray[500],
    
    border: colors.gray[700],
    borderHover: colors.gray[600],
    
    success: colors.success[400],
    warning: colors.warning[400],
    error: colors.error[400],
    
    // Component specific
    cardBg: colors.gray[800],
    inputBg: colors.gray[800],
    buttonPrimary: colors.primary[400],
    buttonSecondary: colors.gray[700],
  }
} as const;

// =============================================================================
// COMPONENT TOKENS
// =============================================================================

export const components = {
  button: {
    height: {
      sm: spacing[8],      // 32px
      md: spacing[10],     // 40px
      lg: spacing[12],     // 48px
    },
    padding: {
      sm: `${spacing[2]} ${spacing[3]}`,  // 8px 12px
      md: `${spacing[2.5]} ${spacing[4]}`, // 10px 16px
      lg: `${spacing[3]} ${spacing[6]}`,  // 12px 24px
    },
    fontSize: {
      sm: typography.fontSize.sm,
      md: typography.fontSize.base,
      lg: typography.fontSize.lg,
    },
    borderRadius: borders.radius.md,
  },
  
  card: {
    padding: spacing[6],        // 24px
    borderRadius: borders.radius.lg,
    shadow: shadows.sm,
  },
  
  input: {
    height: spacing[10],        // 40px
    padding: `${spacing[2]} ${spacing[3]}`, // 8px 12px
    borderRadius: borders.radius.md,
    fontSize: typography.fontSize.sm,
  },
  
  toast: {
    borderRadius: borders.radius.lg,
    padding: spacing[4],        // 16px
    shadow: shadows.lg,
  },
} as const;

// Export all tokens as a cohesive design system
export const designTokens = {
  colors,
  spacing,
  typography,
  borders,
  shadows,
  animations,
  breakpoints,
  lightTheme,
  darkTheme,
  components,
} as const;

export type DesignTokens = typeof designTokens;
export type ColorScale = typeof colors.primary;
export type ThemeColors = typeof lightTheme.colors;
