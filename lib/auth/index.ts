import type { UserRole } from "@/generated/prisma/client";
import { syncPrismaUser } from "@/lib/auth/sync-user";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export type AppSession = {
  user: {
    id: string;
    email: string;
    name: string;
    username: string;
    role: UserRole;
  };
};

export async function auth(): Promise<AppSession | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return null;
    }

    let prismaUser = await prisma.user.findFirst({
      where: {
        OR: [{ supabaseId: user.id }, { email: user.email }],
      },
    });

    if (!prismaUser) {
      try {
        prismaUser = await syncPrismaUser(user);
      } catch {
        return null;
      }
    }

    return {
      user: {
        id: prismaUser.id,
        email: prismaUser.email,
        name: prismaUser.displayName,
        username: prismaUser.username,
        role: prismaUser.role,
      },
    };
  } catch {
    return null;
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
