import { create } from 'zustand'
import type { Book, WishlistState } from '../types'

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],

  addItem: (book: Book) => {
    if (!get().hasItem(book.id)) {
      set(state => ({ items: [...state.items, book] }))
    }
  },

  removeItem: (bookId: string) => {
    set(state => ({ items: state.items.filter(b => b.id !== bookId) }))
  },

  hasItem: (bookId: string) => {
    return get().items.some(b => b.id === bookId)
  },

  toggleItem: (book: Book) => {
    if (get().hasItem(book.id)) {
      get().removeItem(book.id)
    } else {
      get().addItem(book)
    }
  },
}))
