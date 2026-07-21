"use client";

import { useEffect, useMemo, useState } from "react";
import { UserGameReviewCard } from "@/components/games/UserGameReviewCard";
import { Pagination } from "@/components/ui/Pagination";
import type { PublicGameReview } from "@/lib/review-display";
import { PAGE_SIZE, paginateItems, totalPagesFor } from "@/lib/pagination";

type GameReviewsSectionProps = {
  reviews: PublicGameReview[];
  isLoggedIn: boolean;
};

export function GameReviewsSection({
  reviews,
  isLoggedIn,
}: GameReviewsSectionProps) {
  const [page, setPage] = useState(1);
  const totalPages = totalPagesFor(reviews.length);
  const pageItems = useMemo(
    () => paginateItems(reviews, page),
    [reviews, page],
  );

  useEffect(() => {
    setPage(1);
  }, [reviews]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  if (reviews.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-4">
        <p className="text-sm text-white/45">No reviews yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="flex flex-col gap-4">
        <p className="text-xs text-white/40">
          {reviews.length} review{reviews.length === 1 ? "" : "s"}
          {reviews.length > PAGE_SIZE ? ` · page ${page} of ${totalPages}` : ""}
        </p>
        {pageItems.map((review) => (
          <UserGameReviewCard
            key={review.id}
            review={review}
            isLoggedIn={isLoggedIn}
          />
        ))}
        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={reviews.length}
          onPageChange={setPage}
          label="Game review pages"
        />
      </div>
    </div>
  );
}
