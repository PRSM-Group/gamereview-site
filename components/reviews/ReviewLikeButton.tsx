"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import { toggleReviewLikeAction } from "@/actions/like";
import { useLikeToggle } from "@/lib/use-like-toggle";

type ReviewLikeButtonProps = {
  reviewId: string;
  likeCount: number;
  likedByMe: boolean;
  isLoggedIn: boolean;
  className?: string;
};

function formatCount(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function ReviewLikeButton({
  reviewId,
  likeCount,
  likedByMe,
  isLoggedIn,
  className = "",
}: ReviewLikeButtonProps) {
  const onToggle = useCallback(
    (liked: boolean) => toggleReviewLikeAction(reviewId, liked),
    [reviewId],
  );

  const { liked, count, error, toggle, setError } = useLikeToggle({
    itemId: reviewId,
    initialLiked: likedByMe,
    initialCount: likeCount,
    onToggle,
  });

  function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (!isLoggedIn) {
      setError("Log in to like reviews.");
      return;
    }

    toggle();
  }

  return (
    <div className={`flex flex-col items-end gap-1 ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={liked}
        aria-label={liked ? "Unlike review" : "Like review"}
        className={`flex items-center gap-2 font-kumbh text-sm transition-opacity ${
          liked ? "text-[#ff8f8f]" : "text-[#997777] hover:text-[#ff8f8f]"
        }`}
      >
        <Image
          src="/images/review-heart.png"
          alt=""
          width={34}
          height={27}
          className={`h-[27px] w-[34px] object-contain transition-transform ${
            liked ? "scale-110" : ""
          }`}
        />
        {formatCount(count)}
      </button>
      {error ? (
        <p className="max-w-[160px] text-right text-[11px] text-[#ff8f8f]">
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
