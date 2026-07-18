"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { StarRating } from "@/components/ui/StarRating";
import { ReviewLikeButton } from "@/components/reviews/ReviewLikeButton";
import { resolveImageSrc } from "@/lib/image-src";

export type ReviewDetailData = {
  id: string;
  title: string;
  content: string;
  rating: number;
  status: string;
  recommendation: string;
  containsSpoilers: boolean;
  createdAt: string;
  authorName: string;
  authorUsername?: string;
  gameTitle?: string;
  gameSlug?: string;
  coverImage?: string | null;
  likeCount: number;
  likedByMe: boolean;
};

type ReviewDetailModalProps = {
  open: boolean;
  review: ReviewDetailData | null;
  isLoggedIn: boolean;
  onClose: () => void;
};

function formatStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function ReviewDetailModal({
  open,
  review,
  isLoggedIn,
  onClose,
}: ReviewDetailModalProps) {
  const titleId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open || !review || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[1] flex max-h-[90vh] w-full max-w-[640px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0e0606] shadow-[0_24px_80px_rgba(0,0,0,0.65)] animate-fade-up"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="h-1 w-full shrink-0 bg-gradient-to-r from-[#8e0314] via-[#58050e] to-transparent" />

        <div className="overflow-y-auto p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-kumbh text-xs text-[#997777]">
                {review.authorName}
                {review.authorUsername ? ` · @${review.authorUsername}` : ""}
                {" · "}
                {formatDate(review.createdAt)}
              </p>
              <h3
                id={titleId}
                className="mt-2 font-kumbh text-xl font-semibold uppercase tracking-tight text-white"
              >
                {review.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-2 py-1 text-sm text-white/45 hover:bg-white/5 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <StarRating rating={Math.round(review.rating)} size={18} />
            <span className="rounded bg-[#2a080d] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white">
              {formatStatus(review.status)}
            </span>
            {review.containsSpoilers ? (
              <span className="rounded border border-[#8e0314]/50 bg-[rgba(142,3,20,0.25)] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[#ff8f8f]">
                Contains spoilers
              </span>
            ) : null}
          </div>

          {review.gameSlug && review.coverImage ? (
            <Link
              href={`/games/${review.gameSlug}`}
              className="mt-5 flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-3 transition-colors hover:border-white/20"
            >
              <span className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md">
                <Image
                  src={resolveImageSrc(review.coverImage)}
                  alt={review.gameTitle ?? "Game"}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] uppercase tracking-[0.14em] text-white/35">
                  Game
                </span>
                <span className="block truncate font-kumbh text-sm font-semibold text-white">
                  {review.gameTitle}
                </span>
              </span>
            </Link>
          ) : null}

          <p className="mt-5 whitespace-pre-wrap font-kumbh text-sm leading-relaxed text-white/85">
            {review.content}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-4">
            <p className="font-kumbh text-sm text-[#997777]">
              {review.authorName}{" "}
              {review.recommendation === "RECOMMENDED"
                ? "recommends this game!"
                : "does not recommend this game."}
            </p>
            <ReviewLikeButton
              reviewId={review.id}
              likeCount={review.likeCount}
              likedByMe={review.likedByMe}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
