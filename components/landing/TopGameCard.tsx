import Image from "next/image";
import type { LandingGame } from "@/lib/landing-data";
import { StarRating } from "@/components/ui/StarRating";

type TopGameCardProps = {
  game: LandingGame;
};

export function TopGameCard({ game }: TopGameCardProps) {
  return (
    <article className="glass-card overflow-hidden rounded-[15px]">
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        {game.coverImage ? (
          <Image
            src={game.coverImage}
            alt={game.title}
            fill
            className="object-cover"
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
    </article>
  );
}
