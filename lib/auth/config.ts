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
  ]);
  return [...urls];
}

export const SUPABASE_SMTP_RESEND = {
  host: "smtp.resend.com",
  port: 465,
  username: "resend",
  docs: "https://resend.com/docs/send-with-smtp",
} as const;
