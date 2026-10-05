import { Link } from 'react-router-dom'
import { BookOpen, Mail, Twitter, Facebook, Instagram } from 'lucide-react'

const footerLinks = {
  shop: [
    { label: 'All Books', to: '/books' },
    { label: 'Best Sellers', to: '/books?sort=best-selling' },
    { label: 'New Arrivals', to: '/books?sort=newest' },
    { label: 'Award Winners', to: '/books?category=Award+Winners' },
    { label: 'Staff Picks', to: '/books?category=Staff+Picks' },
  ],
  genres: [
    { label: 'Fiction', to: '/books?genre=Fiction' },
    { label: 'Mystery', to: '/books?genre=Mystery' },
    { label: 'Fantasy', to: '/books?genre=Fantasy' },
    { label: 'Science Fiction', to: '/books?genre=Science+Fiction' },
    { label: 'Biography', to: '/books?genre=Biography' },
    { label: 'Business', to: '/books?genre=Business' },
    { label: 'Technology', to: '/books?genre=Technology' },
  ],
  company: [
    { label: 'About BookNest', to: '/about' },
    { label: 'Accessibility', to: '/about#accessibility' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-primary text-white" aria-label="Site footer">
      {/* Main footer */}
      <div className="container-page py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="inline-flex items-center gap-2 mb-4"
              aria-label="BookNest — Home"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                <BookOpen className="h-4 w-4 text-white" aria-hidden="true" />
              </div>
              <span className="font-display text-xl font-bold">BookNest</span>
            </Link>
            <p className="text-sm text-white/70 leading-relaxed mb-5 max-w-xs">
              Discover your next great read. Curated books for every reader, delivered with care.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {[
                { Icon: Twitter, label: 'BookNest on Twitter' },
                { Icon: Facebook, label: 'BookNest on Facebook' },
                { Icon: Instagram, label: 'BookNest on Instagram' },
              ].map(({ Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>

          {/* Shop */}
          <nav aria-label="Shop links">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/50">
              Shop
            </h3>
            <ul className="space-y-2" role="list">
              {footerLinks.shop.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Genres */}
          <nav aria-label="Genre links">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/50">
              Genres
            </h3>
            <ul className="space-y-2" role="list">
              {footerLinks.genres.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company + Newsletter */}
          <div>
            <nav aria-label="Company links" className="mb-8">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/50">
                Company
              </h3>
              <ul className="space-y-2" role="list">
                {footerLinks.company.map(link => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Newsletter */}
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/50">
                Newsletter
              </h3>
              <p className="mb-3 text-xs text-white/60">
                New arrivals and curated picks, weekly.
              </p>
              <form
                onSubmit={e => e.preventDefault()}
                aria-label="Newsletter signup"
                className="flex gap-2"
              >
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 min-w-0 rounded-btn bg-white/10 border border-white/20 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/50"
                  autoComplete="email"
                />
                <button
                  type="submit"
                  className="flex-shrink-0 rounded-btn bg-accent px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-600 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                  aria-label="Subscribe to newsletter"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} BookNest. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-white/50">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Cookie Preferences</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
