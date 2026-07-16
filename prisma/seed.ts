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
  await prisma.follow.deleteMany();
  await prisma.game.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 12);
  const verifiedAt = new Date();

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
    await prisma.user.create({
      data: {
        ...user,
        passwordHash,
        emailVerified: verifiedAt,
      },
    });
  }

  const tagNames = new Set<string>();
  for (const game of seedGames) {
    if ("tags" in game && game.tags) {
      for (const tag of game.tags) tagNames.add(tag);
    }
  }

  const tagIdByName = new Map<string, string>();
  for (const name of tagNames) {
    const tag = await prisma.tag.create({ data: { name } });
    tagIdByName.set(name, tag.id);
  }

  for (const game of seedGames) {
    const tagConnect =
      "tags" in game && game.tags
        ? game.tags
            .map((name) => tagIdByName.get(name))
            .filter((id): id is string => Boolean(id))
            .map((id) => ({ id }))
        : [];

    await prisma.game.create({
      data: {
        id: game.id,
        title: game.title,
        slug: toSlug(game.title),
        description:
          "description" in game
            ? game.description
            : `${game.title} — seeded placeholder description.`,
        developer: "developer" in game ? game.developer : "Unknown",
        releaseDate: parseReleaseDate(
          "releaseDate" in game ? game.releaseDate : undefined,
        ),
        coverImage: game.coverImage,
        bannerImage:
          "bannerImage" in game && game.bannerImage
            ? game.bannerImage
            : game.coverImage,
        genres: mapGenres("genres" in game ? game.genres : undefined),
        platforms: [Platform.PC],
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
  console.log("Log in with admin@critline.local / password123 (admin)");
  console.log("Or danaln@critline.local / password123 (user)");
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
