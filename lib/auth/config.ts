export const AUTH_CALLBACK_PATH = "/auth/callback";

export function getAppUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "") ??
    "http://localhost:3000"
  );
}

export function getAuthCallbackUrl(origin?: string): string {
  const base = origin?.trim().replace(/\/$/, "") || getAppUrl();
  return `${base}${AUTH_CALLBACK_PATH}`;
}

/** Paste these into Supabase → Authentication → URL Configuration → Redirect URLs */
export function getSupabaseRedirectUrls(): string[] {
  const app = getAppUrl();
  const urls = new Set([
    getAuthCallbackUrl(app),
    "http://localhost:3000/auth/callback",
    "http://127.0.0.1:3000/auth/callback",
    "http://localhost:3001/auth/callback",
    "http://127.0.0.1:3001/auth/callback",
  ]);
  return [...urls];
}

/** Supabase built-in mail (Authentication → Emails → SMTP → Custom SMTP OFF) */
export const SUPABASE_BUILTIN_EMAIL = {
  docs: "https://supabase.com/docs/guides/auth/auth-smtp",
  templateDocs: "https://supabase.com/docs/guides/auth/auth-email-templates",
} as const;

export function getSignupEmailOptions(origin?: string) {
  return {
    // emailRedirectTo: getAuthCallbackUrl(origin), // email verification disabled
  };
}

/** Optional production upgrade — not required for dev */
export const SUPABASE_SMTP_RESEND = {
  host: "smtp.resend.com",
  port: 465,
  username: "resend",
  docs: "https://resend.com/docs/send-with-smtp",
} as const;
