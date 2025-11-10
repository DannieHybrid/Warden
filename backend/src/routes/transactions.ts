import express from "express";
import { getTransactions } from "../services/paymentStore";

const router = express.Router();

router.get("/:address", async (req, res) => {
  const { address } = req.params;
  const txs = await getTransactions(address);
  res.json({ address, transactions: txs });
});

export default router;
