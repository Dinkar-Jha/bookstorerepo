import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id?: string;
  message: string;
  type?: ToastType;
  onClose?: () => void;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  onClose,
  className = ''
}) => {
  const typeIcons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" aria-hidden="true" />,
    error: <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" aria-hidden="true" />,
    warning: <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" aria-hidden="true" />,
    info: <Info className="w-4 h-4 text-sky-600 flex-shrink-0" aria-hidden="true" />
  };

  const bgStyles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    error: 'bg-rose-50 border-rose-200 text-rose-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    info: 'bg-sky-50 border-sky-200 text-sky-900'
  };

  return (
    <div
      role="status"
      className={`flex items-start gap-3 p-3.5 border rounded-lg shadow-book-lg max-w-sm transition-all duration-200 ${bgStyles[type]} ${className}`}
    >
      <div className="mt-0.5">{typeIcons[type]}</div>
      <p className="text-xs font-medium flex-1 leading-relaxed">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          aria-label="Dismiss notification"
          className="p-1 -mr-1 -mt-1 text-book-stone-500 hover:text-book-charcoal rounded hover:bg-black/5 focus-ring"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};
