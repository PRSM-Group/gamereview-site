/**
 * pg v8 treats sslmode=require as verify-full. v9 will change that behavior.
 * Prisma Console URLs use sslmode=require — normalize to silence the warning.
 */
export function normalizeDatabaseUrl(connectionString: string): string {
  try {
    const url = new URL(connectionString);
    const sslmode = url.searchParams.get("sslmode");

    if (
      sslmode === "require" ||
      sslmode === "prefer" ||
      sslmode === "verify-ca"
    ) {
      url.searchParams.set("sslmode", "verify-full");
    }

    return url.toString();
  } catch {
    return connectionString;
  }
}
