import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    totalItems,
    subtotal,
    tax,
    shipping,
    total
  } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 40.0;
  const progressToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm flex justify-end"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-modal flex flex-col border-l border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-primary text-white flex items-center justify-between border-b border-primary-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-white/80" />
            <h2 className="text-sm font-bold">
              Your Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart drawer"
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="bg-primary/5 p-3 border-b border-primary/10">
          <div className="flex justify-between items-center text-xs text-primary font-medium mb-1">
            <span>
              {subtotal >= freeShippingThreshold
                ? '🎉 You unlocked Free Shipping!'
                : `Add $${(freeShippingThreshold - subtotal).toFixed(2)} more for Free Shipping`}
            </span>
            <span className="font-mono text-[10px] text-primary/60">{Math.round(progressToFreeShipping)}%</span>
          </div>
          <div className="w-full h-1.5 bg-primary/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-300"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
              <ShoppingBag className="w-12 h-12 stroke-1 mb-3 text-gray-300" />
              <p className="text-sm font-medium text-primary">Your cart is empty</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs">
                Explore our catalog and find your next great read.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/books');
                }}
                className="mt-4 px-4 py-2 btn-primary text-xs"
              >
                Browse Books
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.book.id}-${item.selectedFormat}`} className="py-4 flex gap-3.5 first:pt-0">
                <img
                  src={item.book.coverImage}
                  alt={item.book.title}
                  className="w-16 h-24 object-cover border border-gray-200 rounded flex-shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-primary line-clamp-2 leading-snug">
                      {item.book.title}
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">{item.book.author}</p>
                    <span className="inline-block mt-1 text-[10px] font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">
                      {item.selectedFormat}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() =>
                          updateQuantity(item.book.id, item.selectedFormat, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                        className="p-1 hover:bg-gray-100 text-gray-600 rounded-l"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-mono font-medium select-none">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.book.id, item.selectedFormat, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.book.stock}
                        aria-label="Increase quantity"
                        className="p-1 hover:bg-gray-100 text-gray-600 rounded-r disabled:opacity-40"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price and Delete */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-primary">
                        ${(item.book.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.book.id, item.selectedFormat)}
                        aria-label={`Remove ${item.book.title} from cart`}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Subtotals */}
        {items.length > 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Subtotal</span>
              <span className="font-mono font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Estimated Tax (8%)</span>
              <span className="font-mono">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Shipping</span>
              <span className="font-mono">
                {shipping === 0 ? <span className="text-green-600 font-bold">FREE</span> : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-primary pt-2 border-t border-gray-200">
              <span>Total</span>
              <span className="font-mono text-base text-accent">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full mt-2 btn-accent py-3 flex items-center justify-center gap-2 text-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
              <span>Secure encrypted checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
