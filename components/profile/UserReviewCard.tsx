import Image from "next/image";
import Link from "next/link";

type Review = {
  id: string;
  title: string;
  content: string;
  rating: number;
  authorName: string;
  coverImage: string | null;
  gameId: string;
  status: string;
};

type Game = {
  id: string;
  title: string;
  coverImage: string;
};

export function UserReviewCard({
  review,
  game,
}: {
  review: Review;
  game: Game;
}) {
  return (
    <div className="glass-card flex flex-col lg:flex-row gap-8 rounded-[15px] pt-6 pb-6 p-10 text-white items-start">
      {/* left side: img + details */}
      <div className="flex gap-4 shrink-0 items-start">
        {/* cover image */}
        <div className="w-16 sm:w-20 aspect-[3/4] rounded overflow-hidden shrink-0 relative">
          <Image
            src={game.coverImage}
            alt={game.title}
            fill
            className="object-cover"
          />
        </div>

        {/* playing status + dates */}
        <div className="flex flex-col gap-3 min-w-[80px]">
          <div className="bg-[#2a080d] border border-red-950/40 px-2.5 py-1.5 rounded text-[10px] font-extrabold tracking-widest text-center text-white uppercase w-full">
            {review.status}
          </div>
          <div className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase flex flex-col gap-0.5">
            <span>POSTED:</span>
            <span className="text-neutral-400">July 1</span>
          </div>
        </div>
      </div>

      {/* middle: review content */}
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        <div className="w-full bg-[#2a080d]/80 border border-red-900/10 rounded px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-white shrink-0"
            >
              <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 0 1.583-3.76 1.745 1.745 0 0 1 1.716-1.41h.142c.81 0 1.503.553 1.684 1.34l1.01 4.387c.1.433.45.753.895.832a10.849 10.849 0 0 1 3.993 1.936c.273.2.428.524.428.868v4c0 .542-.315 1.034-.813 1.253a12.006 12.006 0 0 1-5.65 1.426H7.493Z" />
              <path d="M3.75 10.5a.75.75 0 0 0-.75.75v6.75a.75.75 0 0 0 .75.75h1.5a.75.75 0 0 0 .75-.75v-6.75a.75.75 0 0 0-.75-.75h-1.5Z" />
            </svg>
            <span className="text-lg font-black tracking-widest text-white uppercase">
              Would Recommend
            </span>
          </div>
          <div className="flex gap-0.5 text-xl">
            {"★".repeat(review.rating)}
            {"☆".repeat(5 - review.rating)}
          </div>
        </div>

        <h4 className="font-black text-2xl uppercase tracking-wide truncate">
          {review.title}
        </h4>

        <p className="text-sm leading-relaxed text-neutral-400">
          {review.content}
        </p>
      </div>

      {/* right side: edit/delete */}
      <div className="flex flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto justify-end md:justify-start">
        <button className="w-full glass-button mt-4 rounded-[10px] px-5 py-3 text-sm font-semibold text-white">
          EDIT
        </button>
        <button className="w-full glass-button mt-4 rounded-[10px] px-5 py-3 text-sm font-semibold text-white">
          DELETE
        </button>
      </div>
    </div>
  );
}
