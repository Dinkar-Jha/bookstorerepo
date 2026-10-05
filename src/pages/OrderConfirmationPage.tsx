import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Package, Truck, ArrowRight, Printer, Home, ShoppingBag, BookOpen } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById, lastOrder } = useOrder();

  const order = (id ? getOrderById(id) : null) || lastOrder;

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          icon="cart"
          title="Order Not Found"
          description="We could not find the order details for this reference number. You can continue browsing books or return to homepage."
          actionLabel="Explore Books"
          onAction={() => navigate('/books')}
        />
      </div>
    );
  }

  const { shippingAddress, paymentDetails, items, calculations } = order;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Orders', path: '/cart' }, { label: `Order #${order.orderId}` }]} />

      {/* Success Celebration Card */}
      <div className="bg-book-card border border-book-border rounded-2xl p-6 sm:p-10 shadow-book-lg text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-50 text-book-success rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-mono uppercase tracking-wider text-book-success font-bold block">
          Order Dispatched for Fulfillment
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-book-charcoal">
          Your order is confirmed!
        </h1>

        <p className="text-sm text-book-stone-700 max-w-lg mx-auto leading-relaxed">
          Thank you for choosing BookNest, <strong>{shippingAddress.firstName}</strong>. A tracking confirmation email has been dispatched to <span className="font-mono text-book-charcoal font-semibold">{shippingAddress.email}</span>.
        </p>

        {/* Order Meta Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-mono">
          <span className="px-3 py-1.5 bg-book-muted border border-book-border rounded-md text-book-charcoal">
            Order Reference: <strong className="text-book-burgundy font-bold">{order.orderId}</strong>
          </span>
          <span className="px-3 py-1.5 bg-book-muted border border-book-border rounded-md text-book-charcoal">
            Placed On: {order.orderDate}
          </span>
          <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-book-success rounded-md font-semibold">
            Estimated Delivery: {order.deliveryEstimate}
          </span>
        </div>
      </div>

      {/* Order Details Breakdown Grid */}
      <div className="bg-book-card border border-book-border rounded-2xl p-6 sm:p-8 shadow-book-card space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-book-border">
          <h2 className="font-serif text-xl font-bold text-book-charcoal">
            Order Summary & Receipt
          </h2>
          <button
            type="button"
            onClick={() => window.print()}
            className="text-xs text-book-stone-700 hover:text-book-burgundy flex items-center gap-1.5 focus-ring rounded p-1"
            title="Print Receipt"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print Receipt</span>
          </button>
        </div>

        {/* Purchased Books List */}
        <div className="divide-y divide-book-border">
          {items.map((item) => (
            <div key={`${item.book.id}-${item.selectedFormat}`} className="py-4 flex items-center gap-4 first:pt-0">
              <img
                src={item.book.coverImage}
                alt={item.book.title}
                className="w-16 aspect-[3/4] object-cover rounded bg-book-muted flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-mono uppercase text-book-burgundy font-bold block">
                  {item.book.genre}
                </span>
                <Link to={`/books/${item.book.id}`}>
                  <h3 className="font-serif font-bold text-sm text-book-charcoal hover:text-book-burgundy transition-colors truncate">
                    {item.book.title}
                  </h3>
                </Link>
                <p className="text-xs text-book-stone-500">by {item.book.author}</p>
                <p className="text-[11px] font-mono text-book-stone-700 mt-0.5">
                  Format: {item.selectedFormat} • Qty: {item.quantity} × ${item.book.price.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-sm text-book-charcoal">
                  ${(item.book.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Shipping & Payment Two-Column Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-book-border">
          <div className="p-4 bg-book-muted/60 border border-book-border rounded-xl space-y-1.5 text-xs text-book-stone-700 font-mono">
            <span className="font-sans text-xs font-bold text-book-charcoal uppercase tracking-wider block font-mono">
              Shipping Destination
            </span>
            <p className="font-bold text-book-charcoal">{shippingAddress.firstName} {shippingAddress.lastName}</p>
            <p>{shippingAddress.address}</p>
            <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
            <p>{shippingAddress.country}</p>
            <p className="text-book-stone-500 pt-1">Phone: {shippingAddress.phone}</p>
          </div>

          <div className="p-4 bg-book-muted/60 border border-book-border rounded-xl space-y-1.5 text-xs text-book-stone-700 font-mono">
            <span className="font-sans text-xs font-bold text-book-charcoal uppercase tracking-wider block font-mono">
              Payment Method
            </span>
            <p className="font-bold text-book-charcoal">{paymentDetails.cardholderName}</p>
            <p>Card: {paymentDetails.maskedCardNumber}</p>
            <p>Expires: {paymentDetails.expiryDate}</p>
            <p className="text-book-success font-semibold pt-1">Status: Paid (Demo Simulation)</p>
          </div>
        </div>

        {/* Calculations Breakdown */}
        <div className="p-4 bg-book-muted/40 border border-book-border rounded-xl space-y-2 text-xs text-book-stone-700">
          <div className="flex justify-between">
            <span>Items Subtotal</span>
            <span className="font-mono">${calculations.subtotal.toFixed(2)}</span>
          </div>
          {calculations.discountTotal > 0 && (
            <div className="flex justify-between text-book-success font-semibold">
              <span>Total Book Savings</span>
              <span className="font-mono">-${calculations.discountTotal.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Estimated Sales Tax</span>
            <span className="font-mono">${calculations.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="font-mono">
              {calculations.shipping === 0 ? <span className="text-book-success font-bold">FREE</span> : `$${calculations.shipping.toFixed(2)}`}
            </span>
          </div>
          <div className="pt-2 border-t border-book-border flex justify-between text-base font-bold text-book-charcoal">
            <span>Total Paid</span>
            <span className="font-serif text-xl text-book-burgundy font-bold">${calculations.finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Actions Strip */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-book-border">
          <Link to="/">
            <Button variant="outline" size="md" leftIcon={<Home className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
          <Link to="/books">
            <Button variant="accent" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Continue Exploring Catalog
            </Button>
          </Link>
        </div>

      </div>

    </div>
  );
};
