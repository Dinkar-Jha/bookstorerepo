import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, ShieldCheck, Truck, Heart, ArrowLeft, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';

export const CartPage: React.FC = () => {
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    calculations, 
    totalItems 
  } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const {
    subtotal,
    discountTotal,
    shipping,
    tax,
    finalTotal,
    qualifiesForFreeShipping,
    amountNeededForFreeShipping
  } = calculations;

  const freeShippingThreshold = 40.0;
  const progressToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  const handleSaveForLater = (item: typeof items[0]) => {
    if (!isInWishlist(item.book.id)) {
      toggleWishlist(item.book.id);
    }
    removeFromCart(item.book.id, item.selectedFormat);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumb */}
      <Breadcrumbs items={[{ label: 'Shopping Cart' }]} />

      {/* Header */}
      <div className="bg-book-card border border-book-border rounded-xl p-6 sm:p-8 shadow-book-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-book-burgundy font-bold">
            Order Review
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-book-charcoal mt-1">
            Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-xs sm:text-sm text-book-stone-500 mt-1">
            Review your selected titles, formats, and quantities before checkout.
          </p>
        </div>
        <Link to="/books">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Continue Browsing
          </Button>
        </Link>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon="cart"
          title="Your cart is waiting for its next great read"
          description="Explore our handpicked collection of fiction, science, philosophy, and bestsellers to fill your library."
          actionLabel="Continue Shopping"
          onAction={() => window.location.assign('/books')}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Items List (8 cols) */}
          <div className="lg:col-span-8 bg-book-card border border-book-border rounded-2xl p-6 shadow-book-card divide-y divide-book-border">
            
            {/* Free Shipping Progress Strip */}
            <div className="pb-6">
              <div className="flex justify-between items-center text-xs text-book-charcoal font-medium mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-book-burgundy" />
                  {qualifiesForFreeShipping
                    ? '🎉 You unlocked Free Standard Shipping!'
                    : `Add $${amountNeededForFreeShipping.toFixed(2)} more for Free Shipping`}
                </span>
                <span className="font-mono text-book-stone-500 font-bold">{Math.round(progressToFreeShipping)}%</span>
              </div>
              <div className="w-full h-2 bg-book-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-book-burgundy transition-all duration-300 rounded-full"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>

            {/* Item Rows */}
            {items.map((item) => {
              const isWishlisted = isInWishlist(item.book.id);
              const maxStock = item.book.stock;

              return (
                <div key={`${item.book.id}-${item.selectedFormat}`} className="py-6 flex flex-col sm:flex-row gap-4 sm:gap-6 first:pt-6">
                  <Link to={`/books/${item.book.id}`} className="w-24 sm:w-28 aspect-[3/4] flex-shrink-0 bg-book-muted rounded-md overflow-hidden self-center sm:self-start">
                    <img
                      src={item.book.coverImage}
                      alt={item.book.title}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono uppercase text-book-burgundy font-bold">
                          {item.book.genre}
                        </span>
                        <span className="text-xs font-mono text-book-stone-500">
                          {item.book.stock > 0 ? `${item.book.stock} in stock` : 'Out of stock'}
                        </span>
                      </div>

                      <Link to={`/books/${item.book.id}`}>
                        <h3 className="font-serif font-bold text-base text-book-charcoal hover:text-book-burgundy transition-colors line-clamp-2">
                          {item.book.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-book-stone-500">by {item.book.author}</p>
                      
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-[11px] font-mono text-book-stone-700 bg-book-muted px-2 py-0.5 rounded border border-book-border">
                          Format: {item.selectedFormat}
                        </span>
                        <span className="text-xs font-mono font-semibold text-book-charcoal">
                          Unit: ${item.book.price.toFixed(2)}
                        </span>
                        {item.book.originalPrice && item.book.originalPrice > item.book.price && (
                          <span className="text-xs font-mono text-book-stone-500 line-through">
                            ${item.book.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between pt-3 border-t border-book-border/50 gap-3">
                      {/* Quantity Selector with Stock Guard */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-book-border rounded-md bg-book-card">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.book.id, item.selectedFormat, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                            className="px-2.5 py-1 text-book-stone-700 hover:bg-book-muted disabled:opacity-40 rounded-l-md focus-ring"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-mono font-bold select-none">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.book.id, item.selectedFormat, item.quantity + 1)}
                            disabled={item.quantity >= maxStock}
                            aria-label="Increase quantity"
                            className="px-2.5 py-1 text-book-stone-700 hover:bg-book-muted disabled:opacity-40 rounded-r-md focus-ring"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {item.quantity >= maxStock && (
                          <span className="text-[10px] text-book-amber font-mono font-medium">
                            Max stock reached
                          </span>
                        )}
                      </div>

                      {/* Total Item Price & Actions */}
                      <div className="flex items-center gap-4">
                        <span className="font-mono font-bold text-base text-book-charcoal">
                          ${(item.book.price * item.quantity).toFixed(2)}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleSaveForLater(item)}
                          aria-label={`Save ${item.book.title} for later`}
                          className="text-xs text-book-stone-500 hover:text-book-burgundy flex items-center gap-1 focus-ring rounded p-1"
                          title="Move to Wishlist"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-book-burgundy text-book-burgundy' : ''}`} />
                          <span className="hidden sm:inline">Save for Later</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.book.id, item.selectedFormat)}
                          aria-label={`Remove ${item.book.title} from cart`}
                          className="text-book-stone-500 hover:text-book-error p-1 rounded transition-colors focus-ring"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary Sidebar (4 cols) */}
          <div className="lg:col-span-4 bg-book-card border border-book-border rounded-2xl p-6 shadow-book-card space-y-5 sticky top-28">
            <h3 className="font-serif text-lg font-bold text-book-charcoal pb-3 border-b border-book-border">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs text-book-stone-700">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                <span className="font-mono font-bold text-book-charcoal">${subtotal.toFixed(2)}</span>
              </div>

              {discountTotal > 0 && (
                <div className="flex justify-between text-book-success font-medium">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Book Savings
                  </span>
                  <span className="font-mono">-${discountTotal.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Sales Tax (8%)</span>
                <span className="font-mono">${tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Standard Tracked Delivery</span>
                <span className="font-mono font-semibold">
                  {shipping === 0 ? <span className="text-book-success font-bold">FREE</span> : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              <div className="pt-3 border-t border-book-border flex justify-between text-base font-bold text-book-charcoal">
                <span>Estimated Total</span>
                <span className="font-serif text-xl text-book-burgundy font-bold">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link to="/checkout" className="block">
              <Button variant="accent" size="lg" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Proceed to Checkout
              </Button>
            </Link>

            <div className="p-3 bg-book-muted rounded-lg border border-book-border text-[11px] text-book-stone-700 space-y-1">
              <div className="flex items-center gap-2 font-semibold text-book-charcoal">
                <ShieldCheck className="w-4 h-4 text-book-success flex-shrink-0" />
                <span>BookNest Purchase Guarantee</span>
              </div>
              <p className="text-[10px] text-book-stone-500 pl-6 leading-tight">
                30-day return policy with zero restocking fees.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
