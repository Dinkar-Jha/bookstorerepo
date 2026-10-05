import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  id,
  className = '',
  disabled,
  ...props
}, ref) => {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-book-stone-700 tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-book-stone-500 pointer-events-none flex items-center">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`w-full bg-book-card text-book-charcoal placeholder-book-stone-500 text-sm border rounded-md transition-colors focus-ring disabled:bg-book-stone-100 disabled:cursor-not-allowed ${
            leftIcon ? 'pl-9' : 'pl-3.5'
          } ${rightIcon ? 'pr-9' : 'pr-3.5'} py-2.5 ${
            error ? 'border-book-error focus-visible:ring-book-error' : 'border-book-border hover:border-book-stone-300'
          } ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 text-book-stone-500 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-book-error font-medium">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="text-xs text-book-stone-500">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
