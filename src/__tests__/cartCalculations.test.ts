import { describe, it, expect } from 'vitest';
import {
  calculateItemFinalPrice,
  calculateItemSavings,
  calculateCartSummary,
  validateCartStock,
  formatCurrency,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
  TAX_RATE,
} from '../utils/cartCalculations';
import { Book, CartItem } from '../types/book';

// Helper mock book
const createMockBook = (overrides: Partial<Book> = {}): Book => ({
  id: 'book-1',
  title: 'Test Book',
  author: 'Author Name',
  price: 20.0,
  originalPrice: 25.0,
  rating: 4.8,
  reviewCount: 120,
  coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80',
  description: 'Test description',
  category: 'Fiction',
  format: 'Hardcover',
  pages: 350,
  language: 'English',
  publishedDate: '2023-01-01',
  publisher: 'Test Press',
  isbn: '978-0-123456-47-2',
  inStock: true,
  stockCount: 10,
  tags: ['bestseller'],
  featured: false,
  ...overrides,
});

describe('Cart Calculations Engine', () => {
  describe('calculateItemFinalPrice & calculateItemSavings', () => {
    it('returns the standard price if originalPrice is not present or lower', () => {
      const book = createMockBook({ price: 15.99, originalPrice: undefined });
      expect(calculateItemFinalPrice(book)).toBe(15.99);
      expect(calculateItemSavings(book)).toBe(0);
    });

    it('returns the discounted price and calculates savings correctly', () => {
      const book = createMockBook({ price: 18.0, originalPrice: 24.0 });
      expect(calculateItemFinalPrice(book)).toBe(18.0);
      expect(calculateItemSavings(book)).toBe(6.0);
    });
  });

  describe('calculateCartSummary', () => {
    it('returns zero values for empty cart', () => {
      const summary = calculateCartSummary([]);
      expect(summary.itemCount).toBe(0);
      expect(summary.rawSubtotal).toBe(0);
      expect(summary.subtotal).toBe(0);
      expect(summary.totalDiscount).toBe(0);
      expect(summary.shippingFee).toBe(0);
      expect(summary.estimatedTax).toBe(0);
      expect(summary.total).toBe(0);
      expect(summary.qualifiesForFreeShipping).toBe(false);
      expect(summary.remainingForFreeShipping).toBe(FREE_SHIPPING_THRESHOLD);
    });

    it('calculates totals with standard shipping when below threshold ($40)', () => {
      const items: CartItem[] = [
        {
          book: createMockBook({ id: 'b1', price: 15.0, originalPrice: 20.0 }),
          quantity: 2,
        },
      ];

      const summary = calculateCartSummary(items);
      // Raw subtotal = 2 * 20 = 40
      // Actual Subtotal = 2 * 15 = 30
      // Discount = 40 - 30 = 10
      // Shipping = $4.99 (since subtotal $30 < $40)
      // Tax = 8% of $30 = $2.40
      // Total = $30 + $4.99 + $2.40 = $37.39
      expect(summary.itemCount).toBe(2);
      expect(summary.rawSubtotal).toBe(40.0);
      expect(summary.subtotal).toBe(30.0);
      expect(summary.totalDiscount).toBe(10.0);
      expect(summary.shippingFee).toBe(STANDARD_SHIPPING_FEE);
      expect(summary.qualifiesForFreeShipping).toBe(false);
      expect(summary.remainingForFreeShipping).toBe(10.0);
      expect(summary.estimatedTax).toBe(2.4);
      expect(summary.total).toBe(37.39);
    });

    it('applies free shipping when subtotal reaches or exceeds $40', () => {
      const items: CartItem[] = [
        {
          book: createMockBook({ id: 'b1', price: 25.0 }),
          quantity: 2, // Subtotal = $50.00
        },
      ];

      const summary = calculateCartSummary(items);
      expect(summary.subtotal).toBe(50.0);
      expect(summary.shippingFee).toBe(0);
      expect(summary.qualifiesForFreeShipping).toBe(true);
      expect(summary.remainingForFreeShipping).toBe(0);
      // Tax = 8% of $50 = $4.00
      expect(summary.estimatedTax).toBe(4.0);
      // Total = $50 + $0 + $4 = $54.00
      expect(summary.total).toBe(54.0);
    });
  });

  describe('validateCartStock', () => {
    it('returns valid when all items are within stock bounds', () => {
      const items: CartItem[] = [
        { book: createMockBook({ id: 'b1', inStock: true, stockCount: 5 }), quantity: 3 },
      ];
      const result = validateCartStock(items);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('flags items that are out of stock or exceed stock limit', () => {
      const items: CartItem[] = [
        { book: createMockBook({ id: 'b1', title: 'Sold Out Book', inStock: false, stockCount: 0 }), quantity: 1 },
        { book: createMockBook({ id: 'b2', title: 'Low Stock Book', inStock: true, stockCount: 2 }), quantity: 5 },
      ];
      const result = validateCartStock(items);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors[0]).toContain('Sold Out Book is currently out of stock');
      expect(result.errors[1]).toContain('Low Stock Book only has 2 copies available');
    });
  });

  describe('formatCurrency', () => {
    it('formats numbers into standard USD currency string', () => {
      expect(formatCurrency(24.99)).toBe('$24.99');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(1250.5)).toBe('$1,250.50');
    });
  });
});
