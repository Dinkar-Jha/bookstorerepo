import { create } from 'zustand'
import type { Book, CartState, CartItem } from '../types'

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (book: Book, quantity = 1) => {
    set(state => {
      const existing = state.items.find(i => i.book.id === book.id)
      if (existing) {
        return {
          items: state.items.map(i =>
            i.book.id === book.id
              ? { ...i, quantity: Math.min(i.quantity + quantity, book.stock) }
              : i
          ),
        }
      }
      return { items: [...state.items, { book, quantity }] }
    })
  },

  removeItem: (bookId: string) => {
    set(state => ({ items: state.items.filter(i => i.book.id !== bookId) }))
  },

  updateQuantity: (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(bookId)
      return
    }
    set(state => ({
      items: state.items.map(i =>
        i.book.id === bookId ? { ...i, quantity } : i
      ),
    }))
  },

  clearCart: () => set({ items: [] }),

  totalItems: () => get().items.reduce((sum: number, i: CartItem) => sum + i.quantity, 0),

  subtotal: () =>
    get().items.reduce(
      (sum: number, i: CartItem) => sum + i.book.price * i.quantity,
      0
    ),
}))
