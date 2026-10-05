import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';
  
  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded gap-1.5',
    md: 'text-sm px-4 py-2.5 rounded-md gap-2',
    lg: 'text-base px-6 py-3.5 rounded-lg gap-2.5 font-semibold'
  };

  const variantStyles = {
    primary: 'bg-book-navy text-white hover:bg-slate-800 shadow-sm hover:shadow',
    secondary: 'bg-book-muted text-book-charcoal hover:bg-book-border/70 border border-book-border',
    accent: 'bg-book-burgundy text-white hover:bg-book-burgundy-hover shadow-sm hover:shadow',
    outline: 'bg-transparent text-book-charcoal border border-book-border hover:bg-book-muted hover:border-book-stone-300',
    ghost: 'bg-transparent text-book-charcoal hover:bg-book-muted',
    danger: 'bg-book-error text-white hover:bg-red-800 shadow-sm'
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
