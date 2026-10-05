import { create } from 'zustand'
import type { FilterState, FilterActions, Genre, Category, SortOption } from '../types'
import { getPriceRange } from '../data/books'

const [minPrice, maxPrice] = getPriceRange()

const defaultFilters: FilterState = {
  searchQuery: '',
  selectedGenres: [],
  selectedCategories: [],
  selectedAuthors: [],
  priceRange: [minPrice, maxPrice],
  minRating: 0,
  inStockOnly: false,
  sortBy: 'relevance',
}

export const useFilterStore = create<FilterState & FilterActions>((set, get) => ({
  ...defaultFilters,

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  setSelectedGenres: (genres: Genre[]) => set({ selectedGenres: genres }),
  toggleGenre: (genre: Genre) => {
    const current = get().selectedGenres
    set({
      selectedGenres: current.includes(genre)
        ? current.filter(g => g !== genre)
        : [...current, genre],
    })
  },

  setSelectedCategories: (categories: Category[]) => set({ selectedCategories: categories }),
  toggleCategory: (category: Category) => {
    const current = get().selectedCategories
    set({
      selectedCategories: current.includes(category)
        ? current.filter(c => c !== category)
        : [...current, category],
    })
  },

  setSelectedAuthors: (authors: string[]) => set({ selectedAuthors: authors }),
  toggleAuthor: (author: string) => {
    const current = get().selectedAuthors
    set({
      selectedAuthors: current.includes(author)
        ? current.filter(a => a !== author)
        : [...current, author],
    })
  },

  setPriceRange: (range: [number, number]) => set({ priceRange: range }),
  setMinRating: (rating: number) => set({ minRating: rating }),
  setInStockOnly: (value: boolean) => set({ inStockOnly: value }),
  setSortBy: (sort: SortOption) => set({ sortBy: sort }),

  resetFilters: () => set({ ...defaultFilters }),

  activeFilterCount: () => {
    const s = get()
    let count = 0
    if (s.selectedGenres.length) count++
    if (s.selectedCategories.length) count++
    if (s.selectedAuthors.length) count++
    if (s.priceRange[0] !== minPrice || s.priceRange[1] !== maxPrice) count++
    if (s.minRating > 0) count++
    if (s.inStockOnly) count++
    return count
  },
}))
