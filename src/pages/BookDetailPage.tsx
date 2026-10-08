import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_BOOKS } from '../data/mockBooks';
import { RatingStars } from '../components/common/RatingStars';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { BookCard } from '../components/common/BookCard';
import { EmptyState } from '../components/common/EmptyState';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { BookFormat, BreadcrumbItem } from '../types/book';
import { 
  Heart, 
  ShoppingBag, 
  Check, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  BookOpen, 
  Share2, 
  Sparkles,
  Info
} from 'lucide-react';

export const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const book = MOCK_BOOKS.find((b) => b.id === id);

  const [selectedFormat, setSelectedFormat] = useState<BookFormat>('Paperback');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'synopsis' | 'highlights' | 'specifications'>('highlights');
  const [isAdded, setIsAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!book) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          icon="book"
          title="Book Not Found"
          description="We couldn't locate the requested book title in our catalog. It may have been relocated or updated."
          actionLabel="Return to Catalog"
          onAction={() => navigate('/books')}
        />
      </div>
    );
  }

  const isWishlisted = isInWishlist(book.id);
  const relatedBooks = MOCK_BOOKS.filter(
    (b) => (b.genre === book.genre || b.category === book.category) && b.id !== book.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(book, selectedFormat, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Books', path: '/books' },
    { label: book.genre, path: `/books?genre=${encodeURIComponent(book.genre)}` },
    { label: book.title }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb Trail */}
      <Breadcrumbs items={breadcrumbs} />

      {/* Main Book Detail Container */}
      <div className="bg-book-card border border-book-border rounded-2xl p-6 sm:p-10 shadow-book-card grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Book Cover & Badges (5 cols) */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-sm aspect-[3/4] bg-book-muted rounded-xl border border-book-border shadow-book-lg overflow-hidden">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
              {book.bestSeller && <Badge variant="amber">Best Seller</Badge>}
              {book.newArrival && <Badge variant="burgundy">New Arrival</Badge>}
              {book.discount && book.discount > 0 && (
                <Badge variant="success">{book.discount}% Savings</Badge>
              )}
            </div>
          </div>

          {/* Quick Action Share & Wishlist Row */}
          <div className="mt-4 flex items-center justify-between gap-3 w-full max-w-sm">
            <button
              type="button"
              onClick={() => toggleWishlist(book.id)}
              className={`flex-1 py-2.5 px-4 text-xs font-semibold rounded-md border flex items-center justify-center gap-2 transition-colors focus-ring ${
                isWishlisted
                  ? 'bg-rose-50 border-rose-200 text-book-burgundy'
                  : 'bg-book-card border-book-border text-book-stone-700 hover:bg-book-muted'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-book-burgundy text-book-burgundy' : ''}`} />
              <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="p-2.5 bg-book-card border border-book-border hover:bg-book-muted rounded-md text-book-stone-700 transition-colors focus-ring"
              aria-label="Share book link"
              title="Copy link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-book-success" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Right Column: Book Metadata, Format & Add-to-Cart (7 cols) */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-book-burgundy font-bold">
                {book.genre}
              </span>
              <span className="text-book-stone-300">•</span>
              <span className="text-xs font-mono text-book-stone-500">
                {book.category}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-book-charcoal mt-2 leading-tight">
              {book.title}
            </h1>

            <p className="text-sm text-book-stone-700 mt-2">
              Written by <span className="font-bold text-book-charcoal">{book.author}</span>
            </p>

            {/* Rating Stars & Review Summary */}
            <div className="flex items-center gap-3 mt-3">
              <RatingStars rating={book.rating} showNumber size="md" />
              <span className="text-xs font-mono text-book-stone-500">
                ({book.reviewCount.toLocaleString()} verified reader ratings)
              </span>
            </div>

            {/* Pricing Box */}
            <div className="mt-6 p-4 sm:p-5 bg-book-muted/60 border border-book-border rounded-xl flex items-baseline gap-3">
              <span className="font-serif text-3xl font-bold text-book-charcoal">
                ${book.price.toFixed(2)}
              </span>
              {book.originalPrice && book.originalPrice > book.price && (
                <span className="text-sm font-mono text-book-stone-500 line-through">
                  ${book.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-xs font-mono font-bold text-book-success ml-auto flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                {book.stock > 0 ? `In Stock (${book.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Format Switcher */}
            <div className="mt-6 space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider font-bold text-book-stone-700 block">
                Choose Format:
              </label>
              <div className="flex flex-wrap gap-2.5">
                {(book.formats || ['Hardcover', 'Paperback', 'eBook']).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setSelectedFormat(fmt)}
                    className={`px-4 py-2.5 text-xs font-medium rounded-md border transition-all focus-ring ${
                      selectedFormat === fmt
                        ? 'bg-book-navy text-white border-book-navy shadow-xs'
                        : 'bg-book-card text-book-stone-700 border-book-border hover:border-book-stone-300'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center border border-book-border rounded-md bg-book-card">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="px-3.5 py-2.5 text-book-stone-700 hover:bg-book-muted rounded-l-md focus-ring disabled:opacity-40"
                >
                  -
                </button>
                <span className="px-4 text-xs font-mono font-bold select-none">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}
                  disabled={quantity >= book.stock}
                  aria-label="Increase quantity"
                  className="px-3.5 py-2.5 text-book-stone-700 hover:bg-book-muted rounded-r-md focus-ring disabled:opacity-40"
                >
                  +
                </button>
              </div>

              <div className="flex-1 min-w-[200px]">
                <Button
                  variant="accent"
                  size="md"
                  className="w-full py-3"
                  onClick={handleAddToCart}
                  disabled={book.stock <= 0}
                  leftIcon={isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                >
                  {isAdded ? 'Added to Cart' : `Add to Cart • $${(book.price * quantity).toFixed(2)}`}
                </Button>
              </div>
            </div>
          </div>

          {/* Value Props Strip */}
          <div className="pt-6 border-t border-book-border grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-book-stone-700">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-book-burgundy flex-shrink-0" />
              <span>Complimentary shipping on orders $40+</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-book-navy flex-shrink-0" />
              <span>30-Day Hassle-Free Returns</span>
            </div>
          </div>
        </div>

      </div>

      {/* Tabbed Info Section: Highlights / Synopsis / Specifications */}
      <div className="bg-book-card border border-book-border rounded-2xl shadow-book-card overflow-hidden">
        <div className="flex border-b border-book-border bg-book-muted">
          <button
            type="button"
            onClick={() => setActiveTab('highlights')}
            className={`px-6 py-4 text-xs font-mono font-bold tracking-wider transition-colors border-b-2 flex items-center gap-2 focus-ring ${
              activeTab === 'highlights'
                ? 'border-book-burgundy text-book-burgundy bg-book-card'
                : 'border-transparent text-book-stone-700 hover:text-book-charcoal'
            }`}
          >
            <Sparkles className="w-4 h-4 text-book-amber" />
            Key Highlights
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('synopsis')}
            className={`px-6 py-4 text-xs font-mono font-bold tracking-wider transition-colors border-b-2 focus-ring ${
              activeTab === 'synopsis'
                ? 'border-book-burgundy text-book-burgundy bg-book-card'
                : 'border-transparent text-book-stone-700 hover:text-book-charcoal'
            }`}
          >
            Editorial Synopsis
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('specifications')}
            className={`px-6 py-4 text-xs font-mono font-bold tracking-wider transition-colors border-b-2 focus-ring ${
              activeTab === 'specifications'
                ? 'border-book-burgundy text-book-burgundy bg-book-card'
                : 'border-transparent text-book-stone-700 hover:text-book-charcoal'
            }`}
          >
            Specifications
          </button>
        </div>

        <div className="p-6 sm:p-10">
          {activeTab === 'highlights' && (
            <div className="max-w-3xl space-y-4">
              <h3 className="font-serif text-lg font-bold text-book-charcoal">
                Curator Highlights & Takeaways
              </h3>
              <ul className="space-y-3">
                {(book.keyHighlights || [
                  'Critically acclaimed bestselling edition with comprehensive editorial review.',
                  'Features authoritative historical context and compelling narrative pacing.',
                  'Recommended by independent bookstore curators worldwide.'
                ]).map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3 p-3.5 bg-book-muted rounded-lg border-l-3 border-book-burgundy text-xs sm:text-sm text-book-stone-700 leading-relaxed">
                    <span className="font-mono font-bold text-book-burgundy">0{index + 1}.</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'synopsis' && (
            <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-book-stone-700 leading-relaxed font-normal">
              <h3 className="font-serif text-lg font-bold text-book-charcoal">
                About the Book
              </h3>
              <p className="leading-relaxed whitespace-pre-line">{book.description}</p>
              {book.tags && (
                <div className="pt-4 flex flex-wrap gap-2">
                  {book.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 bg-book-muted text-book-stone-700 text-xs font-mono rounded border border-book-border">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="max-w-2xl grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-book-muted rounded-lg border border-book-border">
                <span className="text-book-stone-500 font-mono block">ISBN-13</span>
                <span className="font-bold font-mono text-book-charcoal mt-1 block">{book.isbn}</span>
              </div>
              <div className="p-4 bg-book-muted rounded-lg border border-book-border">
                <span className="text-book-stone-500 font-mono block">Page Count</span>
                <span className="font-bold font-mono text-book-charcoal mt-1 block">{book.pages} pages</span>
              </div>
              <div className="p-4 bg-book-muted rounded-lg border border-book-border">
                <span className="text-book-stone-500 font-mono block">Publisher</span>
                <span className="font-bold text-book-charcoal mt-1 block">{book.publisher}</span>
              </div>
              <div className="p-4 bg-book-muted rounded-lg border border-book-border">
                <span className="text-book-stone-500 font-mono block">Publication Date</span>
                <span className="font-bold font-mono text-book-charcoal mt-1 block">{book.publicationDate}</span>
              </div>
              <div className="p-4 bg-book-muted rounded-lg border border-book-border">
                <span className="text-book-stone-500 font-mono block">Language</span>
                <span className="font-bold text-book-charcoal mt-1 block">{book.language}</span>
              </div>
              <div className="p-4 bg-book-muted rounded-lg border border-book-border">
                <span className="text-book-stone-500 font-mono block">Currency</span>
                <span className="font-bold font-mono text-book-charcoal mt-1 block">{book.currency}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Books Section */}
      {relatedBooks.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-book-border">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-book-burgundy font-bold">
                More in {book.genre}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-book-charcoal mt-0.5">
                Readers Also Explored
              </h3>
            </div>
            <Link
              to={`/books?genre=${encodeURIComponent(book.genre)}`}
              className="text-xs font-semibold text-book-burgundy hover:underline"
            >
              View More in {book.genre} →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedBooks.map((relBook) => (
              <BookCard key={relBook.id} book={relBook} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
