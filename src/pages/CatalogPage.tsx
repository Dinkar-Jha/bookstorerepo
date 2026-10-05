import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MOCK_BOOKS, GENRE_LIST } from '../data/mockBooks';
import { BookCard } from '../components/common/BookCard';
import { FilterSidebar } from '../components/catalog/FilterSidebar';
import { FilterState, BookGenre, BookCategory, BreadcrumbItem } from '../types/book';
import { SlidersHorizontal, ArrowUpDown, X, BookOpen } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Drawer } from '../components/common/Drawer';
import { EmptyState } from '../components/common/EmptyState';

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  genres: [],
  categories: [],
  authors: [],
  minPrice: 0,
  maxPrice: 60,
  minRating: 0,
  inStockOnly: false,
  sortBy: 'relevance'
};

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Sync URL search params into filter state on mount / change
  useEffect(() => {
    const genreParam = searchParams.get('genre');
    const catParam = searchParams.get('category');
    const sortParam = searchParams.get('sort');
    const queryParam = searchParams.get('q');

    setFilters((prev) => ({
      ...prev,
      searchQuery: queryParam || '',
      genres: genreParam ? [genreParam as BookGenre] : [],
      categories: catParam ? [catParam as BookCategory] : [],
      sortBy: (sortParam as FilterState['sortBy']) || 'relevance'
    }));
  }, [searchParams]);

  // Composable Filter Pipeline
  const filteredBooks = useMemo(() => {
    return MOCK_BOOKS.filter((book) => {
      // 1. Search Query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchesTitle = book.title.toLowerCase().includes(q);
        const matchesAuthor = book.author.toLowerCase().includes(q);
        const matchesGenre = book.genre.toLowerCase().includes(q);
        const matchesCategory = book.category.toLowerCase().includes(q);
        const matchesDesc = book.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesAuthor && !matchesGenre && !matchesCategory && !matchesDesc) {
          return false;
        }
      }

      // 2. Genres (OR within genres array)
      if (filters.genres.length > 0 && !filters.genres.includes(book.genre)) {
        return false;
      }

      // 3. Categories (OR within categories array)
      if (filters.categories.length > 0 && !filters.categories.includes(book.category)) {
        return false;
      }

      // 4. Authors
      if (filters.authors.length > 0 && !filters.authors.includes(book.author)) {
        return false;
      }

      // 5. Max Price
      if (book.price > filters.maxPrice) {
        return false;
      }

      // 6. Rating
      if (filters.minRating > 0 && book.rating < filters.minRating) {
        return false;
      }

      // 7. In-Stock
      if (filters.inStockOnly && book.stock <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime();
        case 'bestselling':
          return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0) || b.reviewCount - a.reviewCount;
        case 'relevance':
        default:
          return b.reviewCount - a.reviewCount;
      }
    });
  }, [filters]);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSearchParams({});
  };

  const removeGenre = (genre: BookGenre) => {
    setFilters((prev) => ({
      ...prev,
      genres: prev.genres.filter((g) => g !== genre)
    }));
  };

  const removeCategory = (cat: BookCategory) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== cat)
    }));
  };

  const removeAuthor = (author: string) => {
    setFilters((prev) => ({
      ...prev,
      authors: prev.authors.filter((a) => a !== author)
    }));
  };

  const hasActiveFilters =
    filters.genres.length > 0 ||
    filters.categories.length > 0 ||
    filters.authors.length > 0 ||
    filters.maxPrice < 60 ||
    filters.minRating > 0 ||
    filters.inStockOnly ||
    filters.searchQuery !== '';

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Catalog', path: '/books' },
    ...(filters.genres.length === 1 ? [{ label: filters.genres[0] }] : [])
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={breadcrumbs} />

      {/* Page Title & Sort Toolbar */}
      <div className="bg-book-card border border-book-border rounded-xl p-6 shadow-book-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-book-burgundy font-bold">
            Curated Library
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-book-charcoal mt-1">
            Book Catalog
          </h1>
          <p className="text-xs sm:text-sm text-book-stone-500 mt-1 max-w-xl">
            Explore our vast catalog of bestselling literature, modern fiction, historical deep-dives, and technical craftsmanship.
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setIsFilterDrawerOpen(true)}
            className="lg:hidden px-3.5 py-2.5 bg-book-muted border border-book-border text-book-charcoal text-xs font-semibold rounded-md flex items-center gap-2 focus-ring"
          >
            <SlidersHorizontal className="w-4 h-4 text-book-burgundy" />
            <span>Filters ({filters.genres.length + filters.categories.length + (filters.minRating > 0 ? 1 : 0) + (filters.inStockOnly ? 1 : 0)})</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-book-card border border-book-border rounded-md px-3 py-2 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-book-stone-500 pointer-events-none" />
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sortBy: e.target.value as FilterState['sortBy']
                }))
              }
              className="bg-transparent font-medium text-book-charcoal focus:outline-none cursor-pointer"
              aria-label="Sort books by"
            >
              <option value="relevance">Sort: Most Popular</option>
              <option value="bestselling">Sort: Best Sellers</option>
              <option value="rating">Sort: Highest Rated</option>
              <option value="price-asc">Sort: Price (Low to High)</option>
              <option value="price-desc">Sort: Price (High to Low)</option>
              <option value="newest">Sort: New Releases</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1" aria-label="Active filters">
          <span className="text-xs font-mono text-book-stone-500">Active Filters:</span>
          
          {filters.searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-book-muted border border-book-border text-xs rounded-full text-book-charcoal">
              Query: &ldquo;{filters.searchQuery}&rdquo;
              <button
                onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                aria-label="Remove search query filter"
                className="text-book-stone-500 hover:text-book-burgundy"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.genres.map((g) => (
            <span key={g} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 border border-rose-200 text-xs rounded-full text-book-burgundy font-medium">
              Genre: {g}
              <button
                onClick={() => removeGenre(g)}
                aria-label={`Remove ${g} genre filter`}
                className="text-book-burgundy hover:text-red-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {filters.categories.map((c) => (
            <span key={c} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-xs rounded-full text-book-amber font-medium">
              Category: {c}
              <button
                onClick={() => removeCategory(c)}
                aria-label={`Remove ${c} category filter`}
                className="text-book-amber hover:text-amber-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {filters.authors.map((a) => (
            <span key={a} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-300 text-xs rounded-full text-book-navy font-medium">
              Author: {a}
              <button
                onClick={() => removeAuthor(a)}
                aria-label={`Remove ${a} author filter`}
                className="text-book-navy hover:text-slate-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {filters.minRating > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-book-muted border border-book-border text-xs rounded-full text-book-charcoal">
              Rating: ★ {filters.minRating}+
              <button
                onClick={() => setFilters((prev) => ({ ...prev, minRating: 0 }))}
                aria-label="Remove rating filter"
                className="text-book-stone-500 hover:text-book-burgundy"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-xs rounded-full text-book-success font-medium">
              In-Stock Only
              <button
                onClick={() => setFilters((prev) => ({ ...prev, inStockOnly: false }))}
                aria-label="Remove in-stock filter"
                className="text-book-success hover:text-emerald-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs font-semibold text-book-burgundy hover:underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Grid: Sidebar (3 cols) & Product Grid (9 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Desktop Sidebar (3 cols) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-28">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
            totalResults={filteredBooks.length}
          />
        </aside>

        {/* Mobile Filter Drawer */}
        <Drawer
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          title="Refine Book Catalog"
          position="right"
        >
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
            totalResults={filteredBooks.length}
          />
          <div className="mt-6 pt-4 border-t border-book-border">
            <button
              onClick={() => setIsFilterDrawerOpen(false)}
              className="w-full py-3 bg-book-navy text-white text-xs font-semibold rounded-md"
            >
              Show {filteredBooks.length} Books
            </button>
          </div>
        </Drawer>

        {/* Product Results Grid (9 cols) */}
        <main className="lg:col-span-9">
          {filteredBooks.length === 0 ? (
            <EmptyState
              icon="search"
              title="No books found"
              description="We couldn't find any books matching your active filter criteria. Try adjusting your genre, author, or price filters."
              actionLabel="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
};
