import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Star, Truck, RotateCcw, Award } from 'lucide-react'
import { BookCard } from '../components/BookCard'
import { getFeaturedBooks, getBestSellers, getNewArrivals } from '../data/books'

const featuredBooks = getFeaturedBooks().slice(0, 8)
const bestSellers = getBestSellers().slice(0, 4)
const newArrivals = getNewArrivals().slice(0, 4)

const categories = [
  { label: 'Fiction', emoji: '📖', to: '/books?genre=Fiction' },
  { label: 'Mystery', emoji: '🔍', to: '/books?genre=Mystery' },
  { label: 'Fantasy', emoji: '🧙', to: '/books?genre=Fantasy' },
  { label: 'Science Fiction', emoji: '🚀', to: '/books?genre=Science+Fiction' },
  { label: 'Business', emoji: '💼', to: '/books?genre=Business' },
  { label: 'Technology', emoji: '💻', to: '/books?genre=Technology' },
  { label: 'Biography', emoji: '✍️', to: '/books?genre=Biography' },
  { label: 'Self Development', emoji: '🌱', to: '/books?genre=Self+Development' },
]

export function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-primary"
        aria-labelledby="hero-heading"
      >
        <div className="container-page py-16 sm:py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge bg-accent/20 text-accent-200 mb-4 text-xs tracking-wide uppercase">
                New Arrivals Just In
              </span>
              <h1
                id="hero-heading"
                className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance mb-6"
              >
                Discover your next great read.
              </h1>
              <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-lg">
                Thousands of handpicked titles across every genre. From beloved classics to the
                latest bestsellers — your perfect book is waiting.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/books"
                  className="btn-accent px-6 py-3 text-base"
                >
                  Explore Books
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/books?sort=best-selling"
                  className="inline-flex items-center gap-2 rounded-btn border border-white/30 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
                >
                  View Best Sellers
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-10 flex flex-wrap gap-6 text-white">
                {[
                  { value: '36+', label: 'Curated Books' },
                  { value: '12', label: 'Genres' },
                  { value: '4.6', label: 'Avg. Rating', icon: <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" /> },
                ].map(stat => (
                  <div key={stat.label} className="flex flex-col">
                    <span className="flex items-center gap-1 text-2xl font-bold">
                      {stat.value}
                      {stat.icon}
                    </span>
                    <span className="text-xs text-white/60">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero book stack illustration */}
            <div
              className="hidden lg:flex items-center justify-center"
              aria-hidden="true"
            >
              <div className="relative w-80 h-80">
                {getFeaturedBooks().slice(0, 3).map((book, i) => (
                  <div
                    key={book.id}
                    className="absolute rounded-xl overflow-hidden shadow-2xl border border-white/10"
                    style={{
                      width: '160px',
                      height: '240px',
                      top: `${i * 24}px`,
                      left: `${i * 32}px`,
                      transform: `rotate(${(i - 1) * 6}deg)`,
                      zIndex: 3 - i,
                    }}
                  >
                    <img
                      src={book.coverImage}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-cream" style={{ clipPath: 'ellipse(55% 100% at 50% 100%)' }} aria-hidden="true" />
      </section>

      {/* ── Value Props ──────────────────────────────────────────────────── */}
      <section className="bg-cream border-b border-gray-100" aria-label="Service highlights">
        <div className="container-page py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { Icon: Truck, title: 'Free Shipping', desc: 'On orders over $40' },
              { Icon: RotateCcw, title: '30-Day Returns', desc: 'Read with confidence' },
              { Icon: Award, title: 'Curated Selection', desc: 'Expert recommendations' },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 rounded-card bg-white px-5 py-4 shadow-sm">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-primary text-sm">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Books ────────────────────────────────────────────────── */}
      <section className="bg-cream py-14 lg:py-20" aria-labelledby="featured-heading">
        <div className="container-page">
          <SectionHeader
            id="featured-heading"
            title="Featured Books"
            subtitle="Handpicked by our editorial team"
            linkTo="/books"
            linkLabel="View all books"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 lg:gap-6">
            {featuredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Categories ────────────────────────────────────────────── */}
      <section className="bg-white py-14 lg:py-20" aria-labelledby="categories-heading">
        <div className="container-page">
          <SectionHeader
            id="categories-heading"
            title="Popular Categories"
            subtitle="Find your genre"
            linkTo="/books"
            linkLabel="Browse all genres"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map(cat => (
              <Link
                key={cat.label}
                to={cat.to}
                className="flex flex-col items-center gap-2 rounded-card bg-cream p-4 text-center transition-all duration-200 hover:bg-primary hover:text-white hover:shadow-card-hover group"
              >
                <span className="text-2xl" aria-hidden="true">{cat.emoji}</span>
                <span className="text-xs font-medium text-primary group-hover:text-white leading-snug">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Best Sellers ──────────────────────────────────────────────────── */}
      <section className="bg-cream py-14 lg:py-20" aria-labelledby="bestsellers-heading">
        <div className="container-page">
          <SectionHeader
            id="bestsellers-heading"
            title="Best Sellers"
            subtitle="The books everyone's reading right now"
            linkTo="/books?sort=best-selling"
            linkLabel="See all best sellers"
          />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {bestSellers.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Promo Banner ──────────────────────────────────────────────────── */}
      <section
        className="bg-accent py-10 lg:py-12"
        aria-label="Promotional offer"
      >
        <div className="container-page text-center text-white">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-2">
            Limited Time
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">
            Free shipping on orders over $40
          </h2>
          <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">
            Use code <strong className="text-white">NESTREADS</strong> at checkout.
            Valid on qualifying book orders only.
          </p>
          <Link
            to="/books"
            className="inline-flex items-center gap-2 rounded-btn bg-white px-6 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-cream"
          >
            Shop Now
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ── New Arrivals ──────────────────────────────────────────────────── */}
      <section className="bg-white py-14 lg:py-20" aria-labelledby="new-arrivals-heading">
        <div className="container-page">
          <SectionHeader
            id="new-arrivals-heading"
            title="New Arrivals"
            subtitle="Fresh off the press"
            linkTo="/books?sort=newest"
            linkLabel="See all new arrivals"
          />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {newArrivals.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────────────────────── */}
      <section
        className="bg-primary/5 border-t border-b border-primary/10 py-14 lg:py-16"
        aria-labelledby="newsletter-heading"
      >
        <div className="container-page max-w-2xl text-center">
          <div className="flex h-12 w-12 mx-auto mb-4 items-center justify-center rounded-full bg-primary/10 text-primary">
            <BookOpen className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 id="newsletter-heading" className="font-display text-2xl sm:text-3xl font-bold text-primary mb-3">
            Stay in the story
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Get weekly recommendations, author spotlights, and exclusive deals delivered straight to
            your inbox. No spam, unsubscribe anytime.
          </p>
          <form
            onSubmit={e => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            aria-label="Newsletter signup"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="your@email.com"
              autoComplete="email"
              className="input-field flex-1"
            />
            <button
              type="submit"
              className="btn-primary flex-shrink-0 px-6"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-3 text-xs text-gray-400">
            Join 12,000+ book lovers. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </>
  )
}

// ── Reusable section header ───────────────────────────────────────────────────

interface SectionHeaderProps {
  id: string
  title: string
  subtitle?: string
  linkTo?: string
  linkLabel?: string
}

function SectionHeader({ id, title, subtitle, linkTo, linkLabel }: SectionHeaderProps) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <h2 id={id} className="font-display text-2xl sm:text-3xl font-bold text-primary">
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {linkTo && linkLabel && (
        <Link
          to={linkTo}
          className="flex-shrink-0 text-sm font-medium text-accent hover:text-accent-600 transition-colors flex items-center gap-1"
        >
          {linkLabel}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}
