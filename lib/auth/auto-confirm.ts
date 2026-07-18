import { createAdminClient } from "@/lib/supabase/admin";

/** Marks a new Supabase user as email-confirmed (verification flow disabled). */
export async function autoConfirmSupabaseUser(
  supabaseId: string,
): Promise<{ ok: boolean }> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    return { ok: true };
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.updateUserById(supabaseId, {
      email_confirm: true,
    });
    return { ok: !error };
  } catch {
    return { ok: false };
  }
}
