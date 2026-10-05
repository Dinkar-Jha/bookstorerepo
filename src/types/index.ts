// ─── Book Types ───────────────────────────────────────────────────────────────

export type Genre =
  | 'Fiction'
  | 'Mystery'
  | 'Science Fiction'
  | 'Fantasy'
  | 'Romance'
  | 'Biography'
  | 'Business'
  | 'Technology'
  | 'Self Development'
  | 'History'
  | "Children's"
  | 'Young Adult'
  | 'Philosophy'

export type Category =
  | 'New Arrivals'
  | 'Best Sellers'
  | 'Featured'
  | 'Staff Picks'
  | 'Award Winners'
  | 'Classic'

export interface Book {
  id: string
  title: string
  author: string
  description: string
  price: number
  originalPrice: number
  discount: number
  currency: string
  category: Category[]
  genre: Genre
  rating: number
  reviewCount: number
  isbn: string
  publisher: string
  publicationDate: string
  pages: number
  language: string
  stock: number
  coverImage: string
  featured: boolean
  bestSeller: boolean
  newArrival: boolean
}

// ─── Cart Types ───────────────────────────────────────────────────────────────

export interface CartItem {
  book: Book
  quantity: number
}

export interface CartState {
  items: CartItem[]
  addItem: (book: Book, quantity?: number) => void
  removeItem: (bookId: string) => void
  updateQuantity: (bookId: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  subtotal: () => number
}

// ─── Wishlist Types ────────────────────────────────────────────────────────────

export interface WishlistState {
  items: Book[]
  addItem: (book: Book) => void
  removeItem: (bookId: string) => void
  hasItem: (bookId: string) => boolean
  toggleItem: (book: Book) => void
}

// ─── Filter / Search Types ─────────────────────────────────────────────────────

export interface FilterState {
  searchQuery: string
  selectedGenres: Genre[]
  selectedCategories: Category[]
  selectedAuthors: string[]
  priceRange: [number, number]
  minRating: number
  inStockOnly: boolean
  sortBy: SortOption
}

export type SortOption =
  | 'relevance'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'newest'
  | 'best-selling'

export interface FilterActions {
  setSearchQuery: (query: string) => void
  setSelectedGenres: (genres: Genre[]) => void
  toggleGenre: (genre: Genre) => void
  setSelectedCategories: (categories: Category[]) => void
  toggleCategory: (category: Category) => void
  setSelectedAuthors: (authors: string[]) => void
  toggleAuthor: (author: string) => void
  setPriceRange: (range: [number, number]) => void
  setMinRating: (rating: number) => void
  setInStockOnly: (value: boolean) => void
  setSortBy: (sort: SortOption) => void
  resetFilters: () => void
  activeFilterCount: () => number
}
