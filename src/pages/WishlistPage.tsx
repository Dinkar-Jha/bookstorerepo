import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { MOCK_BOOKS } from '../data/mockBooks';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { RatingStars } from '../components/common/RatingStars';

export const WishlistPage: React.FC = () => {
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const wishlistedBooks = MOCK_BOOKS.filter((book) => wishlistIds.includes(book.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Saved Wishlist' }]} />

      {/* Header */}
      <div className="bg-book-card border border-book-border rounded-xl p-6 sm:p-8 shadow-book-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-book-burgundy font-bold">
            Personal Collection
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-book-charcoal mt-1">
            My Saved Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-book-stone-500 mt-1">
            {wishlistedBooks.length} {wishlistedBooks.length === 1 ? 'saved book' : 'saved books'} ready for your next reading sprint.
          </p>
        </div>
        <Link to="/books">
          <Button variant="outline" size="sm">
            Continue Browsing
          </Button>
        </Link>
      </div>

      {/* Content */}
      {wishlistedBooks.length === 0 ? (
        <EmptyState
          icon="book"
          title="Your wishlist is empty"
          description="You haven't saved any books to your wishlist yet. Explore our curated collections and click the heart icon on titles you love."
          actionLabel="Explore Books"
          onAction={() => window.location.assign('/books')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistedBooks.map((book) => (
            <div
              key={book.id}
              className="bg-book-card border border-book-border rounded-xl p-4 shadow-book-card flex gap-4 hover:shadow-book transition-shadow"
            >
              <Link to={`/books/${book.id}`} className="w-24 aspect-[3/4] flex-shrink-0 bg-book-muted rounded-md overflow-hidden">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </Link>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-book-burgundy font-bold">
                    {book.genre}
                  </span>
                  <Link to={`/books/${book.id}`}>
                    <h3 className="font-serif font-bold text-sm text-book-charcoal hover:text-book-burgundy transition-colors line-clamp-2 mt-0.5">
                      {book.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-book-stone-500 mt-0.5">{book.author}</p>
                  <div className="mt-1.5">
                    <RatingStars rating={book.rating} size="sm" />
                  </div>
                </div>

                <div className="pt-3 border-t border-book-border flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-book-charcoal">
                    ${book.price.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleWishlist(book.id)}
                      aria-label="Remove from wishlist"
                      className="p-1.5 text-book-stone-500 hover:text-book-error rounded hover:bg-red-50 focus-ring"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => addToCart(book, 'Paperback', 1)}
                      leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
                    >
                      Move to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
