import { Router } from "express";
import { Keypair, PublicKey } from "@solana/web3.js";
import { sendX402Payment, verifyPayment } from "../middleware/x402";
import { recordPayment } from "../services/paymentStore";

const router = Router();

// Send payment
router.post("/send", async (req, res) => {
  try {
    const { fromSecret, toPubkey, amount, memo } = req.body;
    const from = Keypair.fromSecretKey(Uint8Array.from(fromSecret));
    const to = new PublicKey(toPubkey);
    const signature = await sendX402Payment({ from, to, amount, memo });

    await recordPayment({
      signature,
      recipient: toPubkey,
      amount,
      success: true,
    });
    res.json({ signature });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

// Verify payment
router.post("/verify", async (req, res) => {
  try {
    const { signature } = req.body;
    const valid = await verifyPayment(signature);
    res.json({ signature, verified: valid });
  } catch (err) {
    res.status(500).json({ error: "Verification failed" });
  }
});

// Sandbox/test payment (no real tokens)
router.post("/sandbox", async (req, res) => {
  const { toPubkey, amount } = req.body;
  const fakeSignature = `sandbox-${Date.now()}`;
  await recordPayment({
    signature: fakeSignature,
    recipient: toPubkey,
    amount,
    success: true,
  });
  res.json({ signature: fakeSignature, verified: true });
});

export default router;
