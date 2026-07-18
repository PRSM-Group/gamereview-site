"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toggleReviewLikeAction } from "@/actions/like";

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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [liked, setLiked] = useState(likedByMe);
  const [count, setCount] = useState(likeCount);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLiked(likedByMe);
    setCount(likeCount);
  }, [likedByMe, likeCount]);

  function toggle(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (!isLoggedIn) {
      setError("Log in to like reviews.");
      return;
    }

    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount((prev) => Math.max(0, prev + (nextLiked ? 1 : -1)));
    setError(null);

    startTransition(async () => {
      const result = await toggleReviewLikeAction(reviewId, nextLiked);
      if (!result.success) {
        setLiked(!nextLiked);
        setCount((prev) => Math.max(0, prev + (nextLiked ? -1 : 1)));
        setError(result.message);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className={`flex flex-col items-end gap-1 ${className}`}>
      <button
        type="button"
        disabled={isPending}
        onClick={toggle}
        aria-pressed={liked}
        aria-label={liked ? "Unlike review" : "Like review"}
        className={`flex items-center gap-2 font-kumbh text-sm transition-opacity disabled:opacity-60 ${
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
