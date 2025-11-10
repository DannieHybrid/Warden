import { Keypair, Connection, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";

/** Creates a new wallet/keypair */
export function createWallet(): Keypair {
  return Keypair.generate();
}

/** Returns a devnet connection */
export function getConnection(): Connection {
  return new Connection(clusterApiUrl("devnet"), "confirmed");
}

/** Convert SOL to lamports */
export function solToLamports(sol: number): number {
  return sol * LAMPORTS_PER_SOL;
}
