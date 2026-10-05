import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Home, Search } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-20 h-20 bg-book-muted rounded-full flex items-center justify-center mx-auto text-book-burgundy">
        <BookOpen className="w-10 h-10 stroke-1" />
      </div>

      <div className="space-y-2">
        <span className="font-mono text-sm text-book-burgundy font-bold">404 Error</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-book-charcoal">
          Page or Chapter Missing
        </h1>
        <p className="text-sm text-book-stone-500 max-w-md mx-auto leading-relaxed">
          The page you are searching for might have been moved, renamed, or is temporarily unavailable in the BookNest library.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Link to="/">
          <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
            Back to Homepage
          </Button>
        </Link>
        <Link to="/books">
          <Button variant="accent" size="md" leftIcon={<Search className="w-4 h-4" />}>
            Search Book Catalog
          </Button>
        </Link>
      </div>
    </div>
  );
};
