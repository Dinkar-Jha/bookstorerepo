import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration: number = 3500) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      setToasts((prev) => {
        // Enforce maximum of 4 active notifications at any time
        const trimmed = prev.length >= 4 ? prev.slice(prev.length - 3) : prev;
        return [...trimmed, { id, message, type, duration }];
      });

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (msg: string, duration?: number) => showToast(msg, 'success', duration),
    [showToast]
  );
  
  const error = useCallback(
    (msg: string, duration?: number) => showToast(msg, 'error', duration),
    [showToast]
  );
  
  const warning = useCallback(
    (msg: string, duration?: number) => showToast(msg, 'warning', duration),
    [showToast]
  );
  
  const info = useCallback(
    (msg: string, duration?: number) => showToast(msg, 'info', duration),
    [showToast]
  );

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" aria-hidden="true" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" aria-hidden="true" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" aria-hidden="true" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-sky-600 flex-shrink-0" aria-hidden="true" />;
    }
  };

  const getStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-sm';
      case 'error':
        return 'bg-rose-50 border-rose-200 text-rose-900 shadow-sm';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-900 shadow-sm';
      case 'info':
      default:
        return 'bg-sky-50 border-sky-200 text-sky-900 shadow-sm';
    }
  };

  return (
    <ToastContext.Provider
      value={{
        showToast,
        success,
        error,
        warning,
        info,
        removeToast,
        clearAllToasts,
      }}
    >
      {children}

      {/* WCAG 2.1 AA Compliant ARIA Live Region */}
      <div
        aria-live="polite"
        aria-atomic="true"
        aria-relevant="additions text"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 p-3.5 border rounded-lg shadow-book-lg transition-all transform duration-200 ease-out translate-y-0 opacity-100 ${getStyles(
              toast.type
            )}`}
          >
            <div className="mt-0.5">{getIcon(toast.type)}</div>
            <div className="flex-1 text-xs font-medium leading-relaxed">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              type="button"
              aria-label="Dismiss notification"
              className="p-1 -mr-1 -mt-1 text-book-stone-500 hover:text-book-charcoal rounded hover:bg-black/5 focus-ring"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
