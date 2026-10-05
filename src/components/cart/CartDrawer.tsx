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

  const freeShippingThreshold = 50.0;
  const progressToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-ibm-gray-20 animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 bg-ibm-gray-100 text-white flex items-center justify-between border-b border-ibm-gray-80">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-ibm-blue-50" />
            <h2 className="text-sm font-bold">
              Your Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart drawer"
            className="p-1.5 text-ibm-gray-30 hover:text-white hover:bg-ibm-gray-80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="bg-ibm-blue-10 p-3 border-b border-ibm-blue-20">
          <div className="flex justify-between items-center text-xs text-ibm-blue-80 font-medium mb-1">
            <span>
              {subtotal >= freeShippingThreshold
                ? '🎉 You unlocked Free Shipping!'
                : `Add $${(freeShippingThreshold - subtotal).toFixed(2)} more for Free Shipping`}
            </span>
            <span className="font-mono text-[10px]">{Math.round(progressToFreeShipping)}%</span>
          </div>
          <div className="w-full h-1.5 bg-ibm-blue-20 overflow-hidden">
            <div
              className="h-full bg-ibm-blue-60 transition-all duration-300"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-ibm-gray-20">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-ibm-gray-50">
              <ShoppingBag className="w-12 h-12 stroke-1 mb-3 text-ibm-gray-30" />
              <p className="text-sm font-medium text-ibm-gray-80">Your cart is empty</p>
              <p className="text-xs text-ibm-gray-50 mt-1 max-w-xs">
                Explore our catalog of Artificial Intelligence and software engineering books.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/catalog');
                }}
                className="mt-4 px-4 py-2 bg-ibm-blue-60 text-white text-xs font-medium hover:bg-ibm-blue-70 transition-colors"
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
                  className="w-16 h-22 object-cover border border-ibm-gray-20 flex-shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-ibm-gray-100 line-clamp-1">
                      {item.book.title}
                    </h4>
                    <p className="text-[11px] text-ibm-gray-50">{item.book.author}</p>
                    <span className="inline-block mt-1 text-[10px] font-mono bg-ibm-gray-10 text-ibm-gray-70 px-1.5 py-0.5 border border-ibm-gray-20">
                      Format: {item.selectedFormat}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-ibm-gray-30">
                      <button
                        onClick={() =>
                          updateQuantity(item.book.id, item.selectedFormat, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                        className="p-1 hover:bg-ibm-gray-10 text-ibm-gray-70"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-mono font-medium">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.book.id, item.selectedFormat, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                        className="p-1 hover:bg-ibm-gray-10 text-ibm-gray-70"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price and Delete */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-ibm-gray-100">
                        ${(item.book.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.book.id, item.selectedFormat)}
                        aria-label="Remove item"
                        className="text-ibm-gray-50 hover:text-red-500 transition-colors"
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
          <div className="p-4 bg-ibm-gray-10 border-t border-ibm-gray-20 space-y-2">
            <div className="flex justify-between text-xs text-ibm-gray-70">
              <span>Subtotal</span>
              <span className="font-mono font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-ibm-gray-70">
              <span>Estimated Tax (8%)</span>
              <span className="font-mono">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-ibm-gray-70">
              <span>Shipping</span>
              <span className="font-mono">
                {shipping === 0 ? <span className="text-green-600 font-bold">FREE</span> : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-ibm-gray-100 pt-2 border-t border-ibm-gray-20">
              <span>Total</span>
              <span className="font-mono text-base text-ibm-blue-70">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full mt-3 py-3 bg-ibm-blue-60 hover:bg-ibm-blue-70 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-ibm-gray-50 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
              <span>TLS 1.3 256-bit Encrypted Simulated Transaction</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
