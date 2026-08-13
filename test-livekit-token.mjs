import "dotenv/config";
import { TokenVerifier } from "livekit-server-sdk";

const token = process.argv[2];

if (!token) {
  console.error("Token tidak diberikan.");
  console.error("Usage: node test-livekit-token.mjs <token>");
  process.exit(1);
}

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("LIVEKIT_API_KEY atau LIVEKIT_API_SECRET tidak ditemukan.");
  process.exit(1);
}

try {
  const verifier = new TokenVerifier(apiKey, apiSecret);

  const grants = await verifier.verify(token);

  console.log("TOKEN VALID ✅");
  console.log("Grants:");
  console.log(JSON.stringify(grants, null, 2));
} catch (error) {
  console.error("TOKEN TIDAK VALID ❌");
  console.error(error);
  process.exit(1);
}
