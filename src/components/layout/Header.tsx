import React, { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, Heart, Menu, BookOpen, X } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import { useWishlistStore } from '../../store/wishlistStore'

const navLinks = [
  { to: '/', label: 'Home', exact: true },
  { to: '/books', label: 'Books' },
  { to: '/books?category=Best+Sellers', label: 'Best Sellers' },
  { to: '/about', label: 'About' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const cartCount = useCartStore(s => s.totalItems())
  const wishlistCount = useWishlistStore(s => s.items.length)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus()
  }, [searchOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`)
      setSearchOpen(false)
      setSearchValue('')
    }
  }

  return (
    <>
      <header
        className={`sticky top-0 z-30 bg-white transition-shadow duration-200 ${
          scrolled ? 'shadow-nav' : 'border-b border-gray-100'
        }`}
      >
        <div className="container-page">
          {/* Main header row */}
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 flex-shrink-0 group"
              aria-label="BookNest — Home"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <BookOpen className="h-4.5 w-4.5" aria-hidden="true" />
              </div>
              <span className="font-display text-xl font-bold text-primary hidden xs:block">
                BookNest
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav aria-label="Primary navigation" className="hidden md:block">
              <ul className="flex items-center gap-1" role="list">
                {navLinks.map(link => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      end={link.exact}
                      className={({ isActive }) =>
                        `rounded-btn px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {/* Search toggle */}
              <button
                onClick={() => setSearchOpen(v => !v)}
                className="btn-ghost p-2"
                aria-label={searchOpen ? 'Close search' : 'Open search'}
                aria-expanded={searchOpen}
              >
                {searchOpen ? (
                  <X className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Search className="h-5 w-5" aria-hidden="true" />
                )}
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="btn-ghost relative p-2"
                aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ''}`}
              >
                <Heart className="h-5 w-5" aria-hidden="true" />
                {wishlistCount > 0 && (
                  <span
                    className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white"
                    aria-hidden="true"
                  >
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="btn-ghost relative p-2"
                aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}
              >
                <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                {cartCount > 0 && (
                  <span
                    className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white"
                    aria-hidden="true"
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile hamburger */}
              <button
                className="btn-ghost p-2 md:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Search bar (expands below header row) */}
          {searchOpen && (
            <div className="pb-3">
              <form onSubmit={handleSearch} role="search">
                <label htmlFor="header-search" className="sr-only">
                  Search books
                </label>
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                    aria-hidden="true"
                  />
                  <input
                    ref={searchRef}
                    id="header-search"
                    type="search"
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    placeholder="Search titles, authors, genres…"
                    className="input-field pl-9"
                  />
                </div>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}

function MobileNav({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    if (closeRef.current) closeRef.current.focus()
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <nav
        id="mobile-nav"
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
        className={`fixed left-0 top-0 z-50 h-full w-72 bg-white shadow-modal transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <Link
              to="/"
              className="flex items-center gap-2"
              onClick={onClose}
              aria-label="BookNest — Home"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-white">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
              </div>
              <span className="font-display text-lg font-bold text-primary">BookNest</span>
            </Link>
            <button
              ref={closeRef}
              onClick={onClose}
              className="rounded-btn p-1.5 text-gray-400 hover:bg-gray-100 hover:text-primary"
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Nav links */}
          <ul className="flex flex-col p-4 gap-1" role="list">
            {[
              { to: '/', label: 'Home', exact: true },
              { to: '/books', label: 'Browse Books' },
              { to: '/search', label: 'Search' },
              { to: '/wishlist', label: 'Wishlist' },
              { to: '/cart', label: 'Cart' },
              { to: '/about', label: 'About BookNest' },
            ].map(link => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.exact}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `block rounded-btn px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Categories */}
          <div className="border-t border-gray-100 px-4 pt-4">
            <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Categories
            </p>
            <ul className="flex flex-col gap-0.5" role="list">
              {['Fiction', 'Mystery', 'Fantasy', 'Science Fiction', 'Biography', 'Business', 'Technology'].map(
                genre => (
                  <li key={genre}>
                    <Link
                      to={`/books?genre=${encodeURIComponent(genre)}`}
                      onClick={onClose}
                      className="block rounded-btn px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors"
                    >
                      {genre}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}
