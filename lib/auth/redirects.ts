import type { UserRole } from "@/generated/prisma/client";

export function isSafeRelativePath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//");
}

export function getPostLoginRedirect(
  callbackUrl: string,
  role: UserRole,
): string {
  const raw = callbackUrl.trim();
  if (isSafeRelativePath(raw)) {
    if (raw.startsWith("/admin") && role !== "ADMIN") {
      return "/";
    }
    return raw;
  }
  return role === "ADMIN" ? "/admin" : "/";
}
