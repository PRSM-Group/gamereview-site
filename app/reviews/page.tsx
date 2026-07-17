import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import {
  ReviewsPageClient,
  type ReviewsPageReview,
} from "@/components/reviews/ReviewsPageClient";
import { auth } from "@/lib/auth";
import { getAllReviews } from "@/services/review.service";

export const metadata: Metadata = {
  title: "Reviews · VOXEL",
  description: "Browse the latest and highest-rated game reviews on VOXEL.",
};

export default async function ReviewsPage() {
  const [session, reviews] = await Promise.all([auth(), getAllReviews()]);

  const reviewFeed: ReviewsPageReview[] = reviews.map((review) => ({
    id: review.id,
    title: review.heading,
    content: review.content,
    rating: review.rating,
    status: review.status,
    recommendation: review.recommendation,
    createdAt: review.createdAt.toISOString(),
    authorName: review.user.displayName,
    gameTitle: review.game.title,
    gameSlug: review.game.slug,
    coverImage: review.game.coverImage,
    likeCount: review._count.likedBy,
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
