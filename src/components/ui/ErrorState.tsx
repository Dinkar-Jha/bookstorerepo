import React from 'react'
import { AlertCircle } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  description?: string
  action?: React.ReactNode
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We could not load the content. Please try again.',
  action,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4 text-red-300">
        <AlertCircle className="h-14 w-14" aria-hidden="true" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-primary">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-gray-500">{description}</p>
      {action}
    </div>
  )
}
