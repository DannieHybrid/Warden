// src/services/reputationService.ts
import fs from "fs";
import path from "path";

interface ReputationRecord {
  address: string;
  score: number;
  tier: string;
  lastUpdated: string;
}

const DATA_PATH = path.join(__dirname, "../../data/reputation.json");

// Ensure file exists
if (!fs.existsSync(DATA_PATH)) {
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify({}, null, 2));
}

// Load reputations from file
function loadReputations(): Record<string, ReputationRecord> {
  const raw = fs.readFileSync(DATA_PATH, "utf8");
  return JSON.parse(raw);
}

// Save reputations to file
function saveReputations(data: Record<string, ReputationRecord>) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// Compute tier based on score
function getTier(score: number): string {
  if (score >= 90) return "Elite";
  if (score >= 70) return "Trusted";
  if (score >= 50) return "Verified";
  if (score >= 20) return "Newbie";
  return "Unverified";
}

export class ReputationService {
  static getReputation(address: string): ReputationRecord {
    const data = loadReputations();
    const record = data[address];

    if (!record) {
      const newRecord: ReputationRecord = {
        address,
        score: 10,
        tier: "Newbie",
        lastUpdated: new Date().toISOString(),
      };
      data[address] = newRecord;
      saveReputations(data);
      return newRecord;
    }

    return record;
  }

  static updateReputation(
    address: string,
    delta: number,
    reason: string = "manual update"
  ): ReputationRecord {
    const data = loadReputations();
    const record = data[address] || {
      address,
      score: 10,
      tier: "Newbie",
      lastUpdated: new Date().toISOString(),
    };

    record.score = Math.max(0, record.score + delta);
    record.tier = getTier(record.score);
    record.lastUpdated = new Date().toISOString();

    data[address] = record;
    saveReputations(data);

    console.log(
      `📈 Reputation updated for ${address}: ${record.score} (${reason})`
    );

    return record;
  }

  static getLeaderboard(limit: number = 10): ReputationRecord[] {
    const data = Object.values(loadReputations());
    return data.sort((a, b) => b.score - a.score).slice(0, limit);
  }
}
