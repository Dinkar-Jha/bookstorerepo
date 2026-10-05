import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, ShieldCheck, Users, Sparkles, Compass } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'About BookNest' }]} />

      {/* Hero Banner */}
      <div className="bg-book-card border border-book-border rounded-2xl p-8 sm:p-12 shadow-book-card text-center space-y-4">
        <span className="text-xs font-mono uppercase tracking-wider text-book-burgundy font-bold">
          Our Story & Philosophy
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-book-charcoal">
          Connecting Readers with Inspiring Literature
        </h1>
        <p className="text-sm sm:text-base text-book-stone-700 max-w-2xl mx-auto leading-relaxed">
          BookNest was conceived as a digital sanctuary for readers who appreciate thoughtful editorial curation, timeless typography, and seamless modern browsing.
        </p>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-book-card border border-book-border rounded-xl p-6 shadow-book-card space-y-3">
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-book-burgundy flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-book-charcoal">Handpicked Curation</h3>
          <p className="text-xs text-book-stone-500 leading-relaxed">
            Every title in our 13 core genres is rigorously chosen for storytelling mastery, technical rigor, or philosophical depth.
          </p>
        </div>

        <div className="bg-book-card border border-book-border rounded-xl p-6 shadow-book-card space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-book-amber flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-book-charcoal">Craftsmanship & Design</h3>
          <p className="text-xs text-book-stone-500 leading-relaxed">
            We reject sterilized, cluttered layouts in favor of warm, inviting typography and high-contrast color palettes.
          </p>
        </div>

        <div className="bg-book-card border border-book-border rounded-xl p-6 shadow-book-card space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-book-success flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-book-charcoal">Universal Accessibility</h3>
          <p className="text-xs text-book-stone-500 leading-relaxed">
            Engineered to conform with WCAG 2.2 AA guidelines, ensuring assistive screen readers and keyboard users enjoy equal access.
          </p>
        </div>
      </div>

      {/* Accessibility Statement Anchor */}
      <section id="accessibility" className="bg-book-muted rounded-2xl p-8 border border-book-border space-y-3">
        <h2 className="font-serif text-xl font-bold text-book-charcoal">
          Accessibility Commitment
        </h2>
        <p className="text-xs sm:text-sm text-book-stone-700 leading-relaxed">
          BookNest is dedicated to providing an inclusive digital storefront. We rigorously test semantic landmark structures, focus-trapping overlays in drawers/modals, visible high-contrast focus rings, and proper keyboard navigation across all modern mobile and desktop browsers.
        </p>
      </section>

      {/* CTA Strip */}
      <div className="text-center pt-4">
        <Link to="/books">
          <Button variant="accent" size="lg">
            Explore the BookNest Catalog
          </Button>
        </Link>
      </div>

    </div>
  );
};
