import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Check, BookOpen } from 'lucide-react';
import { Book } from '../../types/book';
import { RatingStars } from './RatingStars';
import { Badge } from './Badge';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export interface BookCardProps {
  book: Book;
  showAddToCart?: boolean;
  className?: string;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  showAddToCart = true,
  className = ''
}) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isWishlisted = isInWishlist(book.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(book, 'Paperback', 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(book.id);
  };

  return (
    <article
      className={`group relative flex flex-col bg-book-card border border-book-border rounded-lg overflow-hidden shadow-book-card hover:shadow-book hover:border-book-stone-300 transition-all duration-300 ${className}`}
      aria-label={`Book: ${book.title} by ${book.author}`}
    >
      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 pointer-events-none">
        {book.bestSeller && (
          <Badge variant="amber" size="sm">
            Best Seller
          </Badge>
        )}
        {book.newArrival && (
          <Badge variant="burgundy" size="sm">
            New
          </Badge>
        )}
        {book.discount && book.discount > 0 && !book.bestSeller && (
          <Badge variant="success" size="sm">
            {book.discount}% OFF
          </Badge>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        type="button"
        onClick={handleWishlistToggle}
        aria-label={isWishlisted ? `Remove ${book.title} from wishlist` : `Add ${book.title} to wishlist`}
        className="absolute top-2.5 right-2.5 z-10 p-2 bg-book-card/90 backdrop-blur-xs hover:bg-book-card text-book-stone-500 hover:text-book-burgundy rounded-full shadow-xs transition-colors focus-ring"
      >
        <Heart
          className={`w-4 h-4 transition-transform active:scale-125 ${
            isWishlisted ? 'fill-book-burgundy text-book-burgundy' : ''
          }`}
        />
      </button>

      {/* Book Cover Image Container */}
      <Link
        to={`/books/${book.id}`}
        className="block relative aspect-[3/4] bg-book-muted overflow-hidden focus-ring"
        tabIndex={0}
        aria-label={`View details for ${book.title}`}
      >
        {!imageError ? (
          <img
            src={book.coverImage}
            alt={`Cover of ${book.title}`}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-book-muted text-book-stone-500">
            <BookOpen className="w-10 h-10 mb-2 stroke-1" />
            <span className="font-serif text-xs font-bold line-clamp-2">{book.title}</span>
            <span className="text-[10px] mt-1">{book.author}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
      </Link>

      {/* Book Metadata & Pricing */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Genre / Category Tag */}
          <span className="text-[11px] font-mono font-semibold text-book-burgundy uppercase tracking-wider block mb-1">
            {book.genre}
          </span>

          {/* Title */}
          <Link to={`/books/${book.id}`} className="focus-ring rounded">
            <h3 className="font-serif font-bold text-book-charcoal text-base leading-snug line-clamp-2 group-hover:text-book-burgundy transition-colors">
              {book.title}
            </h3>
          </Link>

          {/* Author */}
          <p className="text-xs text-book-stone-500 mt-1 line-clamp-1">
            by <span className="text-book-stone-700 font-medium">{book.author}</span>
          </p>

          {/* Ratings */}
          <div className="mt-2.5 flex items-center justify-between">
            <RatingStars rating={book.rating} showNumber size="sm" />
            <span className="text-[11px] text-book-stone-500 font-mono">
              ({book.reviewCount.toLocaleString()})
            </span>
          </div>
        </div>

        {/* Price & Action Section */}
        <div className="pt-3 border-t border-book-border flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold font-mono text-book-charcoal">
              ${book.price.toFixed(2)}
            </span>
            {book.originalPrice && book.originalPrice > book.price && (
              <span className="text-xs text-book-stone-500 line-through font-mono">
                ${book.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {showAddToCart && (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={book.stock <= 0}
              aria-label={
                isAdded 
                  ? `Added ${book.title} to cart` 
                  : book.stock > 0 
                  ? `Add ${book.title} to cart` 
                  : `${book.title} is out of stock`
              }
              className={`p-2 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all focus-ring ${
                isAdded
                  ? 'bg-book-success text-white'
                  : book.stock > 0
                  ? 'bg-book-navy text-white hover:bg-slate-800'
                  : 'bg-book-stone-200 text-book-stone-500 cursor-not-allowed'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">Add</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
