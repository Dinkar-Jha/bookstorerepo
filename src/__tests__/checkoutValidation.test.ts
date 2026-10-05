import { describe, it, expect } from 'vitest';
import { ShippingAddress, PaymentInfo } from '../types/order';

describe('Checkout Form Validation Logic', () => {
  const validateShipping = (address: Partial<ShippingAddress>): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!address.fullName?.trim()) errors.fullName = 'Full name is required';
    if (!address.email?.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!address.streetAddress?.trim()) errors.streetAddress = 'Street address is required';
    if (!address.city?.trim()) errors.city = 'City is required';
    if (!address.state?.trim()) errors.state = 'State / Province is required';
    if (!address.zipCode?.trim()) errors.zipCode = 'ZIP / Postal code is required';
    return errors;
  };

  const validatePayment = (payment: Partial<PaymentInfo>): Record<string, string> => {
    const errors: Record<string, string> = {};
    const sanitizedCard = (payment.cardNumber || '').replace(/\s+/g, '');
    if (!sanitizedCard) {
      errors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(sanitizedCard)) {
      errors.cardNumber = 'Card number must be 16 digits';
    }

    if (!payment.cardHolder?.trim()) errors.cardHolder = 'Cardholder name is required';

    if (!payment.expiryDate?.trim()) {
      errors.expiryDate = 'Expiration date is required';
    } else if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(payment.expiryDate)) {
      errors.expiryDate = 'Format must be MM/YY';
    }

    if (!payment.cvv?.trim()) {
      errors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(payment.cvv)) {
      errors.cvv = 'CVV must be 3 or 4 digits';
    }

    return errors;
  };

  describe('Shipping Step Validation', () => {
    it('detects missing required fields', () => {
      const errors = validateShipping({});
      expect(errors.fullName).toBeDefined();
      expect(errors.email).toBeDefined();
      expect(errors.streetAddress).toBeDefined();
      expect(errors.city).toBeDefined();
      expect(errors.state).toBeDefined();
      expect(errors.zipCode).toBeDefined();
    });

    it('validates email pattern correctly', () => {
      const invalidEmail = validateShipping({ fullName: 'John', email: 'invalid-email' });
      expect(invalidEmail.email).toBe('Please enter a valid email address');

      const validEmail = validateShipping({ fullName: 'John', email: 'john.doe@example.com' });
      expect(validEmail.email).toBeUndefined();
    });

    it('passes with all valid shipping fields', () => {
      const validData: ShippingAddress = {
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        phone: '555-1234',
        streetAddress: '123 Bookworm Lane',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
        country: 'United States',
      };
      const errors = validateShipping(validData);
      expect(Object.keys(errors).length).toBe(0);
    });
  });

  describe('Payment Step Validation', () => {
    it('validates 16-digit card number and formatting', () => {
      expect(validatePayment({ cardNumber: '123' }).cardNumber).toBe('Card number must be 16 digits');
      expect(validatePayment({ cardNumber: '4242 4242 4242 4242' }).cardNumber).toBeUndefined();
    });

    it('validates MM/YY expiration format', () => {
      expect(validatePayment({ expiryDate: '13/28' }).expiryDate).toBe('Format must be MM/YY');
      expect(validatePayment({ expiryDate: '12/28' }).expiryDate).toBeUndefined();
    });

    it('validates CVV format', () => {
      expect(validatePayment({ cvv: '12' }).cvv).toBe('CVV must be 3 or 4 digits');
      expect(validatePayment({ cvv: '123' }).cvv).toBeUndefined();
      expect(validatePayment({ cvv: '1234' }).cvv).toBeUndefined();
    });
  });
});
