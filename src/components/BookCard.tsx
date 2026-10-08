import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, BookOpen, Check } from 'lucide-react'
import { StarRating } from './ui/StarRating'
import { Badge } from './ui/Badge'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import type { Book } from '../types'

interface BookCardProps {
  book: Book
  view?: 'grid' | 'list'
}

function BookCover({ book, className = '' }: { book: Book; className?: string }) {
  const [imgError, setImgError] = useState(false)

  if (imgError) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-primary/10 to-primary/5 ${className}`}
        aria-label={`Cover for ${book.title}`}
      >
        <BookOpen className="h-12 w-12 text-primary/30" aria-hidden="true" />
        <span className="px-2 text-center text-xs font-medium text-primary/50 line-clamp-2">
          {book.title}
        </span>
      </div>
    )
  }

  return (
    <img
      src={book.coverImage}
      alt={`Cover of ${book.title} by ${book.author}`}
      className={className}
      onError={() => setImgError(true)}
      loading="lazy"
    />
  )
}

export function BookCard({ book, view = 'grid' }: BookCardProps) {
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const isWishlisted = isInWishlist(book.id)
  const [isAdded, setIsAdded] = useState(false)

  // The Book type from types/index.ts lacks BookFormat, so we cast
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (book.stock === 0) return
    // @ts-expect-error: Book from types/index.ts is compatible at runtime
    addToCart(book, 'Paperback', 1)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1600)
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(book.id)
  }

  if (view === 'list') {
    return (
      <article className="card flex gap-4 p-4">
        <Link
          to={`/books/${book.id}`}
          className="flex-shrink-0"
          aria-label={`View details for ${book.title}`}
          tabIndex={-1}
        >
          <BookCover
            book={book}
            className="h-32 w-24 rounded-md object-cover"
          />
        </Link>
        <div className="flex flex-1 flex-col gap-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link
                to={`/books/${book.id}`}
                className="block font-semibold text-primary hover:text-accent transition-colors line-clamp-2 leading-snug"
              >
                {book.title}
              </Link>
              <p className="text-sm text-gray-500">{book.author}</p>
            </div>
            <button
              onClick={handleToggleWishlist}
              aria-label={isWishlisted ? `Remove ${book.title} from wishlist` : `Add ${book.title} to wishlist`}
              aria-pressed={isWishlisted}
              className="flex-shrink-0 rounded-full p-1.5 text-gray-400 transition-colors hover:text-red-500"
            >
              <Heart
                className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`}
                aria-hidden="true"
              />
            </button>
          </div>
          <StarRating rating={book.rating} reviewCount={book.reviewCount} size="sm" />
          <p className="line-clamp-2 text-xs text-gray-500 mt-1">{book.description}</p>
          <div className="mt-auto flex items-center justify-between pt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-primary">
                ${book.price.toFixed(2)}
              </span>
              {book.originalPrice > book.price && (
                <span className="text-xs text-gray-400 line-through">
                  ${book.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={book.stock === 0 || isAdded}
              aria-label={
                book.stock === 0 ? 'Out of stock' :
                isAdded ? `${book.title} added to cart` :
                `Add ${book.title} to cart`
              }
              className={`text-xs px-3 py-1.5 inline-flex items-center gap-1.5 rounded-btn font-semibold transition-colors ${
                isAdded ? 'bg-green-600 text-white' : 'btn-primary'
              }`}
            >
              {isAdded ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <ShoppingCart className="h-3.5 w-3.5" aria-hidden="true" />}
              {book.stock === 0 ? 'Out of Stock' : isAdded ? 'Added!' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </article>
    )
  }

  // Grid view
  return (
    <article className="card flex flex-col overflow-hidden group">
      <Link
        to={`/books/${book.id}`}
        className="relative overflow-hidden block"
        aria-label={`View ${book.title}`}
        tabIndex={-1}
      >
        <BookCover
          book={book}
          className="aspect-[2/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {book.bestSeller && (
            <Badge variant="accent" className="text-[10px]">Best Seller</Badge>
          )}
          {book.newArrival && (
            <Badge variant="warning" className="text-[10px]">New</Badge>
          )}
          {book.discount > 0 && (
            <Badge variant="success" className="text-[10px]">-{book.discount}%</Badge>
          )}
        </div>
        {/* Wishlist */}
        <button
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? `Remove ${book.title} from wishlist` : `Add ${book.title} to wishlist`}
          aria-pressed={isWishlisted}
          className="absolute right-2 top-2 rounded-full bg-white/90 p-2 shadow-sm text-gray-400 transition-colors hover:text-red-500 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
        >
          <Heart
            className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`}
            aria-hidden="true"
          />
        </button>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link
          to={`/books/${book.id}`}
          className="mb-0.5 font-semibold text-primary hover:text-accent transition-colors line-clamp-2 leading-snug text-sm"
        >
          {book.title}
        </Link>
        <p className="mb-2 text-xs text-gray-500">{book.author}</p>
        <StarRating rating={book.rating} reviewCount={book.reviewCount} size="sm" />

        <div className="mt-auto pt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-primary">${book.price.toFixed(2)}</span>
            {book.originalPrice > book.price && (
              <span className="text-xs text-gray-400 line-through">
                ${book.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={book.stock === 0 || isAdded}
            aria-label={
              book.stock === 0 ? `${book.title} is out of stock` :
              isAdded ? `${book.title} added` :
              `Add ${book.title} to cart`
            }
            className={`rounded-btn p-2 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed ${
              isAdded
                ? 'bg-green-600 text-white'
                : 'bg-primary/10 text-primary hover:bg-primary hover:text-white disabled:opacity-40'
            }`}
          >
            {isAdded
              ? <Check className="h-4 w-4" aria-hidden="true" />
              : <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            }
          </button>
        </div>
      </div>
    </article>
  )
}
