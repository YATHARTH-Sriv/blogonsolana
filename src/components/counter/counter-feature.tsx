'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '../solana/solana-provider'
import { ExplorerLink } from '../cluster/cluster-ui'
import { useCrudProgram } from './counter-data-access'
import { CounterCreate, CounterList } from './counter-ui'
import { AppHero } from '../app-hero'
import { ellipsify } from '@/lib/utils'

export default function CounterFeature() {
  const { publicKey } = useWallet()
  const { programId } = useCrudProgram()

  return publicKey ? (
    <div>
      <AppHero
        title="Your Blogs"
        subtitle="Create, edit, and manage your on-chain blog posts. All content is stored directly on the Solana blockchain."
      >
        <p className="mb-6 text-sm text-muted-foreground">
          Program ID: <ExplorerLink path={`account/${programId}`} label={ellipsify(programId.toString())} />
        </p>
        <CounterCreate />
      </AppHero>
      <CounterList />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-16">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-3xl font-bold mb-6">Connect Your Wallet</h1>
            <p className="mb-6 text-muted-foreground">
              You need to connect your Solana wallet to create and manage your blog posts.
            </p>
            <WalletButton />
          </div>
        </div>
      </div>
    </div>
  )
}