import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { seedGames, seedReviews } from "../lib/seed-data";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed the database");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.review.deleteMany();
  await prisma.game.deleteMany();

  for (const game of seedGames) {
    const { reviewCount: _reviewCount, ...gameData } = game;
    await prisma.game.create({ data: { ...gameData } });
  }

  for (const review of seedReviews) {
    await prisma.review.create({ data: { ...review } });
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
