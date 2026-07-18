import Image from "next/image";
import Link from "next/link";
import type { LandingGame } from "@/lib/landing-data";
import { StarRating } from "@/components/ui/StarRating";
import { LikeGameButton } from "@/components/games/LikeGameButton";
import { resolveImageSrc } from "@/lib/image-src";

type TopGameCardProps = {
  game: LandingGame;
  likedByMe: boolean;
  isLoggedIn: boolean;
};

export function TopGameCard({ game, likedByMe, isLoggedIn }: TopGameCardProps) {
  return (
    <div className="relative">
      <Link
        href={`/games/${game.slug}`}
        className="glass-card block overflow-hidden rounded-[15px] transition-transform hover:-translate-y-1"
        aria-label={`View ${game.title}`}
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          {game.coverImage ? (
            <Image
              src={resolveImageSrc(game.coverImage)}
              alt={game.title}
              fill
              className="object-cover"
              unoptimized
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="size-full bg-[rgba(88,5,14,0.25)]" />
          )}
        </div>
        <div className="space-y-2 p-4">
          <h3 className="font-kumbh text-base font-semibold text-white">
            {game.title}
          </h3>
          <div className="flex items-center gap-2">
            <StarRating rating={Math.round(game.averageRating)} size={16} />
            <span className="font-kumbh text-xs text-white/45">
              {game.reviewCount}{" "}
              {game.reviewCount === 1 ? "reviewer" : "reviewers"}
            </span>
          </div>
        </div>
      </Link>

      <div className="absolute right-3 top-3 z-10">
        <LikeGameButton
          gameId={game.id}
          likedByMe={likedByMe}
          isLoggedIn={isLoggedIn}
          size="sm"
        />
      </div>
    </div>
  );
}
