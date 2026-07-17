export function getSupabaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (!raw) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  }

  // Auth client expects the project root, not the PostgREST /rest/v1 path.
  return raw.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

export function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");
  }

  return key;
}
