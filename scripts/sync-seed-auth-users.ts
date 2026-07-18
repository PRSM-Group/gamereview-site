import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { normalizeDatabaseUrl } from "../lib/database-url";
import { ensureSupabaseAuthUser } from "../lib/supabase/seed-auth";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY is required (Supabase → Project Settings → API → service_role).",
  );
}

const adapter = new PrismaPg({
  connectionString: normalizeDatabaseUrl(connectionString),
});
const prisma = new PrismaClient({ adapter });

const SEED_PASSWORD = "password123";

async function main() {
  const users = await prisma.user.findMany({
    where: {
      supabaseId: null,
      passwordHash: { not: null },
    },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
    },
  });

  if (users.length === 0) {
    console.log("No Prisma users need Supabase auth sync.");
    return;
  }

  for (const user of users) {
    const supabaseId = await ensureSupabaseAuthUser({
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      password: SEED_PASSWORD,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { supabaseId },
    });

    console.log(`Synced ${user.email}`);
  }

  console.log(`Done. ${users.length} user(s) can log in with password123.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
