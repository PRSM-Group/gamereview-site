import { prisma } from "@/lib/prisma";

import type { CreateGameInput, UpdateGameInput } from "@/lib/validations/game";

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
  // for admin
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

  while (true) {
    const existingGame = await prisma.game.findUnique({
      where: { slug },
    });

    if (!existingGame) {
      break;
    }

    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
}

export async function createGame(data: CreateGameInput) {
  const slug = await generateUniqueSlug(data.title);
  return prisma.game.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      developer: data.developer,
      releaseDate: data.releaseDate,
      coverImage: data.coverImage,
      bannerImage: data.bannerImage,

      //enums
      genres: data.genres,
      platforms: data.platforms,

      //many-to-many relationship w tags
      tags: {
        connect: data.tagIds.map((id) => ({ id })),
      },
    },
    include: GAME_INCLUDE,
  });
}

export async function updateGame(id: string, data: UpdateGameInput) {
  const existingGame = await getGameById(id);
  if (!existingGame) {
    throw new Error("Game not found");
  }
  let slug = existingGame.slug;
  if (existingGame.title !== data.title) {
    // regenerates slug if title has changed
    slug = await generateUniqueSlug(data.title);
  }
  return prisma.game.update({
    where: { id },
    data: {
      title: data.title,
      slug,
      description: data.description,
      developer: data.developer,
      releaseDate: data.releaseDate,
      coverImage: data.coverImage,
      bannerImage: data.bannerImage,
      genres: data.genres,
      platforms: data.platforms,
      tags: {
        set: [], // disconnect all current tags relationships
        connect: data.tagIds.map((id) => ({ id })), // connect new tags relationships
      },
    },
    include: GAME_INCLUDE,
  });
}
