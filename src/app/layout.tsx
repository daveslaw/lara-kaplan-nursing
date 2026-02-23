import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/layout/Sidebar'
import { QueryProvider } from '@/components/layout/QueryProvider'
import { Toaster } from '@/components/ui/sonner'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Lara Kaplan Nursing',
  description: 'Patient management for Lara Kaplan Private Nursing Care',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} antialiased`}>
        <QueryProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-0 md:ml-60 min-h-screen">
              <div className="max-w-6xl mx-auto px-6 py-6 pt-20 md:pt-6">
                {children}
              </div>
            </main>
          </div>
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  )
}
