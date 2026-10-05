import { useMemo } from 'react'
import { books } from '../data/books'
import { useFilterStore } from '../store/filterStore'
import type { Book } from '../types'

/**
 * Returns filtered, searched, and sorted books based on the global filter store.
 * Can optionally accept an override query for the search page.
 */
export function useFilteredBooks(overrideQuery?: string): Book[] {
  const {
    searchQuery,
    selectedGenres,
    selectedCategories,
    selectedAuthors,
    priceRange,
    minRating,
    inStockOnly,
    sortBy,
  } = useFilterStore()

  const query = (overrideQuery ?? searchQuery).trim().toLowerCase()

  return useMemo(() => {
    let result = books.filter(book => {
      // Search
      if (query) {
        const haystack = [
          book.title,
          book.author,
          book.genre,
          book.description,
          ...book.category,
        ]
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(query)) return false
      }

      // Genre filter
      if (selectedGenres.length && !selectedGenres.includes(book.genre)) return false

      // Category filter
      if (
        selectedCategories.length &&
        !selectedCategories.some(c => book.category.includes(c))
      )
        return false

      // Author filter
      if (selectedAuthors.length && !selectedAuthors.includes(book.author)) return false

      // Price range
      if (book.price < priceRange[0] || book.price > priceRange[1]) return false

      // Rating filter
      if (minRating > 0 && book.rating < minRating) return false

      // Stock filter
      if (inStockOnly && book.stock === 0) return false

      return true
    })

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result = [...result].sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        result = [...result].sort(
          (a, b) =>
            new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime()
        )
        break
      case 'best-selling':
        result = [...result].sort((a, b) => b.reviewCount - a.reviewCount)
        break
      default:
        // relevance: keep natural order, but promoted featured first if no query
        if (!query) {
          result = [...result].sort((a, b) => Number(b.featured) - Number(a.featured))
        }
    }

    return result
  }, [
    query,
    selectedGenres,
    selectedCategories,
    selectedAuthors,
    priceRange,
    minRating,
    inStockOnly,
    sortBy,
  ])
}
