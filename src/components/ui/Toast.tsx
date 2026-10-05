import React, { useEffect, useState, useCallback } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastState {
  toasts: Toast[]
  addToast: (message: string, type?: ToastType) => void
  removeToast: (id: string) => void
}

// Simple module-level store (no context overhead for toasts)
let _setState: React.Dispatch<React.SetStateAction<Toast[]>> | null = null

export function addToast(message: string, type: ToastType = 'success') {
  const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
  _setState?.(prev => [...prev, { id, message, type }])
  setTimeout(() => {
    _setState?.(prev => prev.filter(t => t.id !== id))
  }, 4000)
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-green-600" aria-hidden="true" />,
  error: <AlertCircle className="h-5 w-5 text-red-600" aria-hidden="true" />,
  info: <Info className="h-5 w-5 text-blue-600" aria-hidden="true" />,
}

const bgClasses: Record<ToastType, string> = {
  success: 'border-green-200 bg-green-50',
  error: 'border-red-200 bg-red-50',
  info: 'border-blue-200 bg-blue-50',
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className={`flex items-start gap-3 rounded-card border px-4 py-3 shadow-card ${bgClasses[toast.type]}`}
    >
      {icons[toast.type]}
      <p className="flex-1 text-sm text-primary">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-2 text-gray-400 hover:text-gray-600"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])
  _setState = setToasts

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]"
      aria-label="Notifications"
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={remove} />
      ))}
    </div>
  )
}

export function useToast(): ToastState {
  const [toasts, setToasts] = useState<Toast[]>([])
  _setState = setToasts

  const add = useCallback((message: string, type: ToastType = 'success') => {
    const id = `toast-${Date.now()}`
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }, [])

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return { toasts, addToast: add, removeToast: remove }
}
