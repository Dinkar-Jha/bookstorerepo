import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useToast } from './ToastContext';
import { MOCK_BOOKS } from '../data/mockBooks';

interface WishlistContextType {
  wishlistIds: string[];
  toggleWishlist: (bookId: string) => void;
  isInWishlist: (bookId: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'booknest_wishlist_ids_v2';

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { success, info } = useToast();

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter(id => typeof id === 'string') : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch {
      // Ignore
    }
  }, [wishlistIds]);

  const toggleWishlist = useCallback((bookId: string) => {
    const targetBook = MOCK_BOOKS.find((b) => b.id === bookId);
    const title = targetBook ? `"${targetBook.title}"` : 'Book';

    setWishlistIds((prev) => {
      const alreadyInWishlist = prev.includes(bookId);
      if (alreadyInWishlist) {
        info(`Removed ${title} from your wishlist.`);
        return prev.filter((id) => id !== bookId);
      } else {
        success(`Saved ${title} to your wishlist.`);
        return [...prev, bookId];
      }
    });
  }, [success, info]);

  const isInWishlist = useCallback((bookId: string) => wishlistIds.includes(bookId), [wishlistIds]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlistIds.length
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
