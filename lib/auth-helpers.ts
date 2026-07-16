import { auth } from "@/lib/auth";

export async function requireAdmin() {
  const session = await auth();

  if (!session) {
    throw new Error("You must be logged in.");
  }

  if (session.user.role !== "ADMIN") {
    throw new Error("You do not have permission to perform this action.");
  }

  return session;
}
