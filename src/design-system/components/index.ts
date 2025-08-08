/**
 * Dashmonster Design System - Components Index
 * 
 * Exporta todos os componentes do design system de forma organizada
 */

// =============================================================================
// PRIMITIVES - Componentes básicos do Design System
// =============================================================================

// Button - Enhanced with design tokens
export { Button, buttonVariants } from './primitives/Button';
export type { ButtonProps } from './primitives/Button';

// Card - Complete card system with variants and composition
export { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  StatsCard
} from './primitives/Card';

// Input - Form inputs with variants, icons, and states
export { 
  Input, 
  Textarea, 
  InputGroup, 
  SearchInput
} from './primitives/Input';

// Table - Data tables with sorting, selection, and customization
export { 
  Table, 
  TableHeader, 
  TableBody, 
  TableFooter, 
  TableRow, 
  TableHead, 
  TableCell, 
  TableCaption,
  DataTable
} from './primitives/Table';

// Modal - Modal dialogs with specialized variants
export { 
  Modal, 
  ModalHeader, 
  ModalTitle, 
  ModalDescription, 
  ModalContent, 
  ModalFooter,
  ConfirmationModal,
  AlertModal
} from './primitives/Modal';

// =============================================================================
// PATTERNS - Componentes compostos (em desenvolvimento)
// =============================================================================
// export { FormField } from './patterns/FormField';
// export { NavigationMenu } from './patterns/NavigationMenu';
// export { Tabs } from './patterns/Tabs';

// =============================================================================
// LAYOUTS - Componentes de layout (em desenvolvimento)
// =============================================================================
// export { Container } from './layouts/Container';
// export { Grid } from './layouts/Grid';
// export { Stack } from './layouts/Stack';

// =============================================================================
// RE-EXPORTS from existing UI components (temporário - migrar gradualmente)
// =============================================================================

export { Badge } from '@/components/ui/badge';
export { Label } from '@/components/ui/label';
export { Select } from '@/components/ui/select';

export { 
  LoadingSpinner, 
  ButtonLoading, 
  DiscreteLoading 
} from '@/components/ui/loading';

// Dialog system (será substituído por Modal do DS)
export { Dialog } from '@/components/ui/dialog';

// User interface components
export { UserSwitcher } from '@/components/ui/user-switcher';
export { DemoCredentials } from '@/components/ui/demo-credentials';

// =============================================================================
// PROVIDERS
// =============================================================================
export { ThemeProvider } from '@/components/providers/theme-provider';
export { ToastProvider, useToast } from '@/components/providers/toast-provider';
