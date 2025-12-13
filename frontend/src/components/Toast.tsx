'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  variant: ToastVariant;
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const toastVariants = {
  success: {
    container: 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
    icon: CheckCircle,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  error: {
    container: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    icon: XCircle,
    iconColor: 'text-red-600 dark:text-red-400',
  },
  warning: {
    container: 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
    icon: AlertTriangle,
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  info: {
    container: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
    icon: Info,
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const config = toastVariants[toast.variant];
  const IconComponent = config.icon;

  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.duration, toast.id, onRemove]);

  return (
    <div className={cn(
      'max-w-sm w-full rounded-lg border p-4 shadow-lg transition-all duration-300 ease-in-out',
      'transform translate-x-0 opacity-100',
      'animate-in slide-in-from-right-full',
      config.container
    )}>
      <div className="flex items-start space-x-3">
        <IconComponent className={cn('h-5 w-5 mt-0.5 flex-shrink-0', config.iconColor)} />

        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className="text-sm font-semibold mb-1">
              {toast.title}
            </p>
          )}
          <p className="text-sm">
            {toast.message}
          </p>

          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="mt-2 text-sm font-medium underline hover:no-underline"
            >
              {toast.action.label}
            </button>
          )}
        </div>

        <button
          onClick={() => onRemove(toast.id)}
          className={cn(
            'p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex-shrink-0',
            config.iconColor
          )}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000, // Default 5 seconds
    };

    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-0 right-0 z-50 p-4 space-y-3 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Helper functions for easy usage
export const toast = {
  success: (message: string, options?: { title?: string; duration?: number; action?: Toast['action'] }) => {
    // This would need to be called within a component that has access to useToast
    console.warn('toast.success called outside of component. Use useToast() hook instead.');
  },
  error: (message: string, options?: { title?: string; duration?: number; action?: Toast['action'] }) => {
    console.warn('toast.error called outside of component. Use useToast() hook instead.');
  },
  warning: (message: string, options?: { title?: string; duration?: number; action?: Toast['action'] }) => {
    console.warn('toast.warning called outside of component. Use useToast() hook instead.');
  },
  info: (message: string, options?: { title?: string; duration?: number; action?: Toast['action'] }) => {
    console.warn('toast.info called outside of component. Use useToast() hook instead.');
  },
};