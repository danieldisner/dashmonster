import React from 'react';
import { cn } from '@/utils';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

interface ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface ModalTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

interface ModalDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface ModalContentProps {
  children: React.ReactNode;
  className?: string;
}

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

// Modal sizes
const modalSizes = {
  sm: 'max-w-md',
  default: 'max-w-lg',
  lg: 'max-w-xl',
  xl: 'max-w-3xl',
  full: 'max-w-[95vw] max-h-[95vh]'
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  size = 'default',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true
}) => {
  // Handle escape key
  React.useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Body scroll lock
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  // Focus management
  const modalRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      firstElement?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
        onClick={handleOverlayClick}
      />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className={cn(
          'relative bg-background border border-border rounded-lg shadow-lg',
          'animate-in zoom-in-95 fade-in-0 duration-300',
          'w-full mx-4',
          modalSizes[size],
          size === 'full' && 'h-full overflow-auto',
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none z-10"
            aria-label="Fechar modal"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {children}
      </div>
    </div>,
    document.body
  );
};

Modal.displayName = 'Modal';

export const ModalHeader: React.FC<ModalHeaderProps> = ({ children, className }) => (
  <div className={cn('flex flex-col space-y-1.5 p-6 pb-4', className)}>
    {children}
  </div>
);

ModalHeader.displayName = 'ModalHeader';

export const ModalTitle: React.FC<ModalTitleProps> = ({ 
  children, 
  className, 
  as: Component = 'h2' 
}) => (
  <Component className={cn('text-lg font-semibold leading-none tracking-tight', className)}>
    {children}
  </Component>
);

ModalTitle.displayName = 'ModalTitle';

export const ModalDescription: React.FC<ModalDescriptionProps> = ({ children, className }) => (
  <p className={cn('text-sm text-muted-foreground', className)}>
    {children}
  </p>
);

ModalDescription.displayName = 'ModalDescription';

export const ModalContent: React.FC<ModalContentProps> = ({ children, className }) => (
  <div className={cn('px-6 py-4', className)}>
    {children}
  </div>
);

ModalContent.displayName = 'ModalContent';

export const ModalFooter: React.FC<ModalFooterProps> = ({ children, className }) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-4', className)}>
    {children}
  </div>
);

ModalFooter.displayName = 'ModalFooter';

// Confirmation Modal - Specialized component
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
  isLoading = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalHeader>
        <ModalTitle>{title}</ModalTitle>
        {description && (
          <ModalDescription>{description}</ModalDescription>
        )}
      </ModalHeader>

      <ModalFooter>
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="mt-3 sm:mt-0 inline-flex w-full justify-center rounded-md bg-background px-3 py-2 text-sm font-semibold text-foreground shadow-sm ring-1 ring-inset ring-border hover:bg-muted sm:w-auto"
        >
          {cancelText}
        </button>
        
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className={cn(
            'inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto',
            variant === 'destructive' 
              ? 'bg-red-600 hover:bg-red-500 focus:ring-red-600' 
              : 'bg-primary hover:bg-primary/90 focus:ring-primary',
            'focus:outline-none focus:ring-2 focus:ring-offset-2'
          )}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Processando...
            </div>
          ) : (
            confirmText
          )}
        </button>
      </ModalFooter>
    </Modal>
  );
};

ConfirmationModal.displayName = 'ConfirmationModal';

// Alert Modal - For notifications
interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  actionText?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  variant = 'info',
  actionText = 'OK'
}) => {
  const variantStyles = {
    info: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  };

  const variantIcons = {
    info: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    success: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    error: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalContent>
        <div className="flex items-start gap-4">
          <div className={cn('flex-shrink-0', variantStyles[variant])}>
            {variantIcons[variant]}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold leading-6 text-foreground mb-2">
              {title}
            </h3>
            
            {description && (
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
      </ModalContent>

      <ModalFooter>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
        >
          {actionText}
        </button>
      </ModalFooter>
    </Modal>
  );
};

AlertModal.displayName = 'AlertModal';
