'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

function Toast({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  const getTextColor = () => {
    switch (toast.type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
    }
  };

  const handleClose = () => {
    onRemove(toast.id);
  };

  return (
    <div 
      className={`relative flex items-start gap-3 p-4 border rounded-lg shadow-md ${getBackgroundColor()} z-[10000]`}
      onClick={(e) => e.stopPropagation()}
    >
      {getIcon()}
      <div className="flex-1">
        <h4 className={`font-medium ${getTextColor()}`}>{toast.title}</h4>
        {toast.description && (
          <p className={`text-sm mt-1 ${getTextColor()} opacity-75`}>{toast.description}</p>
        )}
      </div>
      
      {/* Versão simples e robusta do botão de fechar */}
      <div
        onClick={handleClose}
        onMouseDown={handleClose}
        onTouchStart={handleClose}
        title="Fechar notificação"
        className={`
          relative z-[10001] flex-shrink-0 p-2 ml-2 rounded-full 
          hover:bg-black hover:bg-opacity-20 
          ${getTextColor()} 
          transition-all duration-200 
          cursor-pointer 
          active:scale-95
          min-w-[32px] min-h-[32px] 
          flex items-center justify-center
          select-none
          pointer-events-auto
        `}
      >
        <X className="h-5 w-5 pointer-events-none" />
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[10000] space-y-2 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (title: string, description?: string) => {
    addToast({ type: 'success', title, description });
  };

  const showError = (title: string, description?: string) => {
    addToast({ type: 'error', title, description });
  };

  const showWarning = (title: string, description?: string) => {
    addToast({ type: 'warning', title, description });
  };

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning
  };
}
