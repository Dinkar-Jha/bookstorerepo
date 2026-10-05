import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbItem } from '../../types/book';

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-xs text-book-stone-500 overflow-x-auto whitespace-nowrap py-1 ${className}`}>
      <ol className="flex items-center gap-1.5 list-none p-0 m-0">
        <li className="flex items-center">
          <Link
            to="/"
            className="flex items-center gap-1 text-book-stone-500 hover:text-book-burgundy transition-colors focus-ring rounded"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-book-stone-300 flex-shrink-0" aria-hidden="true" />
              {item.path && !isLast ? (
                <Link
                  to={item.path}
                  className="text-book-stone-700 hover:text-book-burgundy transition-colors focus-ring rounded"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="text-book-charcoal font-semibold truncate max-w-[200px] sm:max-w-xs"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
