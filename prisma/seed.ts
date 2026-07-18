import "dotenv/config";
import bcrypt from "bcryptjs";
import {
  Genre,
  Platform,
  PrismaClient,
  Recommendation,
  ReviewStatus,
  UserRole,
} from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { normalizeDatabaseUrl } from "../lib/database-url";
import { seedGames, seedReviews } from "../lib/seed-data";
import { ensureSupabaseAuthUser } from "../lib/supabase/seed-auth";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed the database");
}

const adapter = new PrismaPg({
  connectionString: normalizeDatabaseUrl(connectionString),
});
const prisma = new PrismaClient({ adapter });

const GENRE_MAP: Record<string, Genre> = {
  action: Genre.ACTION,
  adventure: Genre.ADVENTURE,
  horror: Genre.HORROR,
  rpg: Genre.RPG,
  strategy: Genre.STRATEGY,
  simulation: Genre.SIMULATION,
  sports: Genre.SPORTS,
  puzzle: Genre.PUZZLE,
};

const STATUS_MAP: Record<string, ReviewStatus> = {
  Playing: ReviewStatus.PLAYING,
  Finished: ReviewStatus.FINISHED,
  Dropped: ReviewStatus.DROPPED,
};

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseReleaseDate(value?: string): Date {
  if (!value) return new Date("2025-01-01");
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date("2025-01-01") : parsed;
}

const PLATFORM_MAP: Record<string, Platform> = {
  pc: Platform.PC,
  playstation: Platform.PLAYSTATION,
  xbox: Platform.XBOX,
  nintendo: Platform.NINTENDO,
  mobile: Platform.MOBILE,
};

function mapPlatforms(platforms?: readonly string[]): Platform[] {
  if (!platforms?.length) return [Platform.PC];
  const mapped = platforms
    .map((platform) => PLATFORM_MAP[platform.toLowerCase()] ?? null)
    .filter((platform): platform is Platform => platform !== null);
  return mapped.length > 0 ? [...new Set(mapped)] : [Platform.PC];
}
function mapGenres(genres?: readonly string[]): Genre[] {
  if (!genres?.length) return [Genre.ACTION];
  const mapped = genres
    .map((genre) => GENRE_MAP[genre.toLowerCase()] ?? null)
    .filter((genre): genre is Genre => genre !== null);
  return mapped.length > 0 ? [...new Set(mapped)] : [Genre.ACTION];
}

async function main() {
  await prisma.verificationTaken.deleteMany();
  await prisma.review.deleteMany();
  await prisma.game.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  const seedPassword = "password123";
  const passwordHash = await bcrypt.hash(seedPassword, 12);
  const verifiedAt = new Date();
  const hasSupabaseServiceRole = Boolean(
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  );

  const users = [
    {
      id: "user_admin",
      email: "admin@critline.local",
      username: "admin",
      displayName: "Site Admin",
      role: UserRole.ADMIN,
    },
    {
      id: "danaln",
      email: "dana@critline.local",
      username: "danaln",
      displayName: "daylight",
      role: UserRole.USER,
    },
    {
      id: "pixelbruise",
      email: "pixel@critline.local",
      username: "pixelbruise",
      displayName: "Pixel Bruise",
      role: UserRole.USER,
    },
  ] as const;

  for (const user of users) {
    let supabaseId: string | undefined;

    if (hasSupabaseServiceRole) {
      supabaseId = await ensureSupabaseAuthUser({
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        password: seedPassword,
      });
    }

    await prisma.user.create({
      data: {
        ...user,
        supabaseId,
        passwordHash,
        emailVerified: verifiedAt,
      },
    });
  }

  const tagNames = new Set<string>();
  for (const game of seedGames) {
    for (const tag of game.tags) tagNames.add(tag);
  }

  const tagIdByName = new Map<string, string>();
  for (const name of tagNames) {
    const tag = await prisma.tag.create({ data: { name } });
    tagIdByName.set(name, tag.id);
  }

  for (const game of seedGames) {
    const tagConnect = game.tags
      .map((name) => tagIdByName.get(name))
      .filter((id): id is string => Boolean(id))
      .map((id) => ({ id }));

    await prisma.game.create({
      data: {
        id: game.id,
        title: game.title,
        slug: toSlug(game.title),
        description: game.description,
        developer: game.developer,
        releaseDate: parseReleaseDate(game.releaseDate),
        coverImage: game.coverImage,
        bannerImage: game.bannerImage,
        genres: mapGenres(game.genres),
        platforms: mapPlatforms(game.platforms),
        ...(tagConnect.length > 0
          ? { tags: { connect: tagConnect } }
          : {}),
      },
    });
  }

  const userIdByUsername: Record<string, string> = {
    danaln: "danaln",
    pixelbruise: "pixelbruise",
  };

  for (const review of seedReviews) {
    await prisma.review.create({
      data: {
        id: review.id,
        heading: review.title,
        content: review.content,
        rating: review.rating,
        status: STATUS_MAP[review.status] ?? ReviewStatus.PLAYING,
        recommendation: Recommendation.RECOMMENDED,
        containsSpoilers: false,
        userId: userIdByUsername[review.userName] ?? "danaln",
        gameId: review.gameId,
      },
    });
  }

  console.log("Seed complete.");
  if (hasSupabaseServiceRole) {
    console.log("Log in with admin@critline.local / password123 (admin)");
    console.log("Or danaln@critline.local / password123 (user)");
  } else {
    console.log(
      "Set SUPABASE_SERVICE_ROLE_KEY and run npm run auth:sync-seed before logging in.",
    );
  }
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
