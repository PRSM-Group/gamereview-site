import { prisma } from "@/lib/prisma";

export async function setGameLiked(
  userId: string,
  gameId: string,
  liked: boolean,
) {
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

  const currentlyLiked = game.likedBy.length > 0;

  if (liked !== currentlyLiked) {
    await prisma.game.update({
      where: { id: gameId },
      data: {
        likedBy: liked
          ? { connect: { id: userId } }
          : { disconnect: { id: userId } },
      },
    });
  }

  const likeCount = currentlyLiked
    ? liked
      ? game._count.likedBy
      : Math.max(0, game._count.likedBy - 1)
    : liked
      ? game._count.likedBy + 1
      : game._count.likedBy;

  return {
    id: game.id,
    slug: game.slug,
    liked,
    likeCount,
  };
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

  const currentlyLiked = review.likedBy.length > 0;

  if (liked !== currentlyLiked) {
    await prisma.review.update({
      where: { id: reviewId },
      data: {
        likedBy: liked
          ? { connect: { id: userId } }
          : { disconnect: { id: userId } },
      },
    });
  }

  const likeCount = currentlyLiked
    ? liked
      ? review._count.likedBy
      : Math.max(0, review._count.likedBy - 1)
    : liked
      ? review._count.likedBy + 1
      : review._count.likedBy;

  return {
    id: review.id,
    gameSlug: review.game.slug,
    liked,
    likeCount,
  };
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
