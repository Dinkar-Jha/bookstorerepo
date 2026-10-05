import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { Book } from '../types';

const mockBook: Book = {
  id: 'test-1',
  title: 'Test Clean Architecture',
  author: 'Robert C. Martin',
  description: 'A comprehensive guide to software structure.',
  price: 29.99,
  originalPrice: 39.99,
  discount: 25,
  currency: 'USD',
  category: ['Featured', 'Best Sellers'],
  genre: 'Technology',
  rating: 4.8,
  reviewCount: 320,
  isbn: '978-0134494166',
  publisher: 'Prentice Hall',
  publicationDate: '2017-09-20',
  pages: 432,
  language: 'English',
  stock: 5,
  coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600',
  featured: true,
  bestSeller: true,
  newArrival: false,
};

describe('Zustand Cart & Wishlist Stores Integration', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
    // Reset wishlist
    const currentWishlist = useWishlistStore.getState().items;
    currentWishlist.forEach((b) => useWishlistStore.getState().removeItem(b.id));
  });

  describe('useCartStore', () => {
    it('initializes with empty items array', () => {
      expect(useCartStore.getState().items).toEqual([]);
      expect(useCartStore.getState().totalItems()).toBe(0);
      expect(useCartStore.getState().subtotal()).toBe(0);
    });

    it('adds item to cart and calculates quantity and subtotal correctly', () => {
      useCartStore.getState().addItem(mockBook, 2);

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(2);
      expect(useCartStore.getState().totalItems()).toBe(2);
      expect(useCartStore.getState().subtotal()).toBeCloseTo(59.98);
    });

    it('respects stock ceiling when incrementing quantity', () => {
      // Stock is 5
      useCartStore.getState().addItem(mockBook, 3);
      useCartStore.getState().addItem(mockBook, 4); // Exceeds stock 5

      const items = useCartStore.getState().items;
      expect(items[0].quantity).toBe(5); // Capped at stock
    });

    it('updates item quantity and removes item when quantity reaches zero', () => {
      useCartStore.getState().addItem(mockBook, 2);
      useCartStore.getState().updateQuantity(mockBook.id, 4);

      expect(useCartStore.getState().items[0].quantity).toBe(4);

      useCartStore.getState().updateQuantity(mockBook.id, 0);
      expect(useCartStore.getState().items).toHaveLength(0);
    });

    it('removes item directly by ID', () => {
      useCartStore.getState().addItem(mockBook, 1);
      useCartStore.getState().removeItem(mockBook.id);

      expect(useCartStore.getState().items).toHaveLength(0);
    });
  });

  describe('useWishlistStore', () => {
    it('adds and removes book from wishlist', () => {
      expect(useWishlistStore.getState().hasItem(mockBook.id)).toBe(false);

      useWishlistStore.getState().addItem(mockBook);
      expect(useWishlistStore.getState().hasItem(mockBook.id)).toBe(true);
      expect(useWishlistStore.getState().items).toHaveLength(1);

      useWishlistStore.getState().removeItem(mockBook.id);
      expect(useWishlistStore.getState().hasItem(mockBook.id)).toBe(false);
      expect(useWishlistStore.getState().items).toHaveLength(0);
    });

    it('toggles item in wishlist', () => {
      useWishlistStore.getState().toggleItem(mockBook);
      expect(useWishlistStore.getState().hasItem(mockBook.id)).toBe(true);

      useWishlistStore.getState().toggleItem(mockBook);
      expect(useWishlistStore.getState().hasItem(mockBook.id)).toBe(false);
    });
  });
});
