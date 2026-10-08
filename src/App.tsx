import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { BookDetailPage } from './pages/BookDetailPage';
import { SearchPage } from './pages/SearchPage';
import { WishlistPage } from './pages/WishlistPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { AboutPage } from './pages/AboutPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { OrderProvider } from './context/OrderContext';
import { ToastProvider } from './context/ToastContext';

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <OrderProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <div className="flex flex-col min-h-screen bg-cream text-primary selection:bg-accent selection:text-white">
                {/* Header Navigation Shell */}
                <Header />

                {/* Global Cart Drawer */}
                <CartDrawer />
                
                {/* Main Application Body */}
                <main id="main-content" className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/books" element={<CatalogPage />} />
                    <Route path="/books/:id" element={<BookDetailPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>

                {/* Global Footer */}
                <Footer />
              </div>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </OrderProvider>
    </ToastProvider>
  );
};

export default App;
