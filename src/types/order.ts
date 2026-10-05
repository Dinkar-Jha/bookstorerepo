import { CartItem } from '../types/book';
import { CartCalculationResult } from '../utils/cartCalculations';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  // Aliases for compatibility with different test fixtures
  fullName?: string;
  streetAddress?: string;
  zipCode?: string;
}

export interface PaymentDetails {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolder?: string; // Alias
}

// Alias for PaymentInfo
export type PaymentInfo = PaymentDetails;

export interface PlacedOrder {
  orderId: string;
  orderDate: string;
  deliveryEstimate: string;
  shippingAddress: ShippingAddress;
  paymentDetails: {
    cardholderName: string;
    maskedCardNumber: string;
    expiryDate: string;
  };
  items: CartItem[];
  calculations: CartCalculationResult;
}

export interface OrderContextType {
  lastOrder: PlacedOrder | null;
  saveOrder: (order: PlacedOrder) => void;
  getOrderById: (orderId: string) => PlacedOrder | null;
}
