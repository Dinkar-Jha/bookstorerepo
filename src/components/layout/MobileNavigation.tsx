import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Home, BookOpen, Layers, Award, Info, Heart, ShoppingBag, Search } from 'lucide-react';
import { GENRE_LIST } from '../../data/mockBooks';

export interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistCount: number;
  cartCount: number;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOpen,
  onClose,
  wishlistCount,
  cartCount
}) => {
  const navRef = useRef<HTMLDivElement>(null);
  const [searchVal, setSearchVal] = React.useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      navRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={navRef}
        tabIndex={-1}
        className="relative z-10 w-full max-w-xs bg-book-card h-full shadow-book-lg flex flex-col border-l border-book-border animate-in slide-in-from-right duration-200 focus:outline-none"
      >
        {/* Header */}
        <div className="p-4 bg-book-muted border-b border-book-border flex items-center justify-between">
          <Link to="/" onClick={onClose} className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold tracking-tight text-book-navy">
              Book<span className="text-book-burgundy">Nest</span>
            </span>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-1.5 text-book-stone-500 hover:text-book-charcoal rounded-md hover:bg-book-border/50 focus-ring"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-book-border">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="search"
              placeholder="Search books, authors..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-book-bg text-sm px-3.5 py-2 pl-9 border border-book-border rounded-md placeholder-book-stone-500 focus-ring"
            />
            <Search className="w-4 h-4 text-book-stone-500 absolute left-3 top-2.5" />
          </form>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-book-stone-500 font-bold block mb-2">
              Main Menu
            </span>
            <nav className="space-y-1">
              <Link
                to="/"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-book-charcoal hover:bg-book-muted rounded-md transition-colors"
              >
                <Home className="w-4 h-4 text-book-stone-500" />
                <span>Home</span>
              </Link>
              <Link
                to="/books"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-book-charcoal hover:bg-book-muted rounded-md transition-colors"
              >
                <BookOpen className="w-4 h-4 text-book-burgundy" />
                <span>Books Catalog</span>
              </Link>
              <Link
                to="/books?sort=bestselling"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-book-charcoal hover:bg-book-muted rounded-md transition-colors"
              >
                <Award className="w-4 h-4 text-book-amber" />
                <span>Best Sellers</span>
              </Link>
              <Link
                to="/about"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-book-charcoal hover:bg-book-muted rounded-md transition-colors"
              >
                <Info className="w-4 h-4 text-book-stone-500" />
                <span>About BookNest</span>
              </Link>
            </nav>
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-book-stone-500 font-bold block mb-2">
              Popular Genres
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {GENRE_LIST.slice(0, 8).map((genre) => (
                <Link
                  key={genre}
                  to={`/books?genre=${encodeURIComponent(genre)}`}
                  onClick={onClose}
                  className="px-2.5 py-1.5 text-xs text-book-stone-700 hover:text-book-burgundy hover:bg-book-muted rounded transition-colors truncate"
                >
                  {genre}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-book-border space-y-2">
            <Link
              to="/wishlist"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2 text-sm font-medium text-book-charcoal hover:bg-book-muted rounded-md"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-book-burgundy" />
                <span>Saved Wishlist</span>
              </div>
              {wishlistCount > 0 && (
                <span className="bg-book-burgundy text-white text-xs font-mono font-bold px-2 py-0.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2 text-sm font-medium text-book-charcoal hover:bg-book-muted rounded-md"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 text-book-navy" />
                <span>Shopping Cart</span>
              </div>
              {cartCount > 0 && (
                <span className="bg-book-navy text-white text-xs font-mono font-bold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-book-muted border-t border-book-border text-center text-[11px] text-book-stone-500 font-mono">
          BookNest • Phase 1
        </div>
      </div>
    </div>
  );
};
