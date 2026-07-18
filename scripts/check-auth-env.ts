import "dotenv/config";
import {
  getAuthCallbackUrl,
  getAppUrl,
  getSupabaseRedirectUrls,
} from "../lib/auth/config";
import { getSupabaseUrl } from "../lib/supabase/env";

const required = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "DATABASE_URL",
] as const;

const optional = ["SUPABASE_SERVICE_ROLE_KEY"] as const;

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

for (const key of optional) {
  const value = process.env[key]?.trim();
  if (!value) {
    console.log(
      `○ ${key} is missing (auto-confirm on signup + npm run auth:sync-seed)`,
    );
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

console.log("\nEmail verification is DISABLED in this app.");
console.log("  1. Supabase → Authentication → Providers → Email → Confirm email OFF");
console.log(
  "  2. Optional: set SUPABASE_SERVICE_ROLE_KEY so signup auto-confirms via Admin API",
);
console.log("  3. Custom SMTP not required for signup/login");

process.exit(failed ? 1 : 0);
