'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { ThemeSelect } from '@/components/theme-select'
import { ClusterUiSelect } from './cluster/cluster-ui'
import { WalletButton } from '@/components/solana/solana-provider'
import Image from 'next/image'

export function AppHeader({ links = [] }: { links: { label: string; path: string }[] }) {
  const pathname = usePathname()
  const [showMenu, setShowMenu] = useState(false)

  function isActive(path: string) {
    return path === '/' ? pathname === '/' : pathname.startsWith(path)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full">
              <Image
                src="/logo.png"
                alt="Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="hidden font-bold sm:inline-block">BlogOnSolana</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            {links.map(({ label, path }) => (
              <Link
                key={path}
                href={path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(path) 
                    ? 'text-foreground' 
                    : 'text-muted-foreground'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <WalletButton />
          <div className="h-6 w-px bg-border/60" />
          <ClusterUiSelect />
          <ThemeSelect />
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setShowMenu(!showMenu)}
        >
          {showMenu ? 
            <X className="h-5 w-5" /> : 
            <Menu className="h-5 w-5" />
          }
        </Button>

        {showMenu && (
          <div className="md:hidden fixed inset-x-0 top-16 bottom-0 z-50 bg-background/98 backdrop-blur-lg border-t border-border/40">
            <div className="container py-6">
              <nav className="grid gap-6 pb-6 mb-6 border-b border-border/40">
                {links.map(({ label, path }) => (
                  <Link
                    key={path}
                    href={path}
                    className={`text-base font-medium transition-colors hover:text-primary ${
                      isActive(path) 
                        ? 'text-foreground' 
                        : 'text-muted-foreground'
                    }`}
                    onClick={() => setShowMenu(false)}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
              
              <div className="grid gap-4">
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Connect Wallet
                  </p>
                  <WalletButton />
                </div>
                
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Network
                  </p>
                  <ClusterUiSelect />
                </div>
                
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Theme
                  </p>
                  <ThemeSelect />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}