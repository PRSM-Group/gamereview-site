import { createAdminClient } from "@/lib/supabase/admin";

type SeedAuthUser = {
  email: string;
  username: string;
  displayName: string;
  password: string;
};

async function findSupabaseUserIdByEmail(email: string) {
  const admin = createAdminClient();
  let page = 1;

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;

    const match = data.users.find(
      (user) => user.email?.trim().toLowerCase() === email,
    );
    if (match) return match.id;

    if (data.users.length < 200) return null;
    page += 1;
  }
}

export async function ensureSupabaseAuthUser(
  user: SeedAuthUser,
): Promise<string> {
  const admin = createAdminClient();
  const email = user.email.trim().toLowerCase();

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: user.password,
    email_confirm: true,
    user_metadata: {
      username: user.username,
      displayName: user.displayName,
    },
  });

  if (!error && data.user) {
    return data.user.id;
  }

  const message = error?.message.toLowerCase() ?? "";
  if (
    !includesAny(message, [
      "already been registered",
      "already registered",
      "already exists",
      "duplicate",
    ])
  ) {
    throw error ?? new Error("Could not create Supabase auth user.");
  }

  const existingId = await findSupabaseUserIdByEmail(email);
  if (!existingId) {
    throw error ?? new Error(`Supabase user exists for ${email} but could not be loaded.`);
  }

  const { error: updateError } = await admin.auth.admin.updateUserById(
    existingId,
    {
      password: user.password,
      email_confirm: true,
      user_metadata: {
        username: user.username,
        displayName: user.displayName,
      },
    },
  );

  if (updateError) throw updateError;
  return existingId;
}

function includesAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}
