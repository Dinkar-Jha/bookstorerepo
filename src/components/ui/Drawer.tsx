import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  side?: 'left' | 'right'
}

export function Drawer({ isOpen, onClose, title, children, side = 'right' }: DrawerProps) {
  const firstFocusRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    if (firstFocusRef.current) firstFocusRef.current.focus()
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      {/* Drawer panel */}
      <div
        className={`fixed top-0 ${side === 'right' ? 'right-0' : 'left-0'} z-50 h-full w-80 max-w-full
                    bg-white shadow-modal transition-transform duration-300
                    ${isOpen ? 'translate-x-0' : side === 'right' ? 'translate-x-full' : '-translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'drawer-title' : undefined}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            {title && (
              <h2 id="drawer-title" className="text-base font-semibold text-primary">
                {title}
              </h2>
            )}
            <button
              ref={firstFocusRef}
              onClick={onClose}
              className="ml-auto rounded-btn p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
              aria-label="Close"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5">{children}</div>
        </div>
      </div>
    </>
  )
}
