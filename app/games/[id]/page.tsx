import { seedGames, seedReviews } from "@/lib/seed-data";
import {
  toPublicGameReview,
  type PublicGameReview,
} from "@/lib/review-display";
import GameHero from "@/components/games/GameHero";
import GameInfo from "@/components/games/GameInfo";
import { UserGameReviewCard } from "@/components/games/UserGameReviewCard";
import { SiteHeaderServer } from "@/components/layout/SiteHeaderServer";
import { getGameById } from "@/services/game.service";
import { getReviewsByGameId } from "@/services/review.service";
import Link from "next/link";

function formatReleaseDate(value: Date | string | undefined): string {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [dbGame, dbReviews] = await Promise.all([
    getGameById(id),
    getReviewsByGameId(id),
  ]);

  if (dbGame) {
    const reviews: PublicGameReview[] = dbReviews.map((review) =>
      toPublicGameReview(review),
    );

    const gameInfo = {
      title: dbGame.title,
      description: dbGame.description,
      developer: dbGame.developer,
      releaseDate: formatReleaseDate(dbGame.releaseDate),
      platform: dbGame.platforms.join(" · "),
      coverImage: dbGame.coverImage,
      bannerImage: dbGame.bannerImage,
      averageRating: dbGame.averageRating,
      reviewCount: dbGame.reviewCount,
      genres: dbGame.genres,
      tags: dbGame.tags.map((tag) => tag.name),
    };

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
          <GameInfo game={gameInfo} />
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

  const game = seedGames.find((g) => g.id === id);
  if (!game) return <div>Game not found</div>;

  const reviews = seedReviews.filter((r) => r.gameId === id);

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
        <GameHero
          bannerImage={"bannerImage" in game ? game.bannerImage : ""}
        />
        <GameInfo game={game} />
        <div className="p-8 pt-2 flex flex-col gap-4">
          {reviews.map((review) => (
            <UserGameReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
}
