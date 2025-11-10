import { Keypair } from "@solana/web3.js";
const wallet = Keypair.generate();
console.log("pubkey:", wallet.publicKey.toBase58());
console.log("secret:", Array.from(wallet.secretKey));
