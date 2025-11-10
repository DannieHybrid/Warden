import {
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  Connection,
  LAMPORTS_PER_SOL,
  SystemProgram,
} from "@solana/web3.js";
import { createMemoInstruction } from "@solana/spl-memo"; // <-- correct import
import { createWallet, getConnection } from "../utils/solanaUtils";

let connection: Connection;

/** Initialize x402 connection */
export async function initX402() {
  if (!connection) connection = getConnection();
  console.log("✅ x402 initialized on devnet");
  return connection;
}

/** Express middleware to ensure connection */
export async function x402Middleware(req: any, res: any, next: any) {
  if (!connection) await initX402();
  next();
}

/** Sends a payment with optional memo */
export async function sendX402Payment({
  from,
  to,
  amount,
  memo,
}: {
  from: Keypair;
  to: PublicKey;
  amount: number;
  memo?: string;
}) {
  if (!connection) throw new Error("x402 not initialized");

  const tx = new Transaction();

  // Add transfer instruction
  tx.add(
    SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to,
      lamports: amount * LAMPORTS_PER_SOL,
    })
  );

  // Add memo instruction if provided
  if (memo) tx.add(createMemoInstruction(memo, [from.publicKey]));

  const signature = await sendAndConfirmTransaction(connection, tx, [from]);
  return signature;
}

/** Verify a payment signature on-chain (simplified mock for hackathon) */
export async function verifyPayment(signature: string) {
  if (!connection) await initX402();
  try {
    const tx = await connection.getTransaction(signature);
    return !!tx;
  } catch {
    return false;
  }
}

/** Helper to create a devnet wallet */
export function createDevnetWallet() {
  return createWallet();
}
