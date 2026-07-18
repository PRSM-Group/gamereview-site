import { getLandingData } from "@/lib/landing-data";
import { SiteHeaderServer } from "@/components/layout/SiteHeaderServer";
import { HeroSection } from "@/components/landing/HeroSection";
import { LandingSections } from "@/components/landing/LandingSections";
import { auth } from "@/lib/auth";
import {
  getLikedGameIdsForUser,
  getLikedReviewIdsForUser,
} from "@/services/like.service";

export default async function Home() {
  const [session, landingData] = await Promise.all([auth(), getLandingData()]);
  const { featuredReview, recentReviews, topGames } = landingData;

  const reviewIds = [
    featuredReview.id,
    ...recentReviews.map((review) => review.id),
  ];
  const gameIds = topGames.map((game) => game.id);

  const [likedReviewIds, likedGameIds] = session?.user.id
    ? await Promise.all([
        getLikedReviewIdsForUser(session.user.id, reviewIds),
        getLikedGameIdsForUser(session.user.id, gameIds),
      ])
    : [new Set<string>(), new Set<string>()];

  const reviewsWithLikes = recentReviews.map((review) => ({
    ...review,
    likedByMe: likedReviewIds.has(review.id),
  }));

  return (
    <div className="min-h-full bg-[#070000] text-white">
      <div className="relative z-50 animate-fade-in">
        <SiteHeaderServer />
      </div>

      <main>
        <div className="animate-fade-up">
          <HeroSection featuredReview={featuredReview} />
        </div>

        <div className="animate-fade-up animate-delay-1">
          <LandingSections
            recentReviews={reviewsWithLikes}
            topGames={topGames}
            isLoggedIn={Boolean(session?.user)}
            likedGameIds={[...likedGameIds]}
          />
        </div>
      </main>
    </div>
  );
}
