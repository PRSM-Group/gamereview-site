import { prisma } from "@/lib/prisma";

import { Genre, Platform } from "@prisma/client";

const GAME_INCLUDE = {
  tags: true,
  reviews: {
    include: {
      user: {
        select: {
          id: true,
          username: true,
          displayName: true,
          profileImage: true,
        },
      },
    },
  },
} as const;

export interface CreateGameInput {
  title: string;
  description: string;
  developer: string;
  releaseDate: Date;
  coverImage: string;
  bannerImage: string;
  genres: Genre[];
  platforms: Platform[];
  tagIds: string[];
}

export async function getAllGames() {
  return prisma.game.findMany({
    orderBy: {
      // let postgre do the sorting before returning data
      createdAt: "desc",
    },
    include: {
      // to also include data from related tables (findmany is not enough)
      _count: {
        select: { reviews: true }, // count number of reviews
      },
    },
  });
}

export async function getGameById(id: string) {
  // for adming
  return prisma.game.findUnique({
    where: { id },
    include: GAME_INCLUDE,
  });
}

export async function getGameBySlug(slug: string) {
  // for regular user
  return prisma.game.findUnique({
    where: { slug },
    include: GAME_INCLUDE,
  });
}

function generateBaseSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/'/g, "") // remove apostrophes
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, ""); // remove hyphens from start and end
}

async function generateUniqueSlug(title: string): Promise<string> {
  const baseSlug = generateBaseSlug(title);
  let slug = baseSlug;
  let count = 2;
  while (true) {}
}
