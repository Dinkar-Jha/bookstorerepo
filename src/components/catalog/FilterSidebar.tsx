import React from 'react';
import { FilterState, BookGenre, BookCategory } from '../../types/book';
import { GENRE_LIST, CATEGORY_LIST, MOCK_BOOKS } from '../../data/mockBooks';
import { RotateCcw, Check } from 'lucide-react';
import { Button } from '../common/Button';

export interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onReset: () => void;
  totalResults: number;
}

// Extract distinct authors for author filter
const DISTINCT_AUTHORS = Array.from(new Set(MOCK_BOOKS.map((b) => b.author))).sort();

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  setFilters,
  onReset,
  totalResults
}) => {
  const handleGenreToggle = (genre: BookGenre) => {
    setFilters((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleCategoryToggle = (cat: BookCategory) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat]
    }));
  };

  const handleAuthorToggle = (author: string) => {
    setFilters((prev) => ({
      ...prev,
      authors: prev.authors.includes(author)
        ? prev.authors.filter((a) => a !== author)
        : [...prev.authors, author]
    }));
  };

  return (
    <div className="bg-book-card border border-book-border rounded-xl p-5 shadow-book-card space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-book-border">
        <div>
          <h2 className="font-serif text-lg font-bold text-book-charcoal">
            Refine Catalog
          </h2>
          <span className="text-xs font-mono text-book-stone-500">
            {totalResults} {totalResults === 1 ? 'title' : 'titles'} matching
          </span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-book-burgundy hover:text-book-burgundy-hover flex items-center gap-1 hover:underline focus-ring rounded"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Genres */}
      <div>
        <h3 className="text-xs font-mono uppercase tracking-wider text-book-charcoal font-bold mb-3">
          Genres ({GENRE_LIST.length})
        </h3>
        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
          {GENRE_LIST.map((genre) => {
            const checked = filters.genres.includes(genre);
            return (
              <label
                key={genre}
                className="flex items-center gap-2.5 text-xs text-book-stone-700 hover:text-book-burgundy cursor-pointer select-none py-0.5"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleGenreToggle(genre)}
                  className="w-4 h-4 rounded text-book-burgundy border-book-border focus:ring-book-burgundy"
                />
                <span className={checked ? 'font-semibold text-book-burgundy' : ''}>{genre}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Categories */}
      <div className="pt-4 border-t border-book-border">
        <h3 className="text-xs font-mono uppercase tracking-wider text-book-charcoal font-bold mb-3">
          Broad Categories
        </h3>
        <div className="space-y-1.5">
          {CATEGORY_LIST.map((cat) => {
            const checked = filters.categories.includes(cat);
            return (
              <label
                key={cat}
                className="flex items-center gap-2.5 text-xs text-book-stone-700 hover:text-book-burgundy cursor-pointer select-none py-0.5"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleCategoryToggle(cat)}
                  className="w-4 h-4 rounded text-book-burgundy border-book-border focus:ring-book-burgundy"
                />
                <span className={checked ? 'font-semibold text-book-burgundy' : ''}>{cat}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="pt-4 border-t border-book-border">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xs font-mono uppercase tracking-wider text-book-charcoal font-bold">
            Maximum Price
          </h3>
          <span className="text-xs font-mono font-bold text-book-burgundy">
            ${filters.maxPrice}
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="60"
          step="2"
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
          }
          className="w-full h-1.5 bg-book-muted rounded-lg appearance-none cursor-pointer accent-book-burgundy"
          aria-label="Filter maximum book price"
        />
        <div className="flex justify-between text-[11px] font-mono text-book-stone-500 mt-1">
          <span>$10</span>
          <span>$60</span>
        </div>
      </div>

      {/* Customer Rating Filter */}
      <div className="pt-4 border-t border-book-border">
        <h3 className="text-xs font-mono uppercase tracking-wider text-book-charcoal font-bold mb-3">
          Minimum Rating
        </h3>
        <div className="space-y-1.5">
          {[4.8, 4.5, 4.0].map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-2 text-xs text-book-stone-700 hover:text-book-burgundy cursor-pointer"
            >
              <input
                type="radio"
                name="rating-filter"
                checked={filters.minRating === rating}
                onChange={() => setFilters((prev) => ({ ...prev, minRating: rating }))}
                className="w-3.5 h-3.5 text-book-burgundy border-book-border focus:ring-book-burgundy"
              />
              <span>★ {rating.toFixed(1)} & above</span>
            </label>
          ))}
          <label className="flex items-center gap-2 text-xs text-book-stone-700 hover:text-book-burgundy cursor-pointer">
            <input
              type="radio"
              name="rating-filter"
              checked={filters.minRating === 0}
              onChange={() => setFilters((prev) => ({ ...prev, minRating: 0 }))}
              className="w-3.5 h-3.5 text-book-burgundy border-book-border focus:ring-book-burgundy"
            />
            <span>All ratings</span>
          </label>
        </div>
      </div>

      {/* In-Stock Filter */}
      <div className="pt-4 border-t border-book-border">
        <label className="flex items-center gap-2.5 text-xs font-semibold text-book-charcoal cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))
            }
            className="w-4 h-4 rounded text-book-burgundy border-book-border focus:ring-book-burgundy"
          />
          <span>In-Stock Only</span>
        </label>
      </div>

      {/* Author Filter (Top Authors) */}
      <div className="pt-4 border-t border-book-border">
        <h3 className="text-xs font-mono uppercase tracking-wider text-book-charcoal font-bold mb-2">
          Featured Authors
        </h3>
        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
          {DISTINCT_AUTHORS.slice(0, 10).map((author) => {
            const checked = filters.authors.includes(author);
            return (
              <label
                key={author}
                className="flex items-center gap-2 text-xs text-book-stone-700 hover:text-book-burgundy cursor-pointer truncate"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleAuthorToggle(author)}
                  className="w-3.5 h-3.5 rounded text-book-burgundy border-book-border focus:ring-book-burgundy"
                />
                <span className={`truncate ${checked ? 'font-semibold text-book-burgundy' : ''}`}>{author}</span>
              </label>
            );
          })}
        </div>
      </div>

    </div>
  );
};
