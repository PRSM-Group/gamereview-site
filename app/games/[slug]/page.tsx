import { notFound } from "next/navigation";
import { toPublicGameReview } from "@/lib/review-display";
import GameHero from "@/components/games/GameHero";
import GameInfo from "@/components/games/GameInfo";
import { GameReviewsSection } from "@/components/games/GameReviewsSection";
import { SiteHeaderServer } from "@/components/layout/SiteHeaderServer";
import { auth } from "@/lib/auth";
import { getGameBySlug } from "@/services/game.service";
import {
  getLikedReviewIdsForUser,
  isGameLikedByUser,
} from "@/services/like.service";
import { getReviewsByGameId } from "@/services/review.service";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [session, dbGame] = await Promise.all([auth(), getGameBySlug(slug)]);
  if (!dbGame) {
    notFound();
  }

  const dbReviews = await getReviewsByGameId(dbGame.id);
  const likedReviewIds = session?.user.id
    ? await getLikedReviewIdsForUser(
        session.user.id,
        dbReviews.map((review) => review.id),
      )
    : new Set<string>();
  const likedByMe = session?.user.id
    ? await isGameLikedByUser(dbGame.id, session.user.id)
    : false;

  const reviews = dbReviews.map((review) =>
    toPublicGameReview({
      ...review,
      likedByMe: likedReviewIds.has(review.id),
    }),
  );

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
        <GameInfo
          game={dbGame}
          initialSession={session}
          likedByMe={likedByMe}
        />
        <div className="p-8 pt-2">
          <GameReviewsSection
            reviews={reviews}
            isLoggedIn={Boolean(session?.user)}
          />
        </div>
      </div>
    </div>
  );
}
