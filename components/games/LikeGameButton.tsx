"use client";

import Link from "next/link";
import { useCallback } from "react";
import { toggleGameLikeAction } from "@/actions/like";
import { useLikeToggle } from "@/lib/use-like-toggle";

type LikeGameButtonProps = {
  gameId: string;
  likedByMe: boolean;
  isLoggedIn: boolean;
  className?: string;
  size?: "sm" | "md";
};

export function LikeGameButton({
  gameId,
  likedByMe,
  isLoggedIn,
  className = "",
  size = "md",
}: LikeGameButtonProps) {
  const onToggle = useCallback(
    (liked: boolean) => toggleGameLikeAction(gameId, liked),
    [gameId],
  );

  const { liked, error, toggle, setError } = useLikeToggle({
    itemId: gameId,
    initialLiked: likedByMe,
    onToggle,
  });

  const iconClass = size === "sm" ? "h-6 w-6" : "h-8 w-8";

  function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (!isLoggedIn) {
      setError("Log in to like games.");
      return;
    }

    toggle();
  }

  return (
    <div className={`flex flex-col items-end ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={liked}
        aria-label={liked ? "Unlike game" : "Like game"}
        className={`transition-colors focus:outline-none ${
          liked ? "text-red-500" : "text-white hover:text-red-500"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={liked ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className={iconClass}
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
