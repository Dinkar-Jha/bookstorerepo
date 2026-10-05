import React from 'react'

type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'accent' | 'muted'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-primary/10 text-primary',
  success: 'bg-green-100 text-green-800',
  error: 'bg-red-100 text-red-800',
  warning: 'bg-amber-100 text-amber-800',
  accent: 'bg-accent/10 text-accent',
  muted: 'bg-gray-100 text-gray-600',
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span className={`badge ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}
