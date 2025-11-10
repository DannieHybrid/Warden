import { ReputationService } from "./reputationService";
import { recordPayment } from "./paymentStore";

export async function performJob(agentId: string, userAddress: string) {
  console.log(`🤖 Agent ${agentId} performing task for ${userAddress}`);

  // In real scenario: agent executes an AI or automation job here.
  const success = true;
  const delta = success ? +5 : -3;

  const updated = ReputationService.updateReputation(
    userAddress,
    delta,
    "Agent task completed"
  );

  await recordPayment({
    signature: `sim-${Date.now()}`,
    recipient: userAddress,
    amount: 0,
    success: true,
    note: "Agent job simulated",
  });

  return {
    success: true,
    agentId,
    userAddress,
    reputation: updated,
    message: `Job executed successfully by agent ${agentId}`,
  };
}
