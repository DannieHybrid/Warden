import {
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import { getConnection } from "../utils/solanaUtils";

const connection = getConnection();

export async function sendPayment(
  from: Keypair,
  to: PublicKey,
  amount: number
) {
  const tx = new Transaction();
  tx.add(
    SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to,
      lamports: amount * 1_000_000_000, // convert SOL to lamports
    })
  );

  const signature = await connection.sendTransaction(tx, [from]);
  await connection.confirmTransaction(signature, "confirmed");
  return signature;
}
