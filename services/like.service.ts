import { prisma } from "@/lib/prisma";

async function readGameLikeState(gameId: string, userId: string) {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    select: {
      id: true,
      slug: true,
      _count: { select: { likedBy: true } },
      likedBy: {
        where: { id: userId },
        select: { id: true },
      },
    },
  });

  if (!game) {
    throw new Error("Game not found.");
  }

  return {
    id: game.id,
    slug: game.slug,
    liked: game.likedBy.length > 0,
    likeCount: game._count.likedBy,
  };
}

async function readReviewLikeState(reviewId: string, userId: string) {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: {
      id: true,
      game: { select: { slug: true } },
      _count: { select: { likedBy: true } },
      likedBy: {
        where: { id: userId },
        select: { id: true },
      },
    },
  });

  if (!review) {
    throw new Error("Review not found.");
  }

  return {
    id: review.id,
    gameSlug: review.game.slug,
    liked: review.likedBy.length > 0,
    likeCount: review._count.likedBy,
  };
}

export async function setGameLiked(
  userId: string,
  gameId: string,
  liked: boolean,
) {
  const current = await readGameLikeState(gameId, userId);

  if (liked !== current.liked) {
    await prisma.game.update({
      where: { id: gameId },
      data: {
        likedBy: liked
          ? { connect: { id: userId } }
          : { disconnect: { id: userId } },
      },
    });
  }

  return readGameLikeState(gameId, userId);
}

export async function setReviewLiked(
  userId: string,
  reviewId: string,
  liked: boolean,
) {
  const current = await readReviewLikeState(reviewId, userId);

  if (liked !== current.liked) {
    await prisma.review.update({
      where: { id: reviewId },
      data: {
        likedBy: liked
          ? { connect: { id: userId } }
          : { disconnect: { id: userId } },
      },
    });
  }

  return readReviewLikeState(reviewId, userId);
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

export async function getLikedGameIdsForUser(
  userId: string,
  gameIds: string[],
) {
  if (gameIds.length === 0) return new Set<string>();

  const liked = await prisma.game.findMany({
    where: {
      id: { in: gameIds },
      likedBy: { some: { id: userId } },
    },
    select: { id: true },
  });

  return new Set(liked.map((game) => game.id));
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
