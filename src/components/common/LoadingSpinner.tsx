import React from 'react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label = 'Loading...',
  className = ''
}) => {
  const sizeStyles = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 p-4 ${className}`} role="status">
      <div
        className={`${sizeStyles[size]} border-book-border border-t-book-burgundy rounded-full animate-spin`}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
      {label && size !== 'sm' && (
        <span className="text-xs font-mono text-book-stone-500">{label}</span>
      )}
    </div>
  );
};
