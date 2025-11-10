import express from "express";
import { performJob } from "../services/agentService";

const router = express.Router();
const agents: Record<string, any> = {};

// Register agent
router.post("/register", (req, res) => {
  const { id, name, wallet, role } = req.body;
  if (!id || !name || !wallet)
    return res.status(400).json({ error: "id, name, wallet required" });

  agents[id] = { id, name, wallet, role, createdAt: new Date().toISOString() };
  res.status(201).json(agents[id]);
});

// Perform task
router.post("/perform", async (req, res) => {
  const { agentId, userAddress } = req.body;
  if (!agentId || !userAddress)
    return res.status(400).json({ error: "Missing agentId or userAddress" });

  const result = await performJob(agentId, userAddress);
  res.json(result);
});

// Get all agents (Marketplace)
router.get("/", (_, res) => res.json(Object.values(agents)));

// Get agent by ID
router.get("/:id", (req, res) => {
  const agent = agents[req.params.id];
  if (!agent) return res.status(404).json({ error: "Agent not found" });
  res.json(agent);
});

export default router;
