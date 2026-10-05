# BookNest — Responsive eCommerce Bookstore
### IBM Applied AI Specialist Capstone Project

Discover your next great read with **BookNest**, an eCommerce bookstore front-end solution crafted with modern web architecture and agentic AI tools (**IBM Bob** / **AWS Kiro** / **GitHub Copilot**).

---

## 🌟 Features & Highlights

- 📚 **Comprehensive Catalog**: 32 curated titles across 13 genres with pricing, review metadata, ISBNs, format selectors, and stock statuses.
- 🔍 **Live Search & Multi-Faceted Filtering**: Dynamic search with category pills, price range sliders, format tags, and multiple sorting options (Price Low/High, Rating, Newest, Title).
- 🛒 **Robust Cart & Calculation Engine**:
  - Live subtotal, bulk discounts, 8% sales tax, and automated free shipping over $40.
  - Interactive free shipping visual tracker.
  - Real-time stock limit guards.
- 💖 **Wishlist & Save-For-Later**: One-click toggling with instant cart-to-wishlist migration.
- 💳 **3-Step Checkout Simulation**: Form validation (Shipping, Demo Card with auto-fill, Review & Confirmation).
- 📜 **Order Receipt & Print Confirmation**: Unique order ID generation, persistent history, and printable customer receipt.
- ♿ **WCAG 2.1 AA Accessibility**: High-contrast typography (`Playfair Display` + `Plus Jakarta Sans`), ARIA live regions for screen readers, accessible keyboard navigation, and visible focus rings.
- 📱 **Mobile-First Responsive Layout**: Drawer navigation, sticky mobile bottom bars, and touch-optimized controls.

---

## 🛠️ Technology Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS 3
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Testing**: Vitest & React Testing Library

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/booknest.git
cd booknest
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Run tests
```bash
npm test
```

### 5. Build for production
```bash
npm run build
```

---

## 🤖 Agentic AI Development Workflow

BookNest was developed leveraging agentic AI pair programming (**IBM Bob**). For full architecture breakdown and prompt engineering logs, refer to [`docs/AGENTIC_DEVELOPMENT.md`](docs/AGENTIC_DEVELOPMENT.md) and [`docs/FINAL_REVIEW.md`](docs/FINAL_REVIEW.md).
