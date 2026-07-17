import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

import { CreateReviewInput, UpdateReviewInput } from "@/lib/validations/review";

const REVIEW_INCLUDE = {
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
  _count: {
    select: { likedBy: true },
  },
} as const;

type ReviewWithDetails = Prisma.ReviewGetPayload<{
  include: typeof REVIEW_INCLUDE;
}>;

function formatReviewDetails(review: ReviewWithDetails) {
  return {
    ...review,
    rating:
      typeof review.rating === "number"
        ? review.rating
        : review.rating.toNumber(),
  };
}

export async function getAllReviews() {
  const reviews = await prisma.review.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: REVIEW_INCLUDE,
  });
  return reviews.map(formatReviewDetails);
}

// fetch review by id
export async function getReviewById(id: string) {
  const review = await prisma.review.findUnique({
    where: { id },
    include: REVIEW_INCLUDE,
  });
  return review ? formatReviewDetails(review) : null;
}

// fetch review by game id
export async function getReviewsByGameId(gameId: string) {
  const reviews = await prisma.review.findMany({
    where: { gameId },
    orderBy: {
      createdAt: "desc",
    },
    include: REVIEW_INCLUDE,
  });
  return reviews.map(formatReviewDetails);
}

// fetch review by user id
export async function getReviewsByUserId(userId: string) {
  const reviews = await prisma.review.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
    include: REVIEW_INCLUDE,
  });
  return reviews.map(formatReviewDetails);
}

// create new review
export async function createReview(data: CreateReviewInput) {
  const review = await prisma.review.create({
    data: {
      heading: data.heading,
      content: data.content,
      rating: data.rating,
      status: data.status,
      recommendation: data.recommendation,
      containsSpoilers: data.containsSpoilers,

      user: {
        connect: { id: data.userId },
      },
      game: {
        connect: { id: data.gameId },
      },
      flaggedBy:
        data.flaggedBy && data.flaggedBy.length > 0
          ? { connect: data.flaggedBy.map((id) => ({ id })) }
          : undefined,

      likedBy:
        data.likedBy && data.likedBy.length > 0
          ? { connect: data.likedBy.map((id) => ({ id })) }
          : undefined,
    },
    include: REVIEW_INCLUDE,
  });
  return formatReviewDetails(review);
}

// update existing review by id
export async function updateReview(id: string, data: UpdateReviewInput) {
  const existingReview = await prisma.review.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingReview) {
    throw new Error("Review not found");
  }

  const review = await prisma.review.update({
    where: { id },
    data: {
      heading: data.heading,
      content: data.content,
      rating: data.rating,
      status: data.status,
      recommendation: data.recommendation,
      containsSpoilers: data.containsSpoilers,

      // Use 'set' to override/update relations in Prisma
      flaggedBy: data.flaggedBy
        ? { set: data.flaggedBy.map((id) => ({ id })) }
        : undefined,

      likedBy: data.likedBy
        ? { set: data.likedBy.map((id) => ({ id })) }
        : undefined,
    },
    include: REVIEW_INCLUDE,
  });

  return formatReviewDetails(review);
}

//delete review by id

export async function deleteReview(id: string) {
  const existingReview = await prisma.review.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingReview) {
    throw new Error("Review not found");
  }

  return prisma.review.delete({
    where: { id },
  });
}
