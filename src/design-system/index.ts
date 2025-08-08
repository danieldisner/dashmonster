/**
 * Dashmonster Design System
 * 
 * Sistema de design completo para aplicações web modernas
 * Construído com TypeScript, Tailwind CSS e React
 */

// =============================================================================
// DESIGN TOKENS
// =============================================================================
export * from './tokens';

// =============================================================================
// COMPONENTS
// =============================================================================
export * from './components';

// =============================================================================
// UTILITIES & HELPERS
// =============================================================================
// export * from './utils';

// =============================================================================
// VERSION INFO
// =============================================================================
export const DESIGN_SYSTEM_VERSION = '1.0.0';
export const DESIGN_SYSTEM_NAME = 'Dashmonster Design System';

// =============================================================================
// QUICK IMPORTS (Most Used)
// =============================================================================
export { designTokens } from './tokens';
export { Button } from './components/primitives/Button';
export { 
  Card, 
  Badge, 
  Input, 
  LoadingSpinner 
} from './components';

export { 
  ThemeProvider, 
  ToastProvider, 
  useToast 
} from './components';
