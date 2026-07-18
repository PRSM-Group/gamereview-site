import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { User } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

function metadataString(
  metadata: SupabaseUser["user_metadata"],
  key: string,
): string | undefined {
  const value = metadata?.[key];
  return typeof value === "string" ? value.trim() : undefined;
}

function emailVerifiedAt(_supabaseUser: SupabaseUser): Date {
  // Email verification disabled — treat users as verified in Prisma.
  return new Date();
}

export async function syncPrismaUser(supabaseUser: SupabaseUser): Promise<User> {
  const supabaseId = supabaseUser.id;
  const email = supabaseUser.email?.trim().toLowerCase();

  if (!email) {
    throw new Error("Supabase user is missing an email address.");
  }

  const verifiedAt = emailVerifiedAt(supabaseUser);
  const username = metadataString(supabaseUser.user_metadata, "username");
  const displayName = metadataString(supabaseUser.user_metadata, "displayName");

  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ supabaseId }, { email }],
    },
  });

  if (existing) {
    return prisma.user.update({
      where: { id: existing.id },
      data: {
        supabaseId,
        email,
        emailVerified: verifiedAt,
      },
    });
  }

  if (!username || !displayName) {
    throw new Error("Supabase user metadata is missing profile fields.");
  }

  return prisma.user.create({
    data: {
      supabaseId,
      email,
      username,
      displayName,
      emailVerified: verifiedAt,
    },
  });
}
