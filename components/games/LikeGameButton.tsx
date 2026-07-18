"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toggleGameLikeAction } from "@/actions/like";

type LikeGameButtonProps = {
  gameId: string;
  likedByMe: boolean;
  isLoggedIn: boolean;
};

export function LikeGameButton({
  gameId,
  likedByMe,
  isLoggedIn,
}: LikeGameButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [liked, setLiked] = useState(likedByMe);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLiked(likedByMe);
  }, [likedByMe]);

  function toggle() {
    if (!isLoggedIn) {
      setError("Log in to like games.");
      return;
    }

    const nextLiked = !liked;
    setLiked(nextLiked);
    setError(null);

    startTransition(async () => {
      const result = await toggleGameLikeAction(gameId, nextLiked);
      if (!result.success) {
        setLiked(!nextLiked);
        setError(result.message);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="relative z-10 flex flex-col items-end">
      <button
        type="button"
        disabled={isPending}
        onClick={toggle}
        aria-pressed={liked}
        aria-label={liked ? "Unlike game" : "Like game"}
        className={`transition-colors focus:outline-none disabled:opacity-60 ${
          liked ? "text-red-500" : "text-white hover:text-red-500"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={liked ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-8 w-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      </button>
      {error ? (
        <p className="mt-1 max-w-[140px] text-right text-[11px] text-[#ff8f8f]">
          {error}{" "}
          {!isLoggedIn ? (
            <Link href="/login" className="underline">
              Log in
            </Link>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}
