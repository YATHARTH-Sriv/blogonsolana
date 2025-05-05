// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import crudIDL from '../target/idl/crud.json'
import type { Crud } from '../target/types/crud'

// Re-export the generated IDL and type
export { Crud, crudIDL }

// The programId is imported from the program IDL.
export const crud_PROGRAM_ID = new PublicKey(crudIDL.address)

// This is a helper function to get the crud Anchor program.
export function getcrudProgram(provider: AnchorProvider, address?: PublicKey): Program<Crud> {
  return new Program({ ...crudIDL, address: address ? address.toBase58() : crudIDL.address } as Crud, provider)
}

// This is a helper function to get the program ID for the crud program depending on the cluster.
export function getcrudProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the crud program on devnet and testnet.
      return new PublicKey('9kbP7YvPKV7zxSu3S8MA8yCMQaE3uRDnkbkPHqBG4VVs')
    case 'mainnet-beta':
    default:
      return crud_PROGRAM_ID
  }
}
