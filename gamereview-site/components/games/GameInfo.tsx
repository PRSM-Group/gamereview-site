"use client";

import Image from "next/image";

type Game = {
  title: string;
  description?: string;
  developer?: string;
  releaseDate?: string;
  platform?: string;
  coverImage: string;
  bannerImage?: string;
  averageRating: number;
  reviewCount: number;
  genres?: readonly string[];
  tags?: readonly string[];
};

export default function GameInfo({ game }: { game: Game }) {
  return (
    <div className="flex gap-6 p-8 pb-4 -mt-16">
      {/* left side: poster img */}
      <div className="relative w-40 h-52 flex-shrink-0">
        <Image
          src={game.coverImage}
          alt={game.title}
          fill
          className="object-cover rounded"
        />
      </div>

      {/* middle: title, description, details */}
      <div className="flex-1">
        <div className="relative z-10 flex justify-between items-start mb-4">
          <h1 className="text-4xl font-extrabold tracking-tight">
            {game.title}
          </h1>
          <button
            className="text-white hover:text-red-500 transition-colors focus:outline-none"
            aria-label="Add to favorites"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          </button>
        </div>
        <p className="relative z-10 text-gray-300 text-base leading-relaxed mb-8">
          {game.description}
        </p>

        <table className="text-sm text-gray-300">
          <div className="relative z-10 mb-2">
            <h2 className="inline-block text-lg font-bold tracking-wider uppercase border-b-2 border-white pb-1">
              Details
            </h2>
          </div>
          <tbody>
            <tr>
              <td className="pr-6 text-gray-500 py-1">DEVELOPER</td>
              <td>{game.developer}</td>
            </tr>
            <tr>
              <td className="pr-6 text-gray-500 py-1">RELEASE DATE</td>
              <td>{game.releaseDate}</td>
            </tr>
            <tr>
              <td className="pr-6 text-gray-500 py-1">PLATFORM</td>
              <td>{game.platform}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* right side */}
      <div className="w-70 glass-card rounded-[15px] p-4 relative z-10">
        {/* overall rating */}
        <div className="mb-4">
          <p className="text-sm font-bold tracking-widest text-gray-200 uppercase mb-2">
            AVERAGE RATING
          </p>
          <div className="flex gap-1 mb-2 text-5xl">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={
                  star <= game.averageRating
                    ? "text-white-400"
                    : "text-gray-600"
                }
              >
                ★
              </span>
            ))}
          </div>
          <div className="flex justify-between items-center text-sm mt-4 mb-6">
            <p className="text-gray-400 font-medium tracking-wider uppercase">
              REVIEWS
            </p>
            <p className="font-semibold text-gray-300 text-base">
              {game.reviewCount ?? 0}
            </p>
          </div>
        </div>

        {/* genres */}
        <div>
          <p className="text-xs text-gray-400 mb-2">GENRES</p>
          <div className="flex flex-wrap gap-2">
            {game.genres?.map((genre) => (
              <span
                key={genre}
                className="rounded-[5px] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition-colors bg-[rgba(88,5,14,0.1)] text-white/55 hover:text-white/80"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* tags */}
        <div>
          <p className="text-xs text-gray-400 mb-2">TAGS</p>
          <div className="flex flex-wrap gap-2">
            {game.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-[5px] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition-colors bg-[rgba(88,5,14,0.1)] text-white/55 hover:text-white/80"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* review btn */}
        <button className="w-full glass-button mt-4 rounded-[10px] px-4 py-3.5 text-base font-semibold text-white">
          Review this Game
        </button>
      </div>
    </div>
  );
}
