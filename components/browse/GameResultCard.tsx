"use client";

import Image from "next/image";
import Link from "next/link";
import { resolveImageSrc } from "@/lib/image-src";
import type { GameSummary } from "@/services/game.service";

type GameCardProps = {
  game: GameSummary;
};

export function GameResultCard({ game }: GameCardProps) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className="flex h-[180px] overflow-hidden rounded-[12px] bg-[rgba(88,5,14,0.41)] transition-colors hover:bg-[rgba(88,5,14,0.55)] sm:h-[150px]"
      aria-label={`View ${game.title}`}
    >
      <div className="relative h-full w-[140px] shrink-0 overflow-hidden sm:w-[257px]">
        <Image
          src={resolveImageSrc(game.bannerImage || game.coverImage)}
          alt={game.title}
          fill
          className="object-cover"
          sizes="257px"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between px-4 py-3 sm:px-5 sm:py-4">
        <h3 className="font-kumbh text-lg font-bold text-white sm:text-2xl">
          {game.title}
        </h3>

        <p className="mt-1 line-clamp-2 font-kumbh text-xs text-white/80 sm:text-sm">
          {game.description}{" "}
          <span className="text-[#8e0314]">See More</span>
        </p>

        <p className="mt-2 text-[11px] uppercase tracking-[0.1em] text-white/35">
          {game.genres.join(" · ")} · {game.reviewCount} reviews
        </p>
      </div>
    </Link>
  );
}
