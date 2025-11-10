import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initX402 } from "./middleware/x402";

// Routes
import paymentRoutes from "./routes/payment";
import reputationRoutes from "./routes/reputation";
import agentRoutes from "./routes/agent";
import accessRoutes from "./routes/access";
import transactionsRoutes from "./routes/transactions";
import x402Routes from "./routes/x402";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

(async () => {
  try {
    await initX402();
    console.log("✅ x402 Initialized — Live Trust Layer Active");

    app.get("/", (_: Request, res: Response) => {
      res.json({ message: "Warden backend running 🚀" });
    });

    app.get("/api/health", (_: Request, res: Response) => {
      res.json({ ok: true, status: "Warden backend live ✅" });
    });

    // Mount API routes
    app.use("/api/payment", paymentRoutes);
    app.use("/api/x402", x402Routes);
    app.use("/api/reputation", reputationRoutes);
    app.use("/api/agent", agentRoutes);
    app.use("/api/access", accessRoutes);
    app.use("/api/transactions", transactionsRoutes);

    app.listen(PORT, () =>
      console.log(`⚡ Server live at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Failed to initialize x402", err);
  }
})();
