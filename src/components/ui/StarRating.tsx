import { Star, StarHalf } from 'lucide-react'

interface StarRatingProps {
  rating: number
  reviewCount?: number
  size?: 'sm' | 'md'
  showCount?: boolean
}

export function StarRating({ rating, reviewCount, size = 'sm', showCount = true }: StarRatingProps) {
  const starSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'
  const stars = []

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<Star key={i} className={`${starSize} star-filled`} aria-hidden="true" />)
    } else if (rating >= i - 0.5) {
      stars.push(<StarHalf key={i} className={`${starSize} star-filled`} aria-hidden="true" />)
    } else {
      stars.push(<Star key={i} className={`${starSize} star-empty`} aria-hidden="true" />)
    }
  }

  return (
    <span
      className="inline-flex items-center gap-1"
      aria-label={`Rated ${rating} out of 5${reviewCount !== undefined ? `, ${reviewCount.toLocaleString()} reviews` : ''}`}
    >
      <span className="flex gap-0.5">{stars}</span>
      {showCount && reviewCount !== undefined && (
        <span className="text-xs text-gray-500">({reviewCount.toLocaleString()})</span>
      )}
    </span>
  )
}
