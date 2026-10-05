import React from 'react'
import { Search } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export function EmptyState({
  title = 'Nothing here yet',
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4 text-gray-300">
        {icon ?? <Search className="h-14 w-14" aria-hidden="true" />}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-primary">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm text-gray-500">{description}</p>
      )}
      {action}
    </div>
  )
}
