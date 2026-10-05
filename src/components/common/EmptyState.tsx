import React from 'react';
import { Search, BookOpen, AlertCircle, ShoppingBag } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: 'search' | 'book' | 'alert' | 'cart';
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = 'search',
  actionLabel,
  onAction,
  className = ''
}) => {
  const icons = {
    search: <Search className="w-10 h-10 text-book-amber" />,
    book: <BookOpen className="w-10 h-10 text-book-burgundy" />,
    alert: <AlertCircle className="w-10 h-10 text-book-stone-500" />,
    cart: <ShoppingBag className="w-10 h-10 text-book-navy" />
  };

  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-book-card border border-book-border rounded-xl shadow-book-card ${className}`}>
      <div className="w-16 h-16 rounded-full bg-book-muted flex items-center justify-center mb-4">
        {icons[icon]}
      </div>
      <h3 className="font-serif text-xl font-bold text-book-charcoal mb-2">
        {title}
      </h3>
      <p className="text-sm text-book-stone-500 max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
