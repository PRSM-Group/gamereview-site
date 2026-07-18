import { auth } from "@/lib/auth";

export async function requireAuth() {
  const session = await auth();

  if (!session) {
    throw new Error("You must be logged in.");
  }

  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();

  if (session.user.role !== "ADMIN") {
    throw new Error("You do not have permission to perform this action.");
  }

  return session;
}
