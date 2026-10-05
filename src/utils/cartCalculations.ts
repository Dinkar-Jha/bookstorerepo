import { CartItem, Book } from '../types/book';

export interface CartCalculationResult {
  itemsCount: number;
  itemCount: number; // Alias for backwards-compatibility with tests & UI
  subtotal: number;
  rawSubtotal: number;
  discountTotal: number;
  totalDiscount: number; // Alias for backwards-compatibility
  shipping: number;
  shippingFee: number; // Alias
  tax: number;
  estimatedTax: number; // Alias
  finalTotal: number;
  total: number; // Alias
  qualifiesForFreeShipping: boolean;
  amountNeededForFreeShipping: number;
  remainingForFreeShipping: number; // Alias
}

export const FREE_SHIPPING_THRESHOLD = 40.0;
export const STANDARD_SHIPPING_FEE = 4.99;
export const STANDARD_TAX_RATE = 0.08; // 8% sales tax
export const TAX_RATE = STANDARD_TAX_RATE;

export const calculateItemFinalPrice = (book: Book): number => {
  return Number(book.price.toFixed(2));
};

export const calculateItemSavings = (book: Book): number => {
  if (book.originalPrice && book.originalPrice > book.price) {
    return Number((book.originalPrice - book.price).toFixed(2));
  }
  return 0;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export interface StockValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateCartStock = (items: { book: Book; quantity: number }[]): StockValidationResult => {
  const errors: string[] = [];
  for (const item of items) {
    if (!item.book.stock && item.book.stock !== 0) {
      // Handle inStock / stockCount aliases
      const stock = (item.book as any).stockCount ?? (item.book as any).stock ?? 0;
      const inStock = (item.book as any).inStock ?? stock > 0;
      if (!inStock || stock <= 0) {
        errors.push(`"${item.book.title}" is currently out of stock.`);
      } else if (item.quantity > stock) {
        errors.push(`"${item.book.title}" only has ${stock} copies available.`);
      }
    } else {
      if (item.book.stock <= 0) {
        errors.push(`"${item.book.title}" is currently out of stock.`);
      } else if (item.quantity > item.book.stock) {
        errors.push(`"${item.book.title}" only has ${item.book.stock} copies available.`);
      }
    }
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const calculateCartTotals = (items: { book: Book; quantity: number }[]): CartCalculationResult => {
  const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Subtotal using discounted price * quantity
  const subtotal = items.reduce((acc, item) => acc + item.book.price * item.quantity, 0);

  // Raw subtotal using original list price * quantity (or regular price if no originalPrice)
  const rawSubtotal = items.reduce((acc, item) => {
    const listPrice = item.book.originalPrice && item.book.originalPrice > item.book.price
      ? item.book.originalPrice
      : item.book.price;
    return acc + listPrice * item.quantity;
  }, 0);

  // Total savings compared to original list price
  const discountTotal = Math.max(0, rawSubtotal - subtotal);

  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD && subtotal > 0;
  const shipping = itemsCount === 0 ? 0 : qualifiesForFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const tax = itemsCount === 0 ? 0 : subtotal * STANDARD_TAX_RATE;
  const finalTotal = itemsCount === 0 ? 0 : subtotal + tax + shipping;

  const resSubtotal = Number(subtotal.toFixed(2));
  const resRawSubtotal = Number(rawSubtotal.toFixed(2));
  const resDiscountTotal = Number(discountTotal.toFixed(2));
  const resShipping = Number(shipping.toFixed(2));
  const resTax = Number(tax.toFixed(2));
  const resFinalTotal = Number(finalTotal.toFixed(2));
  const resRemaining = Number(amountNeededForFreeShipping.toFixed(2));

  return {
    itemsCount,
    itemCount: itemsCount,
    subtotal: resSubtotal,
    rawSubtotal: resRawSubtotal,
    discountTotal: resDiscountTotal,
    totalDiscount: resDiscountTotal,
    shipping: resShipping,
    shippingFee: resShipping,
    tax: resTax,
    estimatedTax: resTax,
    finalTotal: resFinalTotal,
    total: resFinalTotal,
    qualifiesForFreeShipping,
    amountNeededForFreeShipping: resRemaining,
    remainingForFreeShipping: resRemaining,
  };
};

// Backwards-compatible alias for calculateCartSummary
export const calculateCartSummary = calculateCartTotals;
