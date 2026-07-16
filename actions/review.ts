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
import { requireAdmin } from "@/lib/auth-helpers";

export interface ActionResult {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
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
  revalidatePath(`/games/${review.game.id}`);

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
