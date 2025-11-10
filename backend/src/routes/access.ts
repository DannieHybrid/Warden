import { Router } from "express";
import { ReputationService } from "../services/reputationService";

const router = Router();

// Wallet validation
router.get("/wallet/:pubkey", async (req, res) => {
  try {
    const pubKey = req.params.pubkey;
    res.json({ pubKey });
  } catch (err) {
    res.status(400).json({ error: "Invalid public key" });
  }
});

// Access gating
router.get("/:service/:address", async (req, res) => {
  try {
    const { service, address } = req.params;
    const rep = ReputationService.getReputation(address);
    const hasAccess = rep.score >= 20; // simple gating rule
    res.json({ service, address, access: hasAccess ? "granted" : "denied" });
  } catch (err) {
    res.status(500).json({ error: "Failed to check access" });
  }
});

export default router;
