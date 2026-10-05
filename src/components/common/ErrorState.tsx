import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an unexpected error while loading this content. Please try again.',
  onRetry,
  className = ''
}) => {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-red-50/50 border border-red-200 rounded-xl ${className}`}
    >
      <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4 text-book-error">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h3 className="font-serif text-xl font-bold text-book-charcoal mb-2">
        {title}
      </h3>
      <p className="text-sm text-book-stone-700 max-w-md mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};
