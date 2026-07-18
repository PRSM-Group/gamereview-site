import { prisma } from "@/lib/prisma";

export async function setGameLiked(
  userId: string,
  gameId: string,
  liked: boolean,
) {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    select: { id: true, slug: true },
  });
  if (!game) {
    throw new Error("Game not found.");
  }

  await prisma.game.update({
    where: { id: gameId },
    data: {
      likedBy: liked
        ? { connect: { id: userId } }
        : { disconnect: { id: userId } },
    },
  });

  return game;
}

export async function setReviewLiked(
  userId: string,
  reviewId: string,
  liked: boolean,
) {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: {
      id: true,
      game: { select: { slug: true } },
    },
  });
  if (!review) {
    throw new Error("Review not found.");
  }

  await prisma.review.update({
    where: { id: reviewId },
    data: {
      likedBy: liked
        ? { connect: { id: userId } }
        : { disconnect: { id: userId } },
    },
  });

  return review;
}

export async function isGameLikedByUser(gameId: string, userId: string) {
  const match = await prisma.game.findFirst({
    where: {
      id: gameId,
      likedBy: { some: { id: userId } },
    },
    select: { id: true },
  });
  return Boolean(match);
}

export async function getLikedReviewIdsForUser(
  userId: string,
  reviewIds: string[],
) {
  if (reviewIds.length === 0) return new Set<string>();

  const liked = await prisma.review.findMany({
    where: {
      id: { in: reviewIds },
      likedBy: { some: { id: userId } },
    },
    select: { id: true },
  });

  return new Set(liked.map((review) => review.id));
}
