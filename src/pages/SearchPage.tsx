import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MOCK_BOOKS } from '../data/mockBooks';
import { BookCard } from '../components/common/BookCard';
import { Search, X, ArrowUpDown, Filter, Sparkles } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EmptyState } from '../components/common/EmptyState';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'rating'>('relevance');

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setSearchTerm(q);
    setActiveQuery(q);
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    setActiveQuery(trimmed);
    if (trimmed) {
      setSearchParams({ q: trimmed });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setActiveQuery('');
    setSearchParams({});
  };

  // Search matching across: title, author, genre, category, description, tags
  const searchResults = useMemo(() => {
    if (!activeQuery.trim()) return [];

    const q = activeQuery.toLowerCase().trim();

    return MOCK_BOOKS.filter((book) => {
      const matchesTitle = book.title.toLowerCase().includes(q);
      const matchesAuthor = book.author.toLowerCase().includes(q);
      const matchesGenre = book.genre.toLowerCase().includes(q);
      const matchesCategory = book.category.toLowerCase().includes(q);
      const matchesDesc = book.description.toLowerCase().includes(q);
      const matchesTags = book.tags ? book.tags.some((t) => t.toLowerCase().includes(q)) : false;

      return matchesTitle || matchesAuthor || matchesGenre || matchesCategory || matchesDesc || matchesTags;
    }).sort((a, b) => {
      // Prioritize title exact matches for relevance
      if (sortBy === 'relevance') {
        const aTitleMatch = a.title.toLowerCase().includes(q) ? 1 : 0;
        const bTitleMatch = b.title.toLowerCase().includes(q) ? 1 : 0;
        if (aTitleMatch !== bTitleMatch) return bTitleMatch - aTitleMatch;
        return b.reviewCount - a.reviewCount;
      }
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [activeQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumb */}
      <Breadcrumbs items={[{ label: 'Search', path: '/search' }]} />

      {/* Search Header Banner */}
      <div className="bg-book-card border border-book-border rounded-xl p-6 sm:p-8 shadow-book-card max-w-3xl mx-auto text-center space-y-4">
        <span className="text-xs font-mono uppercase tracking-wider text-book-burgundy font-bold">
          Search BookNest
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-book-charcoal">
          Find Your Next Book
        </h1>
        <p className="text-xs sm:text-sm text-book-stone-500 max-w-lg mx-auto">
          Search across 30+ titles by author name, book title, literary genre, or keywords (e.g. &ldquo;atomic&rdquo;, &ldquo;habits&rdquo;, &ldquo;space&rdquo;, &ldquo;clean code&rdquo;).
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-xl mx-auto pt-2">
          <div className="relative flex-1">
            <input
              type="search"
              placeholder="Type title, author, or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-book-bg text-sm px-4 py-3 pl-10 border border-book-border rounded-lg text-book-charcoal placeholder-book-stone-500 focus-ring"
              autoFocus
            />
            <Search className="w-4 h-4 text-book-stone-500 absolute left-3.5 top-3.5" />
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear input"
                className="absolute right-3 top-3 text-book-stone-500 hover:text-book-charcoal"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button type="submit" variant="accent" size="md">
            Search
          </Button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
          <span className="text-book-stone-500 font-mono">Popular searches:</span>
          {['atomic', 'clean code', 'psychology', 'scifi', 'dragons', 'churchill'].map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => {
                setSearchTerm(chip);
                setActiveQuery(chip);
                setSearchParams({ q: chip });
              }}
              className="px-2.5 py-1 bg-book-muted hover:bg-book-border/70 border border-book-border rounded text-book-stone-700 transition-colors focus-ring"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header / Controls */}
      {activeQuery.trim() && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-book-border gap-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-book-charcoal">
              Results for &ldquo;{activeQuery}&rdquo;
            </h2>
            <p className="text-xs font-mono text-book-stone-500 mt-0.5">
              Found {searchResults.length} {searchResults.length === 1 ? 'matching book' : 'matching books'}
            </p>
          </div>

          {searchResults.length > 0 && (
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-book-stone-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-book-card border border-book-border rounded-md px-3 py-1.5 text-xs text-book-charcoal focus-ring cursor-pointer"
                aria-label="Sort search results"
              >
                <option value="relevance">Sort: Most Relevant</option>
                <option value="rating">Sort: Highest Rated</option>
                <option value="price-asc">Sort: Price (Low to High)</option>
                <option value="price-desc">Sort: Price (High to Low)</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Results Grid or Empty State */}
      {!activeQuery.trim() ? (
        <div className="text-center py-12 text-book-stone-500">
          <p className="text-sm">Type a search query above to explore our books.</p>
        </div>
      ) : searchResults.length === 0 ? (
        <EmptyState
          icon="search"
          title={`No results for "${activeQuery}"`}
          description="We couldn't find any books matching your search query. Try checking for spelling errors, using simpler keywords, or browse our full catalog."
          actionLabel="Explore All Books"
          onAction={() => {}}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchResults.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

    </div>
  );
};
