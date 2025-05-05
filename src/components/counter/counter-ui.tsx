'use client'

import { Keypair, PublicKey } from '@solana/web3.js'
import { useMemo, useState } from 'react'
import { ExplorerLink } from '../cluster/cluster-ui'
// import { useCounterProgram, useCounterProgramAccount } from './counter-data-access'
import { ellipsify } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { useCrudProgram, useCrudProgramAccount } from './counter-data-access'
import { useWallet } from '@solana/wallet-adapter-react'

export function CounterCreate() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { createEntry } = useCrudProgram();
  const { publicKey } = useWallet();

  const handlesubmit = async () => {
    if (!title || !content) {
      alert("Please fill in all fields");
      return;
    }
    try {
      if (publicKey){ 
      await createEntry.mutateAsync({ title, content, owner: publicKey });
      setTitle("");
      setContent("");
      }
    } catch (error) {
      console.error("Error creating entry:", error);
    }
  }

  return (
    <div>
      <h2 className={'text-2xl'}>Create Crud</h2>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input input-bordered w-full"
        />
        <input
          type="text"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="input input-bordered w-full"
        />
        <Button onClick={handlesubmit} disabled={createEntry.isPending}>
          Create
        </Button>
      </div>
    </div>
  )
}

export function CounterList() {
  const  { getProgramAccount, accounts }  = useCrudProgram()

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
      </div>
    )
  }
  return (
    <div className={"space-y-6"}>
    {accounts.isLoading ? (
      <span className="loading loading-spinner loading-lg"></span>
    ) : accounts.data?.length ? (
      <div className="grid gap-4 md:grid-cols-2">
        {accounts.data?.map((account) => (
          <CounterCard
            key={account.publicKey.toString()}
            account={account.publicKey}
          />
        ))}
      </div>
    ) : (
      <div className="text-center">
        <h2 className={"text-2xl"}>No accounts</h2>
        No accounts found. Create one above to get started.
      </div>
    )}
  </div>
  )
}

function CounterCard({ account }: { account: PublicKey }) {
  const { accountQuery, updateEntry, deleteEntry } = useCrudProgramAccount({
    account,
  })

  const { publicKey } = useWallet();
  const [content, setContent] = useState("");
  const title = accountQuery.data?.title;

  const handleSubmit = () => {
    if (publicKey &&  title) {
      updateEntry.mutateAsync({ title, content });
    }
  };


  
  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div className="card card-bordered border-base-300 border-4 text-neutral-content">
      <div className="card-body items-center text-center">
        <div className="space-y-6">
          <h2
            className="card-title justify-center text-3xl cursor-pointer"
            onClick={() => accountQuery.refetch()}
          >
            {accountQuery.data?.title}
          </h2>
          <p>{accountQuery.data?.content}</p>
          <div className="card-actions justify-around">
            <textarea
              placeholder="Update content here"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="textarea textarea-bordered w-full max-w-xs"
            />
            <button
              className="btn btn-xs lg:btn-md btn-primary"
              onClick={handleSubmit}
              disabled={updateEntry.isPending}
            >
              Update Journal Entry {updateEntry.isPending && "..."}
            </button>
          </div>
          <div className="text-center space-y-4">
            <p>
              <ExplorerLink
                path={`account/${account}`}
                label={ellipsify(account.toString())}
              />
            </p>
            <button
              className="btn btn-xs btn-secondary btn-outline"
              onClick={() => {
                if (
                  !window.confirm(
                    "Are you sure you want to close this account?"
                  )
                ) {
                  return;
                }
                const title = accountQuery.data?.title;
                if (title) {
                  return deleteEntry.mutateAsync(title);
                }
              }}
              disabled={deleteEntry.isPending}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
