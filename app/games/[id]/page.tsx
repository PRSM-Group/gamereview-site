import { seedGames, seedReviews } from "@/lib/seed-data";
import GameHero from "@/components/games/GameHero";
import GameInfo from "@/components/games/GameInfo";
import { UserGameReviewCard } from "@/components/games/UserGameReviewCard";
import { SiteHeaderServer } from "@/components/layout/SiteHeaderServer";
import Link from "next/link";

export default async function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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
