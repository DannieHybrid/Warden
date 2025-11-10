// src/routes/reputation.ts
import express, { Request, Response } from "express";
import { ReputationService } from "../services/reputationService";

const router = express.Router();

/**
 * @route GET /api/reputation/:address
 * Returns the current reputation of a wallet/agent
 */
router.get("/:address", (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const rep = ReputationService.getReputation(address);
    res.json(rep);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch reputation" });
  }
});

/**
 * @route POST /api/reputation/update
 * Updates reputation score (+/- delta)
 */
router.post("/update", (req: Request, res: Response) => {
  try {
    const { address, delta, reason } = req.body;
    if (!address || typeof delta !== "number") {
      return res.status(400).json({ error: "Missing address or delta" });
    }

    const rep = ReputationService.updateReputation(address, delta, reason);
    res.json(rep);
  } catch (e) {
    res.status(500).json({ error: "Failed to update reputation" });
  }
});

/**
 * @route GET /api/reputation/leaderboard
 * Returns top 10 ranked by score
 */
router.get("/leaderboard", (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const leaderboard = ReputationService.getLeaderboard(limit);
    res.json(leaderboard);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

export default router;
