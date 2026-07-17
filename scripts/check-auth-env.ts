import "dotenv/config";
import {
  getAuthCallbackUrl,
  getAppUrl,
  getSupabaseRedirectUrls,
  SUPABASE_SMTP_RESEND,
} from "../lib/auth/config";
import { getSupabaseUrl } from "../lib/supabase/env";

const required = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "DATABASE_URL",
] as const;

let failed = false;

console.log("VOXEL auth setup check\n");

for (const key of required) {
  const value = process.env[key]?.trim();
  if (!value) {
    console.log(`✗ ${key} is missing`);
    failed = true;
    continue;
  }
  console.log(`✓ ${key}`);
}

try {
  const url = getSupabaseUrl();
  if (url.includes("/rest/v1")) {
    console.log("✗ NEXT_PUBLIC_SUPABASE_URL must be the project root (no /rest/v1)");
    failed = true;
  } else {
    console.log(`✓ Supabase URL: ${url}`);
  }
} catch (error) {
  console.log(`✗ ${error instanceof Error ? error.message : "Invalid Supabase URL"}`);
  failed = true;
}

console.log(`\nApp URL: ${getAppUrl()}`);
console.log(`Auth callback: ${getAuthCallbackUrl()}`);

console.log("\nAdd these Redirect URLs in Supabase → Authentication → URL Configuration:");
for (const url of getSupabaseRedirectUrls()) {
  console.log(`  • ${url}`);
}

console.log("\nCustom SMTP (Resend free tier) — Supabase Dashboard → Authentication → SMTP:");
console.log(`  Host: ${SUPABASE_SMTP_RESEND.host}`);
console.log(`  Port: ${SUPABASE_SMTP_RESEND.port}`);
console.log(`  Username: ${SUPABASE_SMTP_RESEND.username}`);
console.log(`  Password: <Resend API key from resend.com>`);
console.log(`  Sender (test): onboarding@resend.dev`);
console.log(
  "  ⚠ Test sender only delivers to your Resend account email.",
);
console.log(
  "    To send to any address, verify a domain at resend.com/domains",
);
console.log(
  "    and set Supabase SMTP sender to noreply@yourdomain.com",
);
console.log(`  Docs: ${SUPABASE_SMTP_RESEND.docs}`);

console.log(
  "\nIf Resend shows ZERO emails after signup/resend:",
);
console.log("  1. Supabase → Authentication → Emails → SMTP → Enable custom SMTP ON");
console.log("  2. Save host/user/password again (password field empty after save is normal)");
console.log("  3. Sender must use a domain verified in Resend (onboarding@resend.dev");
console.log("     often does NOT work for Supabase SMTP — verify a domain first)");
console.log("  4. Authentication → Providers → Email → Confirm email ON");
console.log("  5. Authentication → Logs → trigger resend → look for SMTP errors");
console.log("  6. npm run email:test — if that works, only Supabase SMTP is broken");

process.exit(failed ? 1 : 0);
