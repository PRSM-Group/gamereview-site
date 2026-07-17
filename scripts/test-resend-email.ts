import "dotenv/config";
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY?.trim();
const to = process.env.TEST_EMAIL?.trim() || process.argv[2]?.trim();
const from =
  process.env.EMAIL_FROM?.trim() ?? "VOXEL <onboarding@resend.dev>";

if (!apiKey) {
  console.error("Missing RESEND_API_KEY in .env");
  console.error("Create one at https://resend.com/api-keys");
  process.exit(1);
}

if (!to) {
  console.error("Usage: TEST_EMAIL=you@example.com npm run email:test");
  process.exit(1);
}

const resend = new Resend(apiKey);

const { data, error } = await resend.emails.send({
  from,
  to,
  subject: "VOXEL — Resend delivery test",
  html: "<p>If you receive this, Resend delivery to your inbox works.</p>",
  text: "If you receive this, Resend delivery to your inbox works.",
});

if (error) {
  console.error("Resend API error:", error.message);
  process.exit(1);
}

console.log("Sent via Resend API.");
console.log(`  Email ID: ${data?.id ?? "unknown"}`);
console.log(`  To: ${to}`);
console.log(`  From: ${from}`);
console.log("\nOpen https://resend.com/emails and check Status for this ID.");
console.log("  delivered = reached your provider (check Gmail Updates/Promotions)");
console.log("  bounced   = recipient rejected (often wrong test sender rules)");
