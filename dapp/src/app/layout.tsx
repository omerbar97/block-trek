import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from "@/components/ui/sonner"
import Providers from '@/components/auth/providers'
import Geometry from '@/components/homepage/geometry'


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
          {/* <ThirdwebProvider desiredChainId={ChainId.Localhost}> */}
          {children}
          <Toaster />
          {/* </ThirdwebProvider> */}
        </Providers>
      </body>
    </html>
  )
}
