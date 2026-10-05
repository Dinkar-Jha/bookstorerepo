import React from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { ToastContainer } from '../ui/Toast'

interface PageContainerProps {
  children: React.ReactNode
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <ToastContainer />
    </div>
  )
}
