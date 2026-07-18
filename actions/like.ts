"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth-helpers";
import { setGameLiked, setReviewLiked } from "@/services/like.service";

export type LikeActionResult = {
  success: boolean;
  message: string;
  liked?: boolean;
  likeCount?: number;
};

export async function toggleGameLikeAction(
  gameId: string,
  liked: boolean,
): Promise<LikeActionResult> {
  let session;
  try {
    session = await requireAuth();
  } catch {
    return { success: false, message: "You must be logged in to like a game." };
  }

  try {
    const game = await setGameLiked(session.user.id, gameId, liked);
    revalidatePath(`/games/${game.slug}`);
    revalidatePath("/");
    revalidatePath("/browse");
    return {
      success: true,
      message: liked ? "Game liked." : "Game unliked.",
      liked: game.liked,
      likeCount: game.likeCount,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unable to update game like.",
    };
  }
}

export async function toggleReviewLikeAction(
  reviewId: string,
  liked: boolean,
): Promise<LikeActionResult> {
  let session;
  try {
    session = await requireAuth();
  } catch {
    return {
      success: false,
      message: "You must be logged in to like a review.",
    };
  }

  try {
    const review = await setReviewLiked(session.user.id, reviewId, liked);
    revalidatePath(`/games/${review.gameSlug}`);
    revalidatePath("/reviews");
    revalidatePath("/");
    return {
      success: true,
      message: liked ? "Review liked." : "Review unliked.",
      liked: review.liked,
      likeCount: review.likeCount,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update review like.",
    };
  }
}
