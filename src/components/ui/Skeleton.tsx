interface SkeletonProps {
  className?: string
  lines?: number
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />
}

export function SkeletonText({ lines = 3 }: SkeletonProps) {
  return (
    <div className="space-y-2" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  )
}

export function BookCardSkeleton() {
  return (
    <div className="card p-0 overflow-hidden" aria-hidden="true">
      <Skeleton className="aspect-[2/3] w-full rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-5 w-1/4" />
      </div>
    </div>
  )
}
