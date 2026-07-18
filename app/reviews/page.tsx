import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import {
  ReviewsPageClient,
  type ReviewsPageReview,
} from "@/components/reviews/ReviewsPageClient";
import { auth } from "@/lib/auth";
import { getLikedReviewIdsForUser } from "@/services/like.service";
import { getAllReviews } from "@/services/review.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reviews · VOXEL",
  description: "Browse the latest and highest-rated game reviews on VOXEL.",
};

export default async function ReviewsPage() {
  const [session, reviews] = await Promise.all([auth(), getAllReviews()]);
  const likedReviewIds = session?.user.id
    ? await getLikedReviewIdsForUser(
        session.user.id,
        reviews.map((review) => review.id),
      )
    : new Set<string>();

  const reviewFeed: ReviewsPageReview[] = reviews.map((review) => ({
    id: review.id,
    title: review.heading,
    content: review.content,
    rating: review.rating,
    status: review.status,
    recommendation: review.recommendation,
    containsSpoilers: review.containsSpoilers,
    createdAt: review.createdAt.toISOString(),
    authorName: review.user.displayName,
    authorUsername: review.user.username,
    gameTitle: review.game.title,
    gameSlug: review.game.slug,
    coverImage: review.game.coverImage,
    likeCount: review._count.likedBy,
    likedByMe: likedReviewIds.has(review.id),
    isFollowing: false,
  }));

  return (
    <div className="min-h-full bg-[#070000] text-white">
      <SiteHeader initialSession={session} />
      <ReviewsPageClient
        reviews={reviewFeed}
        isLoggedIn={Boolean(session?.user)}
      />
    </div>
  );
}
