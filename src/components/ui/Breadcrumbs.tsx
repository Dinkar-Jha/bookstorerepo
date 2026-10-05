import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  className?: string
}

function useAutoBreadcrumbs(): BreadcrumbItem[] {
  const { pathname } = useLocation()
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return []

  const items: BreadcrumbItem[] = []
  let path = ''
  for (const segment of segments) {
    path += `/${segment}`
    const label = segment
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
    items.push({ label, href: path })
  }
  // Last item has no href (current page)
  if (items.length > 0) {
    items[items.length - 1] = { label: items[items.length - 1].label }
  }
  return items
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const autoCrumbs = useAutoBreadcrumbs()
  const crumbs = items ?? autoCrumbs

  if (crumbs.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
        <li>
          <Link
            to="/"
            className="flex items-center hover:text-primary transition-colors"
            aria-label="Home"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
          </Link>
        </li>
        {crumbs.map((crumb, i) => (
          <li key={i} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
            {crumb.href ? (
              <Link
                to={crumb.href}
                className="hover:text-primary transition-colors"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="font-medium text-primary" aria-current="page">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
