"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { StarRating } from "@/components/ui/StarRating";
import { resolveImageSrc } from "@/lib/image-src";

export type ReviewsPageReview = {
  id: string;
  title: string;
  content: string;
  rating: number;
  status: string;
  recommendation: string;
  createdAt: string;
  authorName: string;
  gameTitle: string;
  gameSlug: string;
  coverImage: string;
  likeCount: number;
  isFollowing: boolean;
};

type FeedTab = "all" | "following" | "top";
type SortOption = "newest" | "liked";
type StatusFilter = "all" | "PLAYING" | "FINISHED" | "DROPPED";

const TABS: { id: FeedTab; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "following", label: "FOLLOWING" },
  { id: "top", label: "TOP REVIEWS" },
];

function formatStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatCount(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function ReviewsPageClient({
  reviews,
  isLoggedIn,
}: {
  reviews: ReviewsPageReview[];
  isLoggedIn: boolean;
}) {
  const [tab, setTab] = useState<FeedTab>("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [status, setStatus] = useState<StatusFilter>("all");

  const visibleReviews = useMemo(() => {
    const filtered = reviews.filter((review) => {
      if (tab === "following" && !review.isFollowing) return false;
      return status === "all" || review.status === status;
    });

    return [...filtered].sort((first, second) => {
      if (tab === "top" || sort === "liked") {
        return (
          second.likeCount - first.likeCount ||
          second.rating - first.rating
        );
      }
      return (
        new Date(second.createdAt).getTime() -
        new Date(first.createdAt).getTime()
      );
    });
  }, [reviews, sort, status, tab]);

  return (
    <main className="mx-auto w-full max-w-[1054px] px-6 pb-24 pt-12 md:px-0 md:pt-12">
      <div className="flex flex-col gap-6 border-b border-white/10 pb-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="grid w-full grid-cols-3 gap-2 xl:max-w-[700px]">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              data-active={tab === item.id}
              className="h-[46px] rounded-[10px] border border-white/10 bg-[rgba(85,40,45,0.12)] font-kumbh text-xs font-semibold text-white transition-colors hover:bg-[rgba(88,5,14,0.24)] data-[active=true]:border-[#8e0314]/40 data-[active=true]:bg-[rgba(88,5,14,0.41)] md:text-sm"
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid w-full grid-cols-2 gap-3 xl:w-[320px]">
          <label className="block">
            <span className="font-kumbh text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
              Sort by
            </span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
              className="mt-2 h-11 w-full cursor-pointer rounded-[10px] border border-[#8e0314]/30 bg-[#100606] px-3 font-kumbh text-xs text-white outline-none transition-colors hover:border-[#8e0314]/60 focus:border-[#8e0314] [color-scheme:dark]"
            >
              <option value="newest">Newest</option>
              <option value="liked">Most liked</option>
            </select>
          </label>

          <label className="block">
            <span className="font-kumbh text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
              Filter by
            </span>
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as StatusFilter)
              }
              className="mt-2 h-11 w-full cursor-pointer rounded-[10px] border border-[#8e0314]/30 bg-[#100606] px-3 font-kumbh text-xs text-white outline-none transition-colors hover:border-[#8e0314]/60 focus:border-[#8e0314] [color-scheme:dark]"
            >
              <option value="all">All statuses</option>
              <option value="PLAYING">Playing</option>
              <option value="FINISHED">Finished</option>
              <option value="DROPPED">Dropped</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {visibleReviews.length === 0 ? (
          <div className="rounded-[15px] border border-[#8e0314]/20 bg-[rgba(88,5,14,0.1)] px-6 py-16 text-center font-kumbh text-sm text-white/50">
            {tab === "following" && !isLoggedIn
              ? "Log in to see reviews from people you follow."
              : "No reviews match this view."}
          </div>
        ) : (
          visibleReviews.map((review) => (
            <article
              key={review.id}
              className="group grid gap-4 rounded-[15px] border border-[#8e0314]/20 bg-[rgba(88,5,14,0.1)] p-4 transition-[transform,border-color,background-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[#8e0314]/50 hover:bg-[rgba(88,5,14,0.16)] hover:shadow-[0_14px_32px_rgba(88,5,14,0.2)] md:grid-cols-[167px_minmax(0,1fr)] md:gap-5 md:p-5"
            >
              <Link
                href={`/games/${review.gameSlug}`}
                className="relative aspect-[3/4] w-full overflow-hidden rounded-[10px] sm:max-w-[167px]"
                aria-label={`View ${review.gameTitle}`}
              >
                <Image
                  src={resolveImageSrc(review.coverImage)}
                  alt={review.gameTitle}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  sizes="167px"
                />
              </Link>

              <div className="flex min-w-0 flex-col">
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <StarRating rating={Math.round(review.rating)} size={18} />
                  <p className="font-kumbh text-xs text-[#997777]">
                    {review.authorName} · {formatDate(review.createdAt)}
                  </p>
                </div>

                <h2 className="mt-1 font-kumbh text-lg font-semibold uppercase text-white">
                  {review.title}
                </h2>
                <p className="font-kumbh text-xs text-[#997777]">
                  Status: {formatStatus(review.status)}
                </p>
                <p className="mt-3 line-clamp-5 font-kumbh text-sm leading-relaxed text-white md:text-base">
                  {review.content}
                </p>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
                  <p className="font-kumbh text-xs text-[#997777] md:text-sm">
                    {review.authorName}{" "}
                    {review.recommendation === "RECOMMENDED"
                      ? "recommends this game!"
                      : "does not recommend this game."}
                  </p>
                  <span className="flex items-center gap-2 font-kumbh text-sm text-[#997777]">
                    <Image
                      src="/images/review-heart.png"
                      alt=""
                      width={34}
                      height={27}
                      className="h-[27px] w-[34px] object-contain"
                    />
                    {formatCount(review.likeCount)}
                  </span>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
