import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'burgundy' | 'amber' | 'navy' | 'success' | 'stone' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'stone',
  size = 'sm',
  className = ''
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1'
  };

  const variantStyles = {
    burgundy: 'bg-book-burgundy text-white font-medium',
    amber: 'bg-book-amber text-white font-medium',
    navy: 'bg-book-navy text-white font-medium',
    success: 'bg-book-success-light text-book-success font-medium border border-book-success/20',
    stone: 'bg-book-muted text-book-stone-700 font-medium border border-book-border',
    outline: 'bg-transparent text-book-stone-700 font-medium border border-book-border'
  };

  return (
    <span className={`inline-flex items-center rounded tracking-wide uppercase select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
