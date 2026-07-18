import { notFound } from "next/navigation";
import { toPublicGameReview } from "@/lib/review-display";
import GameHero from "@/components/games/GameHero";
import GameInfo from "@/components/games/GameInfo";
import { UserGameReviewCard } from "@/components/games/UserGameReviewCard";
import { SiteHeaderServer } from "@/components/layout/SiteHeaderServer";
import { getGameBySlug } from "@/services/game.service";
import { getReviewsByGameId } from "@/services/review.service";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dbGame = await getGameBySlug(slug);
  if (!dbGame) {
    notFound();
  }

  const dbReviews = await getReviewsByGameId(dbGame.id);
  const reviews = dbReviews.map(toPublicGameReview);

  return (
    <div className="min-h-full bg-[#070000] text-white">
      <SiteHeaderServer />

      <div className="max-w-6xl text-base mx-auto px-4 pt-6 pb-2">
        <Link
          href="/browse"
          className="font-bold tracking-widest text-red-700 hover:text-red-500 uppercase transition-colors inline-flex items-center gap-1"
        >
          &lt; Return
        </Link>
      </div>
      <div className="mx-auto px-6 pb-16 pt-2 md:px-[113px] md:pt-2">
        <GameHero bannerImage={dbGame.bannerImage} />
        <GameInfo game={dbGame} />
        <div className="p-8 pt-2 flex flex-col gap-4">
          {reviews.length === 0 ? (
            <p className="text-sm text-white/45">No reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <UserGameReviewCard key={review.id} review={review} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
