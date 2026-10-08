import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Book, BookFormat, CartItem } from '../types/book';
import { calculateCartTotals, CartCalculationResult } from '../utils/cartCalculations';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (book: Book, format?: BookFormat, quantity?: number) => boolean;
  removeFromCart: (bookId: string, format: BookFormat) => void;
  updateQuantity: (bookId: string, format: BookFormat, quantity: number) => boolean;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  calculations: CartCalculationResult;
  totalItems: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discountTotal: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'booknest_cart_items_v2';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { success, error, info } = useToast();

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      // Validate schema of items
      if (Array.isArray(parsed)) {
        return parsed.filter(item => item && item.book && typeof item.quantity === 'number' && item.quantity > 0);
      }
      return [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore write errors in restricted sandbox
    }
  }, [items]);

  const addToCart = (book: Book, format: BookFormat = 'Paperback', quantity: number = 1): boolean => {
    if (quantity <= 0) return false;
    if (book.stock <= 0) {
      error(`Sorry, "${book.title}" is currently out of stock.`);
      return false;
    }

    // Validate against current items snapshot before calling setItems
    const currentItems = items;
    const existingItem = currentItems.find(
      (item) => item.book.id === book.id && item.selectedFormat === format
    );

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (newQty > book.stock) {
        error(`Cannot add more copies. Maximum available stock for "${book.title}" is ${book.stock}.`);
        return false;
      }
      setItems((prev) =>
        prev.map((item) =>
          item.book.id === book.id && item.selectedFormat === format
            ? { ...item, quantity: newQty }
            : item
        )
      );
    } else {
      if (quantity > book.stock) {
        error(`Cannot add ${quantity} copies. Maximum available stock for "${book.title}" is ${book.stock}.`);
        return false;
      }
      setItems((prev) => [...prev, { book, selectedFormat: format, quantity }]);
    }

    success(`Added "${book.title}" (${format}) to your cart.`);
    return true;
  };

  const removeFromCart = (bookId: string, format: BookFormat) => {
    const itemToRemove = items.find((item) => item.book.id === bookId && item.selectedFormat === format);
    setItems((prev) => prev.filter((item) => !(item.book.id === bookId && item.selectedFormat === format)));
    if (itemToRemove) {
      info(`Removed "${itemToRemove.book.title}" from your cart.`);
    }
  };

  const updateQuantity = (bookId: string, format: BookFormat, quantity: number): boolean => {
    const item = items.find((i) => i.book.id === bookId && i.selectedFormat === format);
    if (!item) return false;

    if (quantity <= 0) {
      removeFromCart(bookId, format);
      return true;
    }

    if (quantity > item.book.stock) {
      error(`Only ${item.book.stock} copies in stock for "${item.book.title}".`);
      return false;
    }

    setItems((prev) =>
      prev.map((i) =>
        i.book.id === bookId && i.selectedFormat === format
          ? { ...i, quantity }
          : i
      )
    );
    return true;
  };

  const clearCart = () => {
    setItems([]);
  };

  // Pure derived calculations
  const calculations = useMemo(() => calculateCartTotals(items), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        calculations,
        totalItems: calculations.itemsCount,
        subtotal: calculations.subtotal,
        tax: calculations.tax,
        shipping: calculations.shipping,
        discountTotal: calculations.discountTotal,
        total: calculations.finalTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
