"use server";

import { revalidatePath } from "next/cache";
import {
  createReview,
  deleteReview,
  updateReview,
} from "@/services/review.service";
import {
  createReviewSchema,
  type CreateReviewInput,
  updateReviewSchema,
  type UpdateReviewInput,
} from "@/lib/validations/review";
import { requireAdmin, requireAuth } from "@/lib/auth-helpers";
import { Recommendation, ReviewStatus } from "@/generated/prisma/client";

export interface ActionResult {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
}

export type SubmitGameReviewInput = {
  gameId: string;
  gameSlug: string;
  heading: string;
  content: string;
  rating: number;
  status: ReviewStatus;
  recommendation: Recommendation;
  containsSpoilers: boolean;
};

export async function submitGameReviewAction(
  data: SubmitGameReviewInput,
): Promise<ActionResult> {
  let session;
  try {
    session = await requireAuth();
  } catch {
    return { success: false, message: "You must be logged in to review." };
  }

  const validated = createReviewSchema.safeParse({
    ...data,
    userId: session.user.id,
  });

  if (!validated.success) {
    return {
      success: false,
      message: validated.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  await createReview(validated.data);

  revalidatePath(`/games/${data.gameSlug}`);
  revalidatePath("/reviews");
  revalidatePath("/");

  return {
    success: true,
    message: "Review submitted successfully.",
  };
}

export async function createReviewAction(
  data: CreateReviewInput,
): Promise<ActionResult> {
  await requireAdmin();

  const validated = createReviewSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      message: validated.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  await createReview(validated.data);

  revalidatePath("/admin");
  revalidatePath("/");

  return {
    success: true,
    message: "Review created successfully.",
  };
}

export async function updateReviewAction(
  id: string,
  data: UpdateReviewInput,
): Promise<ActionResult> {
  await requireAdmin();

  const validated = updateReviewSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      message: validated.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const review = await updateReview(id, validated.data);

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/games/${review.game.slug}`);

  return {
    success: true,
    message: "Review updated successfully.",
  };
}

export async function deleteReviewAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  await deleteReview(id);

  revalidatePath("/admin");
  revalidatePath("/");

  return {
    success: true,
    message: "Review deleted successfully.",
  };
}
