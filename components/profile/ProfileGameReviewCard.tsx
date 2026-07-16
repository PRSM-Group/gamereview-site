import Image from "next/image";

type Review = {
  id: string;
  title: string;
  content: string;
  rating: number;
  authorName: string;
  coverImage: string | null;
  gameId: string;
};

type Game = {
  id: string;
  title: string;
  coverImage: string;
};

export function ProfileGameReviewCard({
  review,
  game,
}: {
  review: Review;
  game: Game;
}) {
  return (
    <div className="glass-card flex flex-col lg:flex-row gap-8 rounded-[15px] pt-6 pb-6 p-10 text-white items-start">
      {/* cover image */}
      <div className="w-16 sm:w-20 aspect-[3/4] rounded overflow-hidden shrink-0 relative">
        <Image
          src={game.coverImage}
          alt={game.title}
          fill
          className="object-cover"
        />
      </div>

      {/* review content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex justify-between items-center text-[10px]">
          <div className="flex text-white text-xs">
            {"★".repeat(review.rating)}
            {"☆".repeat(5 - review.rating)}
          </div>
        </div>

        <h4 className="font-black text-sm uppercase tracking-wide truncate">
          {review.title}
        </h4>

        <p className="text-xs leading-relaxed text-neutral-400 line-clamp-3">
          {review.content}
          <span className="text-red-700 font-semibold hover:text-red-500 cursor-pointer ml-1">
            See More
          </span>
        </p>
      </div>
    </div>
  );
}
