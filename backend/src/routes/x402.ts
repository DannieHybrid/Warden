import { Router } from "express";
import { x402Middleware } from "../middleware/x402";

const router = Router();

// For webhook / async notifications
router.post("/webhook", x402Middleware, async (req, res) => {
  console.log("🔔 x402 webhook received:", req.body);
  res.json({ ok: true });
});

export default router;
