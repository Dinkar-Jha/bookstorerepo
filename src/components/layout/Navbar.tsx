import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  ShoppingCart, 
  Heart, 
  Sparkles, 
  Menu, 
  X,
  Compass
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface NavbarProps {
  onOpenAI: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAI }) => {
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-ibm-gray-100 text-white border-b border-ibm-gray-80 shadow-md">
      {/* Top micro announcement bar */}
      <div className="bg-ibm-blue-70 text-white text-[11px] font-mono py-1 px-4 text-center tracking-wide">
        ⚡ Applied AI Capstone: Powered by IBM Watsonx, Carbon Tokens & Red Hat Guidelines
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-9 h-9 bg-ibm-blue-60 flex items-center justify-center font-bold text-white group-hover:bg-ibm-blue-50 transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block leading-none">
                PageForge
              </span>
              <span className="text-[10px] font-mono text-ibm-gray-30 uppercase tracking-widest">
                IBM BookLab
              </span>
            </div>
          </Link>

          {/* Search bar (Desktop) */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden md:flex flex-1 max-w-md relative"
          >
            <input
              type="text"
              placeholder="Search books, authors, or AI topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-ibm-gray-90 text-white placeholder-ibm-gray-50 text-sm px-4 py-2 pl-10 border border-ibm-gray-70 focus:outline-none focus:border-ibm-blue-50 transition-colors"
            />
            <Search className="w-4 h-4 text-ibm-gray-50 absolute left-3 top-2.5" />
          </form>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <Link 
              to="/catalog" 
              className="text-ibm-gray-20 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Compass className="w-4 h-4" />
              Explore Catalog
            </Link>
            <Link 
              to="/catalog?bestseller=true" 
              className="text-ibm-gray-20 hover:text-white transition-colors"
            >
              Bestsellers
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Ask AI Librarian trigger */}
            <button
              onClick={onOpenAI}
              className="flex items-center gap-1.5 bg-gradient-to-r from-ibm-blue-60 to-ibm-purple-60 hover:from-ibm-blue-70 hover:to-ibm-purple-70 text-white text-xs font-semibold px-3 py-2 rounded-none transition-all shadow-sm"
              aria-label="Ask AI Librarian"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden sm:inline">Ask AI Librarian</span>
            </button>

            {/* Wishlist Link */}
            <Link
              to="/catalog?wishlist=true"
              className="relative p-2 text-ibm-gray-20 hover:text-white transition-colors"
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-ibm-magenta-60 text-white text-[10px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 bg-ibm-gray-90 hover:bg-ibm-gray-80 text-white border border-ibm-gray-70 transition-colors flex items-center gap-2"
              aria-label={`Cart (${totalItems} items)`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="text-xs font-mono font-semibold hidden md:inline">
                {totalItems}
              </span>
              {totalItems > 0 && (
                <span className="md:hidden absolute -top-1 -right-1 bg-ibm-blue-60 text-white text-[10px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-ibm-gray-20 hover:text-white"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile search bar dropdown */}
        <div className="md:hidden pb-3 pt-1">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search books, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-ibm-gray-90 text-white placeholder-ibm-gray-50 text-sm px-3 py-2 pl-9 border border-ibm-gray-70 focus:outline-none focus:border-ibm-blue-50"
            />
            <Search className="w-4 h-4 text-ibm-gray-50 absolute left-3 top-2.5" />
          </form>
        </div>

        {/* Mobile navigation collapse */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-ibm-gray-80 py-3 space-y-2">
            <Link
              to="/catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-ibm-gray-20 hover:bg-ibm-gray-90 hover:text-white"
            >
              Explore Full Catalog
            </Link>
            <Link
              to="/catalog?bestseller=true"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-ibm-gray-20 hover:bg-ibm-gray-90 hover:text-white"
            >
              Bestsellers & New Releases
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAI();
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-ibm-blue-50 hover:bg-ibm-gray-90 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Launch AI Assistant
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
