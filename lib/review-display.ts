import type { Prisma } from "@/generated/prisma/client";

const REVIEW_SHAPE = {
  include: {
    user: {
      select: {
        id: true,
        username: true,
        displayName: true,
        profileImage: true,
      },
    },
    game: {
      select: {
        id: true,
        title: true,
        slug: true,
        coverImage: true,
      },
    },
    flaggedBy: {
      select: { id: true },
    },
  },
} as const;

export type ReviewWithRelations = Prisma.ReviewGetPayload<typeof REVIEW_SHAPE>;

export type FormattedReview = Omit<ReviewWithRelations, "rating"> & {
  rating: number | Prisma.Decimal;
};

export type AdminReview = {
  id: string;
  title: string;
  content: string;
  rating: number;
  authorId: string;
  authorName: string;
  gameId: string;
  flagCount: number;
  createdAt: string;
};

export function toAdminReview(review: FormattedReview): AdminReview {
  return {
    id: review.id,
    title: review.heading,
    content: review.content,
    rating:
      typeof review.rating === "number"
        ? review.rating
        : Number(review.rating),
    authorId: review.user.id,
    authorName: `@${review.user.username}`,
    gameId: review.game.id,
    flagCount: review.flaggedBy.length,
    createdAt: new Date(review.createdAt).toISOString(),
  };
}

export function toPublicGameReview(
  review: FormattedReview & {
    _count?: { likedBy: number };
    likedByMe?: boolean;
  },
) {
  const rating =
    typeof review.rating === "number"
      ? review.rating
      : Number(review.rating);

  return {
    id: review.id,
    title: review.heading,
    content: review.content,
    rating: Math.round(rating),
    displayName: review.user.displayName,
    userName: review.user.username,
    coverImage: review.game.coverImage,
    featured: false,
    gameId: review.game.id,
    gameTitle: review.game.title,
    gameSlug: review.game.slug,
    status: review.status,
    recommendation: review.recommendation,
    containsSpoilers: review.containsSpoilers,
    createdAt: new Date(review.createdAt).toISOString(),
    likeCount: review._count?.likedBy ?? 0,
    likedByMe: Boolean(review.likedByMe),
  };
}

export type PublicGameReview = ReturnType<typeof toPublicGameReview>;

export type PublicProfileReview = {
  id: string;
  title: string;
  content: string;
  rating: number;
  authorName: string;
  coverImage: string | null;
  gameId: string;
  status: string;
};

export function toPublicProfileReview(
  review: FormattedReview,
): PublicProfileReview {
  const rating =
    typeof review.rating === "number"
      ? review.rating
      : Number(review.rating);

  return {
    id: review.id,
    title: review.heading,
    content: review.content,
    rating: Math.round(rating),
    authorName: `@${review.user.username}`,
    coverImage: review.game.coverImage,
    gameId: review.game.id,
    status: review.status,
  };
}
