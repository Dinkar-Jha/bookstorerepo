import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  Lock, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { ShippingAddress, PaymentDetails, PlacedOrder } from '../types/order';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, calculations, clearCart, totalItems } = useCart();
  const { saveOrder } = useOrder();
  const { error, success } = useToast();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [shipping, setShipping] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States'
  });

  const [shippingErrors, setShippingErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});

  const [payment, setPayment] = useState<PaymentDetails>({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const [paymentErrors, setPaymentErrors] = useState<Partial<Record<keyof PaymentDetails, string>>>({});

  // Guard: if cart is empty, redirect or show message
  if (items.length === 0 && !isProcessing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-book-muted rounded-full flex items-center justify-center mx-auto text-book-burgundy">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-book-charcoal">
          Your Cart is Empty
        </h1>
        <p className="text-sm text-book-stone-500 max-w-md mx-auto">
          You cannot proceed to checkout with an empty cart. Please add some books from our catalog first.
        </p>
        <Link to="/books">
          <Button variant="accent" size="md">
            Explore Books Catalog
          </Button>
        </Link>
      </div>
    );
  }

  // Validation functions
  const validateShipping = (): boolean => {
    const errs: Partial<Record<keyof ShippingAddress, string>> = {};

    if (!shipping.firstName.trim()) errs.firstName = 'First name is required';
    if (!shipping.lastName.trim()) errs.lastName = 'Last name is required';
    
    if (!shipping.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email.trim())) {
      errs.email = 'Please provide a valid email address';
    }

    if (!shipping.phone.trim()) {
      errs.phone = 'Phone number is required for delivery alerts';
    } else if (shipping.phone.replace(/\D/g, '').length < 7) {
      errs.phone = 'Please enter a valid phone number';
    }

    if (!shipping.address.trim()) errs.address = 'Street address is required';
    if (!shipping.city.trim()) errs.city = 'City is required';
    if (!shipping.state.trim()) errs.state = 'State / Province is required';
    if (!shipping.postalCode.trim()) errs.postalCode = 'Postal / ZIP code is required';
    if (!shipping.country.trim()) errs.country = 'Country is required';

    setShippingErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePayment = (): boolean => {
    const errs: Partial<Record<keyof PaymentDetails, string>> = {};

    if (!payment.cardholderName.trim()) {
      errs.cardholderName = 'Cardholder name is required';
    }

    const cleanCard = payment.cardNumber.replace(/\s+/g, '');
    if (!cleanCard) {
      errs.cardNumber = 'Card number is required';
    } else if (cleanCard.length < 13 || cleanCard.length > 19) {
      errs.cardNumber = 'Please enter a valid 13-19 digit card number';
    }

    if (!payment.expiryDate.trim()) {
      errs.expiryDate = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(payment.expiryDate.trim())) {
      errs.expiryDate = 'Format must be MM/YY';
    }

    if (!payment.cvv.trim()) {
      errs.cvv = 'CVV is required';
    } else if (payment.cvv.length < 3 || payment.cvv.length > 4) {
      errs.cvv = 'CVV must be 3 or 4 digits';
    }

    setPaymentErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShipping()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      error('Please correct the highlighted fields before proceeding.');
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePayment()) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      error('Please enter valid demo payment details.');
    }
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const orderId = `BN-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
      const cleanCard = payment.cardNumber.replace(/\s+/g, '');
      const last4 = cleanCard.length >= 4 ? cleanCard.slice(-4) : '4242';

      const placedOrder: PlacedOrder = {
        orderId,
        orderDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        deliveryEstimate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        shippingAddress: { ...shipping },
        paymentDetails: {
          cardholderName: payment.cardholderName,
          maskedCardNumber: `•••• •••• •••• ${last4}`,
          expiryDate: payment.expiryDate
        },
        items: [...items],
        calculations: { ...calculations }
      };

      saveOrder(placedOrder);
      clearCart();
      setIsProcessing(false);
      success('Order placed successfully!');
      navigate(`/order-confirmation/${orderId}`);
    }, 1200);
  };

  // Helper formatting for card number
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const clean = value.replace(/[^0-9]/g, '');
    if (clean.length >= 3) {
      return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
    }
    return clean;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Cart', path: '/cart' }, { label: 'Secure Checkout' }]} />

      {/* Progress Indicator */}
      <div className="bg-book-card border border-book-border rounded-2xl p-6 sm:p-8 shadow-book-card">
        <div className="max-w-3xl mx-auto">
          <nav aria-label="Checkout Steps" className="grid grid-cols-3 gap-2 sm:gap-4 relative text-center">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-mono font-bold text-xs sm:text-sm transition-all ${
                  step === 1
                    ? 'bg-book-burgundy text-white ring-4 ring-rose-100'
                    : step > 1
                    ? 'bg-book-success text-white'
                    : 'bg-book-muted text-book-stone-500'
                }`}
              >
                {step > 1 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
              </div>
              <span className={`text-xs mt-2 font-semibold ${step === 1 ? 'text-book-burgundy' : 'text-book-charcoal'}`}>
                1. Shipping Address
              </span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-mono font-bold text-xs sm:text-sm transition-all ${
                  step === 2
                    ? 'bg-book-burgundy text-white ring-4 ring-rose-100'
                    : step > 2
                    ? 'bg-book-success text-white'
                    : 'bg-book-muted text-book-stone-500'
                }`}
              >
                {step > 2 ? <CheckCircle2 className="w-5 h-5" /> : '2'}
              </div>
              <span className={`text-xs mt-2 font-semibold ${step === 2 ? 'text-book-burgundy' : 'text-book-stone-500'}`}>
                2. Demo Payment
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-mono font-bold text-xs sm:text-sm transition-all ${
                  step === 3
                    ? 'bg-book-burgundy text-white ring-4 ring-rose-100'
                    : 'bg-book-muted text-book-stone-500'
                }`}
              >
                3
              </div>
              <span className={`text-xs mt-2 font-semibold ${step === 3 ? 'text-book-burgundy' : 'text-book-stone-500'}`}>
                3. Final Review
              </span>
            </div>
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Step Forms (7 cols) */}
        <div className="lg:col-span-7 bg-book-card border border-book-border rounded-2xl p-6 sm:p-8 shadow-book-card">
          
          {/* STEP 1: Shipping Form */}
          {step === 1 && (
            <form onSubmit={handleShippingSubmit} className="space-y-5" noValidate>
              <div className="flex items-center gap-2.5 pb-4 border-b border-book-border">
                <div className="p-2 bg-rose-50 text-book-burgundy rounded-lg">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-book-charcoal">
                    Shipping & Delivery Details
                  </h2>
                  <p className="text-xs text-book-stone-500">
                    Enter the recipient and delivery location for your books.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name *"
                  value={shipping.firstName}
                  error={shippingErrors.firstName}
                  onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })}
                  placeholder="e.g. Jane"
                />
                <Input
                  label="Last Name *"
                  value={shipping.lastName}
                  error={shippingErrors.lastName}
                  onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })}
                  placeholder="e.g. Austen"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="email"
                  label="Email Address *"
                  value={shipping.email}
                  error={shippingErrors.email}
                  onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                  placeholder="jane.austen@example.com"
                  helperText="Tracking receipt will be sent here"
                />
                <Input
                  type="tel"
                  label="Phone Number *"
                  value={shipping.phone}
                  error={shippingErrors.phone}
                  onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                  placeholder="(555) 019-2834"
                  helperText="For carrier delivery updates"
                />
              </div>

              <Input
                label="Street Address *"
                value={shipping.address}
                error={shippingErrors.address}
                onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                placeholder="142 Literary Way, Apt 4B"
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <Input
                  label="City *"
                  value={shipping.city}
                  error={shippingErrors.city}
                  onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                  placeholder="Boston"
                />
                <Input
                  label="State / Province *"
                  value={shipping.state}
                  error={shippingErrors.state}
                  onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                  placeholder="MA"
                />
                <div className="col-span-2 sm:col-span-1">
                  <Input
                    label="Postal Code *"
                    value={shipping.postalCode}
                    error={shippingErrors.postalCode}
                    onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                    placeholder="02108"
                  />
                </div>
              </div>

              <Select
                label="Country *"
                value={shipping.country}
                onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                options={[
                  { value: 'United States', label: 'United States' },
                  { value: 'Canada', label: 'Canada' },
                  { value: 'United Kingdom', label: 'United Kingdom' },
                  { value: 'Australia', label: 'Australia' }
                ]}
              />

              <div className="pt-4 flex items-center justify-between border-t border-book-border">
                <Link to="/cart">
                  <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                    Back to Cart
                  </Button>
                </Link>
                <Button type="submit" variant="accent" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Continue to Payment
                </Button>
              </div>
            </form>
          )}

          {/* STEP 2: Demo Payment Form */}
          {step === 2 && (
            <form onSubmit={handlePaymentSubmit} className="space-y-5" noValidate>
              <div className="flex items-center justify-between pb-4 border-b border-book-border">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-50 text-book-amber rounded-lg">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-book-charcoal">
                      Payment Simulation
                    </h2>
                    <p className="text-xs text-book-stone-500">
                      Safe simulated sandbox for Capstone demonstration.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-book-burgundy font-semibold hover:underline flex items-center gap-1 focus-ring rounded"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Edit Shipping
                </button>
              </div>

              {/* Demo Notice Warning */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-book-amber flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">Demo Environment Notice</span>
                  <p className="leading-relaxed">
                    This is a front-end capstone demonstration. No actual charges will be made. You may use the pre-filled safe test credentials or type your own mock values.
                  </p>
                </div>
              </div>

              {/* Preset Safe Test Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setPayment({
                      cardholderName: `${shipping.firstName} ${shipping.lastName}`.trim() || 'Alex Morgan',
                      cardNumber: '4242 4242 4242 4242',
                      expiryDate: '12/28',
                      cvv: '888'
                    });
                    setPaymentErrors({});
                  }}
                  className="text-xs font-mono font-semibold text-book-burgundy hover:underline"
                >
                  ⚡ Auto-fill Safe Mock Card
                </button>
              </div>

              <Input
                label="Cardholder Full Name *"
                value={payment.cardholderName}
                error={paymentErrors.cardholderName}
                onChange={(e) => setPayment({ ...payment, cardholderName: e.target.value })}
                placeholder="Jane Austen"
              />

              <Input
                label="Card Number (Mock) *"
                value={payment.cardNumber}
                error={paymentErrors.cardNumber}
                onChange={(e) => setPayment({ ...payment, cardNumber: formatCardNumber(e.target.value) })}
                placeholder="4242 4242 4242 4242"
                maxLength={19}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Expiration Date (MM/YY) *"
                  value={payment.expiryDate}
                  error={paymentErrors.expiryDate}
                  onChange={(e) => setPayment({ ...payment, expiryDate: formatExpiry(e.target.value) })}
                  placeholder="12/28"
                  maxLength={5}
                />
                <Input
                  label="CVV Code *"
                  value={payment.cvv}
                  error={paymentErrors.cvv}
                  onChange={(e) => setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, '') })}
                  placeholder="123"
                  maxLength={4}
                  type="password"
                />
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-book-border">
                <Button type="button" variant="outline" size="sm" onClick={() => setStep(1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button type="submit" variant="accent" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Review Order
                </Button>
              </div>
            </form>
          )}

          {/* STEP 3: Order Review & Place Order */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-book-border">
                <div className="p-2 bg-emerald-50 text-book-success rounded-lg">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-book-charcoal">
                    Review & Confirm Order
                  </h2>
                  <p className="text-xs text-book-stone-500">
                    Verify all shipping and mock payment details before placing order.
                  </p>
                </div>
              </div>

              {/* Shipping Address Confirmation Box */}
              <div className="p-4 bg-book-muted/60 border border-book-border rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono uppercase tracking-wider text-book-charcoal font-bold">
                    Delivery Address
                  </span>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-book-burgundy font-semibold hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="text-xs text-book-stone-700 leading-relaxed font-mono">
                  <p className="font-bold text-book-charcoal">{shipping.firstName} {shipping.lastName}</p>
                  <p>{shipping.address}</p>
                  <p>{shipping.city}, {shipping.state} {shipping.postalCode}, {shipping.country}</p>
                  <p className="text-book-stone-500 pt-1">Email: {shipping.email} • Phone: {shipping.phone}</p>
                </div>
              </div>

              {/* Payment Details Confirmation Box */}
              <div className="p-4 bg-book-muted/60 border border-book-border rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono uppercase tracking-wider text-book-charcoal font-bold">
                    Payment Method
                  </span>
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs text-book-burgundy font-semibold hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="text-xs text-book-stone-700 leading-relaxed font-mono flex items-center justify-between">
                  <span>Card: •••• •••• •••• {payment.cardNumber.replace(/\s+/g, '').slice(-4) || '4242'}</span>
                  <span>Exp: {payment.expiryDate}</span>
                </div>
              </div>

              {/* Security Shield */}
              <div className="p-3 bg-book-card border border-book-border rounded-lg text-xs text-book-stone-500 flex items-center gap-2">
                <Lock className="w-4 h-4 text-book-success flex-shrink-0" />
                <span>Simulated 256-bit SSL encrypted transaction</span>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-book-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setStep(2)}
                  disabled={isProcessing}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  variant="accent"
                  size="lg"
                  onClick={handlePlaceOrder}
                  isLoading={isProcessing}
                >
                  {isProcessing ? 'Processing Order…' : `Place Order • $${calculations.finalTotal.toFixed(2)}`}
                </Button>
              </div>
            </div>
          )}

        </div>

        {/* Order Summary Sidebar (5 cols) */}
        <div className="lg:col-span-5 bg-book-card border border-book-border rounded-2xl p-6 shadow-book-card space-y-5 sticky top-28">
          <h3 className="font-serif text-lg font-bold text-book-charcoal pb-3 border-b border-book-border">
            Order Review ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </h3>

          <div className="divide-y divide-book-border max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={`${item.book.id}-${item.selectedFormat}`} className="py-3 flex items-center gap-3 first:pt-0">
                <img
                  src={item.book.coverImage}
                  alt={item.book.title}
                  className="w-12 aspect-[3/4] object-cover rounded bg-book-muted flex-shrink-0"
                />
                <div className="flex-1 min-w-0 text-xs">
                  <h4 className="font-serif font-bold text-book-charcoal truncate">
                    {item.book.title}
                  </h4>
                  <p className="text-[11px] text-book-stone-500">Qty: {item.quantity} • {item.selectedFormat}</p>
                </div>
                <span className="font-mono font-bold text-xs text-book-charcoal">
                  ${(item.book.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-book-border space-y-2 text-xs text-book-stone-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono font-bold">${calculations.subtotal.toFixed(2)}</span>
            </div>
            {calculations.discountTotal > 0 && (
              <div className="flex justify-between text-book-success font-medium">
                <span>Book Savings</span>
                <span className="font-mono">-${calculations.discountTotal.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Estimated Sales Tax (8%)</span>
              <span className="font-mono">${calculations.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Standard Tracked Delivery</span>
              <span className="font-mono font-semibold">
                {calculations.shipping === 0 ? <span className="text-book-success font-bold">FREE</span> : `$${calculations.shipping.toFixed(2)}`}
              </span>
            </div>

            <div className="pt-3 border-t border-book-border flex justify-between text-base font-bold text-book-charcoal">
              <span>Final Total</span>
              <span className="font-serif text-xl text-book-burgundy font-bold">
                ${calculations.finalTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="p-3 bg-book-muted rounded-lg border border-book-border text-[11px] text-book-stone-700 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-book-success flex-shrink-0" />
            <span>Encrypted Capstone Test Checkout</span>
          </div>
        </div>

      </div>

    </div>
  );
};
