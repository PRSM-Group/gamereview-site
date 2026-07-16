import type { Prisma } from "@/generated/prisma/client";
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

type GameWithDetails = Prisma.GameGetPayload<{
  include: typeof GAME_INCLUDE;
}>;

function calculateAverageRating(
  reviews: readonly { rating: Prisma.Decimal }[],
): number {
  if (reviews.length === 0) return 0;
  const total = reviews.reduce(
    (sum, review) => sum + review.rating.toNumber(),
    0,
  );
  return total / reviews.length;
}

function formatGameDetails(game: GameWithDetails) {
  return {
    ...game,
    reviewCount: game.reviews.length,
    averageRating: calculateAverageRating(game.reviews),
    reviews: game.reviews.map((review) => ({
      ...review,
      rating: review.rating.toNumber(),
    })),
  };
}

export async function getAllGames() {
  const games = await prisma.game.findMany({
    orderBy: {
      // let postgre do the sorting before returning data
      createdAt: "desc",
    },
    // to also include data from related tables (findmany is not enough)

    select: {
      id: true,
      title: true,
      slug: true,
      coverImage: true,
      bannerImage: true,
      genres: true,
      reviews: {
        select: {
          rating: true,
        },
      },
    },
  });
  return games.map(({ reviews, ...game }) => ({
    // Keep the selected game fields and add review statistics.
    ...game,
    reviewCount: reviews.length,
    averageRating: calculateAverageRating(reviews),
  }));
}

export async function getBrowseGames() {
  const games = await prisma.game.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      coverImage: true,
      bannerImage: true,
      genres: true,
      tags: { select: { name: true } },
      reviews: { select: { rating: true } },
    },
  });

  return games.map((game) => ({
    id: game.id,
    title: game.title,
    description: game.description,
    coverImage: game.coverImage,
    bannerImage: game.bannerImage,
    rating: calculateAverageRating(game.reviews),
    reviewCount: game.reviews.length,
    genre: game.genres[0] ?? "ACTION",
    tags: game.tags.map((tag) => tag.name),
  }));
}

export async function getAdminGames() {
  const games = await prisma.game.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      developer: true,
      releaseDate: true,
      coverImage: true,
      bannerImage: true,
      genres: true,
      platforms: true,
      tags: {
        select: { id: true },
      },
      reviews: {
        select: { rating: true },
      },
    },
  });

  return games.map(({ tags, reviews, releaseDate, ...game }) => ({
    ...game,
    releaseDate: releaseDate.toISOString().slice(0, 10),
    tagIds: tags.map((tag) => tag.id),
    reviewCount: reviews.length,
    averageRating: calculateAverageRating(reviews),
  }));
}

export async function getGameById(id: string) {
  // for admin
  const game = await prisma.game.findUnique({
    where: { id },
    include: GAME_INCLUDE,
  });
  return game ? formatGameDetails(game) : null;
}

export async function getGameBySlug(slug: string) {
  // for regular user
  const game = await prisma.game.findUnique({
    where: { slug },
    include: GAME_INCLUDE,
  });
  return game ? formatGameDetails(game) : null;
}

function generateBaseSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/'/g, "") // remove apostrophes
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, ""); // remove hyphens from start and end
}

async function generateUniqueSlug(
  title: string,
  excludedGameId?: string,
): Promise<string> {
  const baseSlug = generateBaseSlug(title);
  let slug = baseSlug;
  let count = 2;

  while (true) {
    const existingGame = await prisma.game.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existingGame || existingGame.id === excludedGameId) {
      return slug;
    }

    slug = `${baseSlug}-${count}`;
    count++;
  }
}

export async function createGame(data: CreateGameInput) {
  const slug = await generateUniqueSlug(data.title);
  const game = await prisma.game.create({
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
  return formatGameDetails(game);
}

export async function updateGame(id: string, data: UpdateGameInput) {
  const existingGame = await prisma.game.findUnique({
    // so only fields needed will be fetched
    where: { id },
    select: {
      title: true,
      slug: true,
    },
  });
  if (!existingGame) {
    throw new Error("Game not found"); // we will eventually replace this with something like NotFoundError("") once may error handling na
  }
  let slug = existingGame.slug;
  if (existingGame.title !== data.title) {
    // regenerates slug if title has changed
    slug = await generateUniqueSlug(data.title, id);
  }
  const game = await prisma.game.update({
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
        set: data.tagIds.map((tagId) => ({ id: tagId })), //replaces existing tags with new ones
      },
    },
    include: GAME_INCLUDE,
  });
  return formatGameDetails(game);
}

export async function deleteGame(id: string) {
  const existingGame = await prisma.game.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existingGame) {
    throw new Error("Game not found");
  }
  return prisma.game.delete({
    where: { id },
  });
}
