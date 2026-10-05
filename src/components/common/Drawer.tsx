import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'right' | 'left' | 'bottom';
  maxWidth?: 'sm' | 'md' | 'lg';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  maxWidth = 'md'
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      // Focus drawer when opened
      drawerRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
  };

  const positionStyles = {
    right: 'inset-y-0 right-0 justify-end',
    left: 'inset-y-0 left-0 justify-start',
    bottom: 'inset-x-0 bottom-0 justify-end'
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'drawer-title' : undefined}
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={drawerRef}
        tabIndex={-1}
        className={`relative z-10 w-full ${widthStyles[maxWidth]} bg-book-card h-full shadow-book-lg flex flex-col border-l border-book-border animate-in slide-in-from-${position} duration-200 focus:outline-none`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-book-muted border-b border-book-border flex items-center justify-between flex-shrink-0">
          {title && (
            <h3 id="drawer-title" className="font-serif text-lg font-bold text-book-charcoal">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="p-1.5 text-book-stone-500 hover:text-book-charcoal rounded-md hover:bg-book-border/50 transition-colors focus-ring"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
