type Review = {
  id: string;
  title: string;
  content: string;
  rating: number;
  displayName: string;
  userName: string;
  coverImage: string | null;
  featured: boolean;
  gameId: string;
  status: string;
};

export function UserGameReviewCard({ review }: { review: Review }) {
  return (
    <div className="glass-card flex flex-col lg:flex-row gap-8 rounded-[15px] pt-6 pb-6 p-10 text-white items-start">
      {/* left side: user info + status */}
      <div className="flex flex-col items-start w-full lg:w-56 shrink-0">
        <div className="flex items-center gap-4 w-full">
          <div className="w-16 h-16 rounded-full bg-neutral-300 shrink-0" />

          <div className="flex flex-col">
            <span className="font-bold text-gray-200 text-lg leading-tight">
              {review.displayName}
            </span>
            <span className="text-xs text-neutral-500">{review.userName}</span>

            <div className="mt-2 bg-[#2a080d] border border-red-950/40 px-3 py-1.5 rounded text-[10px] font-extrabold tracking-widest text-white uppercase w-fit">
              {review.status}
            </div>
          </div>
        </div>

        <div className="mt-6 text-xs font-semibold tracking-wider text-neutral-500 uppercase flex items-center gap-2">
          <span>Posted:</span>
          <span className="text-neutral-400">July 1</span>
        </div>
      </div>

      {/* right side: review content */}
      <div className="flex-1 flex flex-col gap-3 w-full">
        {/* recommended + rating */}
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

        <h3 className="text-2xl font-extrabold tracking-wide uppercase text-gray-100">
          {review.title}
        </h3>

        <p className="text-sm leading-relaxed text-gray-300 font-normal">
          {review.content}
        </p>
      </div>
    </div>
  );
}
