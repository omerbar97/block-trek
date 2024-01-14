import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/providers'
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ['latin'], display: 'swap', adjustFontFallback: false })

export const metadata: Metadata = {
  title: 'Block Trek',
  description: 'A decentralized app for crowdfunding',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`inter.className bg-secondImg bg-cover`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
