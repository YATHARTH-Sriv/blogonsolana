'use client'

// import { getCrudProgram, getcrudProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../use-transaction-toast'
import { toast } from 'sonner'
import { getcrudProgram, getcrudProgramId } from '@project/anchor'

interface CreateEntryArgs {
  title: string;
  content: string;
  owner: PublicKey;
}

export function useCrudProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getcrudProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getcrudProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['crud', 'all', { cluster }],
    queryFn: () => program.account.createJournal.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const createEntry = useMutation<string, Error, CreateEntryArgs>({
    mutationKey: ["journalEntry", "create", { cluster }],
    mutationFn: async ({ title, content, owner }) => {
      const publickeyofowner=new PublicKey(owner)
      // const [journalEntryAddress] = await PublicKey.findProgramAddress(
      //   [Buffer.from(title), publickeyofowner.toBuffer()],
      //   programId
      // );

      // return program.methods.createJournal(title, content, journalEntryAddress).rpc();
      return program.methods.createJournal(title, content,publickeyofowner).rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      accounts.refetch();
    },
    onError: (error) => {
      toast.error(`Failed to create journal entry: ${error.message}`);
    },
  });


  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    createEntry,
  }
}

export function useCrudProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useCrudProgram()

  const accountQuery = useQuery({
    queryKey: ['crud', 'fetch', { cluster, account }],
    queryFn: () => program.account.createJournal.fetch(account),
  })

  const updateEntry = useMutation({
    mutationKey: ['crud', 'update', { cluster, account }],
    mutationFn: async ({ title, content }: { title: string; content: string }) => {
      return program.methods.updateJournal(title, content).rpc();
      // const tx = await program.methods
      //   .updateJournal(title, content)
      //   .accounts({
      //     signer: account,
      //   })
      //   .rpc()
      // transactionToast(tx)
      // accounts.refetch()
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      accounts.refetch();
    },
    onError: (error) => {
      toast.error(`Failed to update journal entry: ${error.message}`);
    },
  })

  const deleteEntry = useMutation({
    mutationKey: ['crud', 'delete', { cluster, account }],
    mutationFn: (title:string) => {
      return program.methods.deleteJournal(title).rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      accounts.refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete journal entry: ${error.message}`);
    },
  })


  return {
    accountQuery,
    updateEntry,
    deleteEntry
  }
}
