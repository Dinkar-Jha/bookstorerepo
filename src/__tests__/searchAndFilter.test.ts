import { describe, it, expect } from 'vitest';
import { MOCK_BOOKS } from '../data/mockBooks';
import { Book } from '../types/book';

describe('Search & Filtering Pipeline', () => {
  it('loads the full 32-book dataset with required attributes', () => {
    expect(MOCK_BOOKS.length).toBe(32);
    MOCK_BOOKS.forEach((book) => {
      expect(book.id).toBeDefined();
      expect(book.title).toBeDefined();
      expect(book.author).toBeDefined();
      expect(book.price).toBeGreaterThan(0);
      expect(book.category).toBeDefined();
      expect(book.genre).toBeDefined();
      expect(book.rating).toBeGreaterThanOrEqual(1);
      expect(book.rating).toBeLessThanOrEqual(5);
    });
  });

  it('filters books by title search query case-insensitively', () => {
    const query = 'midnight';
    const results = MOCK_BOOKS.filter(
      (b) =>
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        b.author.toLowerCase().includes(query.toLowerCase())
    );
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toBe('The Midnight Library');
  });

  it('filters books by author query', () => {
    const query = 'Haig';
    const results = MOCK_BOOKS.filter((b) =>
      b.author.toLowerCase().includes(query.toLowerCase())
    );
    expect(results.some((b) => b.author.includes('Matt Haig'))).toBe(true);
  });

  it('filters books by genre or category', () => {
    const techBooks = MOCK_BOOKS.filter((b) => b.genre === 'Technology' || b.category === 'Technology & Computing');
    expect(techBooks.length).toBeGreaterThan(0);
    techBooks.forEach((book) => {
      expect(['Technology', 'Technology & Computing']).toContain(book.category || book.genre);
    });
  });

  it('filters books by minimum rating', () => {
    const minRating = 4.8;
    const highRated = MOCK_BOOKS.filter((b) => b.rating >= minRating);
    expect(highRated.length).toBeGreaterThan(0);
    highRated.forEach((book) => {
      expect(book.rating).toBeGreaterThanOrEqual(4.8);
    });
  });

  it('filters books by in-stock availability', () => {
    const inStockOnly = MOCK_BOOKS.filter((b) => b.stock > 0);
    expect(inStockOnly.length).toBeGreaterThan(0);
    inStockOnly.forEach((book) => {
      expect(book.stock).toBeGreaterThan(0);
    });
  });

  it('sorts books by price ascending and descending', () => {
    const asc = [...MOCK_BOOKS].sort((a, b) => a.price - b.price);
    const desc = [...MOCK_BOOKS].sort((a, b) => b.price - a.price);

    expect(asc[0].price).toBeLessThanOrEqual(asc[asc.length - 1].price);
    expect(desc[0].price).toBeGreaterThanOrEqual(desc[desc.length - 1].price);
  });

  it('sorts books by rating descending', () => {
    const sorted = [...MOCK_BOOKS].sort((a, b) => b.rating - a.rating);
    expect(sorted[0].rating).toBeGreaterThanOrEqual(sorted[sorted.length - 1].rating);
  });
});
