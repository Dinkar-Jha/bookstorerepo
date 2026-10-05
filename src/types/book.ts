export type BookCategory = 
  | 'Fiction' 
  | 'Non-Fiction' 
  | 'Technology & Computing' 
  | 'Business & Economics' 
  | 'Philosophy & Thought'
  | 'Young Readers & YA';

export type BookGenre = 
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
  | 'Philosophy';

export type BookFormat = 'Hardcover' | 'Paperback' | 'eBook' | 'Audiobook';

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number; // e.g. 15 for 15% off
  currency: 'USD';
  category: BookCategory;
  genre: BookGenre;
  rating: number;
  reviewCount: number;
  isbn: string;
  publisher: string;
  publicationDate: string;
  pages: number;
  language: string;
  stock: number;
  coverImage: string;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  formats?: BookFormat[];
  keyHighlights?: string[];
  tags?: string[];
}

export interface CartItem {
  book: Book;
  quantity: number;
  selectedFormat: BookFormat;
}

export interface FilterState {
  searchQuery: string;
  genres: BookGenre[];
  categories: BookCategory[];
  authors: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  sortBy: 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'bestselling';
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
}
