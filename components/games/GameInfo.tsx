import Image from "next/image";
import { resolveImageSrc } from "@/lib/image-src";
import { LikeGameButton } from "@/components/games/LikeGameButton";
import { ReviewThisGameButton } from "@/components/games/ReviewThisGameButton";
import type { AppSession } from "@/lib/auth";
import type { GameDetails } from "@/services/game.service";

type GameInfoData = Pick<
  GameDetails,
  | "id"
  | "slug"
  | "title"
  | "description"
  | "developer"
  | "releaseDate"
  | "coverImage"
  | "averageRating"
  | "reviewCount"
  | "genres"
  | "platforms"
  | "tags"
>;

function formatReleaseDate(releaseDate: Date) {
  return releaseDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function GameInfo({
  game,
  initialSession = null,
  likedByMe = false,
}: {
  game: GameInfoData;
  initialSession?: AppSession | null;
  likedByMe?: boolean;
}) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 mb-8">
      <div className="flex gap-6 p-8 pb-4 -mt-5">
        {/* left side: poster img */}
        <div className="relative w-60 h-72 flex-shrink-0">
          <Image
            src={resolveImageSrc(game.coverImage)}
            alt={game.title}
            fill
            unoptimized
            className="object-cover rounded"
          />
        </div>

        {/* middle: title, description, details */}
        <div className="flex-1">
          <div className="relative z-10 flex justify-between items-start mb-4">
            <h1 className="text-4xl font-extrabold tracking-tight">
              {game.title}
            </h1>
            <LikeGameButton
              gameId={game.id}
              likedByMe={likedByMe}
              isLoggedIn={Boolean(initialSession?.user)}
            />
          </div>
          <p className="relative z-10 text-gray-300 text-base leading-relaxed mb-8">
            {game.description}
          </p>

          <div className="relative z-10 mb-2">
            <h2 className="inline-block text-lg font-bold tracking-wider uppercase border-b-2 border-white pb-1">
              Details
            </h2>
          </div>
          <table className="text-sm text-gray-300">
            <tbody>
              <tr>
                <td className="pr-6 text-gray-500 py-1">DEVELOPER</td>
                <td>{game.developer}</td>
              </tr>
              <tr>
                <td className="pr-6 text-gray-500 py-1">RELEASE DATE</td>
                <td>{formatReleaseDate(game.releaseDate)}</td>
              </tr>
              <tr>
                <td className="pr-6 text-gray-500 py-1">PLATFORM</td>
                <td>{game.platforms.join(" · ")}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* right side */}
        <div className="game-side-card w-70 rounded-[15px] p-4 relative z-10">
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
              {game.genres.map((genre) => (
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
              {game.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-[5px] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition-colors bg-[rgba(88,5,14,0.1)] text-white/55 hover:text-white/80"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>

          <ReviewThisGameButton
            gameId={game.id}
            gameSlug={game.slug}
            gameTitle={game.title}
            initialSession={initialSession}
          />
        </div>
      </div>
    </div>
  );
}
