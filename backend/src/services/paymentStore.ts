import fs from "fs";
import path from "path";

const FILE = path.join(__dirname, "../../data/payments.json");

function safeReadJSON(file: string, fallback: any) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

if (!fs.existsSync(FILE)) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify([]));
}

export async function recordPayment(payment: any) {
  const data = safeReadJSON(FILE, []);
  data.push({ ...payment, timestamp: new Date().toISOString() });
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  console.log(`💾 Payment recorded: ${payment.signature}`);
}

export async function getTransactions(address: string) {
  const data = safeReadJSON(FILE, []);
  return data.filter((tx: any) => tx.recipient === address);
}
