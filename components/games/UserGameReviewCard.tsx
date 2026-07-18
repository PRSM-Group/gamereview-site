"use client";

import { useCallback, useState } from "react";
import {
  ReviewDetailModal,
  type ReviewDetailData,
} from "@/components/reviews/ReviewDetailModal";
import { ReviewLikeButton } from "@/components/reviews/ReviewLikeButton";
import type { PublicGameReview } from "@/lib/review-display";

type UserGameReviewCardProps = {
  review: PublicGameReview;
  isLoggedIn: boolean;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function UserGameReviewCard({
  review,
  isLoggedIn,
}: UserGameReviewCardProps) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  const detail: ReviewDetailData = {
    id: review.id,
    title: review.title,
    content: review.content,
    rating: review.rating,
    status: review.status,
    recommendation: review.recommendation,
    containsSpoilers: review.containsSpoilers,
    createdAt: review.createdAt,
    authorName: review.displayName,
    authorUsername: review.userName,
    gameTitle: review.gameTitle,
    gameSlug: review.gameSlug,
    coverImage: review.coverImage,
    likeCount: review.likeCount,
    likedByMe: review.likedByMe,
  };

  return (
    <>
      <article
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className="glass-card flex w-full cursor-pointer flex-col items-start gap-8 rounded-[15px] p-10 pt-6 pb-6 text-left text-white lg:flex-row"
      >
        <div className="flex w-full shrink-0 flex-col items-start lg:w-56">
          <div className="flex w-full items-center gap-4">
            <div className="h-16 w-16 shrink-0 rounded-full bg-neutral-300" />

            <div className="flex flex-col">
              <span className="text-lg leading-tight font-bold text-gray-200">
                {review.displayName}
              </span>
              <span className="text-xs text-neutral-500">
                @{review.userName}
              </span>

              <div className="mt-2 w-fit rounded border border-red-950/40 bg-[#2a080d] px-3 py-1.5 text-[10px] font-extrabold tracking-widest text-white uppercase">
                {review.status}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
            <span>Posted:</span>
            <span className="text-neutral-400">
              {formatDate(review.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex w-full flex-1 flex-col gap-3">
          <div className="flex w-full items-center justify-between rounded border border-red-900/10 bg-[#2a080d]/80 px-4 py-2">
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6 shrink-0 text-white"
              >
                <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 0 1.583-3.76 1.745 1.745 0 0 1 1.716-1.41h.142c.81 0 1.503.553 1.684 1.34l1.01 4.387c.1.433.45.753.895.832a10.849 10.849 0 0 1 3.993 1.936c.273.2.428.524.428.868v4c0 .542-.315 1.034-.813 1.253a12.006 12.006 0 0 1-5.65 1.426H7.493Z" />
                <path d="M3.75 10.5a.75.75 0 0 0-.75.75v6.75a.75.75 0 0 0 .75.75h1.5a.75.75 0 0 0 .75-.75v-6.75a.75.75 0 0 0-.75-.75h-1.5Z" />
              </svg>
              <span className="text-lg font-black tracking-widest text-white uppercase">
                {review.recommendation === "RECOMMENDED"
                  ? "Would Recommend"
                  : "Not Recommended"}
              </span>
            </div>
            <div className="flex gap-0.5 text-xl">
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-2xl font-extrabold tracking-wide text-gray-100 uppercase">
              {review.title}
            </h3>
            {review.containsSpoilers ? (
              <span className="rounded border border-[#8e0314]/50 bg-[rgba(142,3,20,0.25)] px-2.5 py-1 text-[10px] font-extrabold tracking-widest text-[#ff8f8f] uppercase">
                Contains spoilers
              </span>
            ) : null}
          </div>

          <p
            className={`text-sm leading-relaxed font-normal text-gray-300 ${
              review.containsSpoilers ? "line-clamp-2 blur-[3px] select-none" : "line-clamp-4"
            }`}
          >
            {review.content}
          </p>

          <div
            className="mt-2 flex justify-end"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <ReviewLikeButton
              reviewId={review.id}
              likeCount={review.likeCount}
              likedByMe={review.likedByMe}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </div>
      </article>

      <ReviewDetailModal
        open={open}
        review={detail}
        isLoggedIn={isLoggedIn}
        onClose={close}
      />
    </>
  );
}
