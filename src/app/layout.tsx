import React from 'react'
import '@/app/globals.css'
import { AppLayout } from '@/components/app-layout'
import { AppProviders } from '@/components/app-providers'

// Simplify the navigation to just home and blog management
const links = [
  { label: 'Home', path: '/' },
  { label: 'My Blogs', path: '/counter' }
]

export const metadata = {
  title: 'BlogOnSolana',
  description: 'Decentralized blogging platform on Solana',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>
          <AppLayout links={links}>{children}</AppLayout>
        </AppProviders>
      </body>
    </html>
  )
}
// Patch BigInt so we can log it using JSON.stringify without any errors
declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}
