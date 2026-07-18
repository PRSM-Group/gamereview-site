import Link from "next/link";
import type { LandingGame, LandingReview } from "@/lib/landing-data";
import { ReviewCard } from "@/components/landing/ReviewCard";
import { TopGameCard } from "@/components/landing/TopGameCard";

type LandingSectionsProps = {
  recentReviews: LandingReview[];
  topGames: LandingGame[];
  isLoggedIn: boolean;
  likedGameIds: string[];
};

export function RecentReviewsSection({
  reviews,
  isLoggedIn,
}: {
  reviews: LandingReview[];
  isLoggedIn: boolean;
}) {
  return (
    <section
      id="recent-reviews"
      className="mx-auto max-w-[1280px] scroll-mt-8 px-6 pb-16 pt-8 md:px-[105px] md:pb-20 md:pt-12"
    >
      <div className="mb-8 flex items-end justify-between gap-4 md:mb-10">
        <h2 className="font-kumbh text-[28px] font-bold text-white md:text-[32px]">
          RECENT REVIEWS
        </h2>
        <Link
          href="/reviews"
          className="shrink-0 font-kumbh text-sm tracking-[0.2em] text-[#8e0314] transition-colors hover:text-[#b00a1c] md:text-base"
        >
          VIEW MORE &gt;
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 md:gap-6">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            isLoggedIn={isLoggedIn}
          />
        ))}
      </div>
    </section>
  );
}

export function TopGamesSection({
  games,
  isLoggedIn,
  likedGameIds,
}: {
  games: LandingGame[];
  isLoggedIn: boolean;
  likedGameIds: string[];
}) {
  const likedSet = new Set(likedGameIds);

  return (
    <section className="mx-auto max-w-[1280px] px-6 pb-24 md:px-[105px] md:pb-32">
      <div className="mb-8 flex items-end justify-between gap-4 md:mb-10">
        <h2 className="font-kumbh text-[28px] font-bold text-white md:text-[32px]">
          TOP GAMES
        </h2>
        <Link
          href="/browse?sort=rating"
          className="shrink-0 font-kumbh text-sm tracking-[0.2em] text-[#8e0314] transition-colors hover:text-[#b00a1c] md:text-base"
        >
          VIEW MORE &gt;
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {games.map((game) => (
          <TopGameCard
            key={game.id}
            game={game}
            likedByMe={likedSet.has(game.id)}
            isLoggedIn={isLoggedIn}
          />
        ))}
      </div>
    </section>
  );
}

export function LandingSections({
  recentReviews,
  topGames,
  isLoggedIn,
  likedGameIds,
}: LandingSectionsProps) {
  return (
    <>
      <RecentReviewsSection
        reviews={recentReviews}
        isLoggedIn={isLoggedIn}
      />
      <TopGamesSection
        games={topGames}
        isLoggedIn={isLoggedIn}
        likedGameIds={likedGameIds}
      />
    </>
  );
}
