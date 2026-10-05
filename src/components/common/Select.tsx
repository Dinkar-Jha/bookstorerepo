import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  options,
  error,
  helperText,
  id,
  className = '',
  disabled,
  ...props
}, ref) => {
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-xs font-semibold text-book-stone-700 tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          className={`w-full bg-book-card text-book-charcoal text-sm border rounded-md py-2.5 pl-3.5 pr-9 appearance-none transition-colors focus-ring disabled:bg-book-stone-100 disabled:cursor-not-allowed ${
            error ? 'border-book-error focus-visible:ring-book-error' : 'border-book-border hover:border-book-stone-300'
          } ${className}`}
          aria-invalid={!!error}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 text-book-stone-500 pointer-events-none flex items-center">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error && (
        <p className="text-xs text-book-error font-medium">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-book-stone-500">{helperText}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
