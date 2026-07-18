"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteReviewAction } from "@/actions/review";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Pagination } from "@/components/ui/Pagination";
import type { AdminReview } from "@/lib/review-display";
import { PAGE_SIZE, paginateItems, totalPagesFor } from "@/lib/pagination";

type ReviewsTabProps = {
  reviews: AdminReview[];
  gamesById: Record<string, string>;
};

type GameSummary = {
  gameId: string;
  title: string;
  reviewCount: number;
  flagCount: number;
  lastReviewedAt: string;
};

export function ReviewsTab({
  reviews,
  gamesById,
}: ReviewsTabProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [gamesPage, setGamesPage] = useState(1);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const gameSummaries = useMemo(() => {
    const byGame = new Map<string, AdminReview[]>();
    for (const review of reviews) {
      const list = byGame.get(review.gameId) ?? [];
      list.push(review);
      byGame.set(review.gameId, list);
    }

    return Array.from(byGame.entries())
      .map(([gameId, gameReviews]): GameSummary => {
        const latest = [...gameReviews].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )[0];
        return {
          gameId,
          title: gamesById[gameId] ?? "Unknown",
          reviewCount: gameReviews.length,
          flagCount: gameReviews.reduce((sum, r) => sum + r.flagCount, 0),
          lastReviewedAt: latest.createdAt,
        };
      })
      .sort(
        (a, b) =>
          new Date(b.lastReviewedAt).getTime() -
          new Date(a.lastReviewedAt).getTime(),
      );
  }, [reviews, gamesById]);

  const filteredGames = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return gameSummaries;
    return gameSummaries.filter((g) => g.title.toLowerCase().includes(q));
  }, [gameSummaries, query]);

  const selectedGame = gameSummaries.find((g) => g.gameId === selectedGameId);

  const gameReviews = useMemo(() => {
    if (!selectedGameId) return [];
    const q = query.trim().toLowerCase();
    return reviews
      .filter((r) => r.gameId === selectedGameId)
      .filter(
        (r) =>
          !q ||
          r.title.toLowerCase().includes(q) ||
          r.authorName.toLowerCase().includes(q) ||
          r.content.toLowerCase().includes(q),
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [reviews, selectedGameId, query]);

  const totalPages = totalPagesFor(gameReviews.length);
  const gamesTotalPages = totalPagesFor(filteredGames.length);

  const paginatedReviews = useMemo(
    () => paginateItems(gameReviews, page),
    [gameReviews, page],
  );
  const paginatedGames = useMemo(
    () => paginateItems(filteredGames, gamesPage),
    [filteredGames, gamesPage],
  );

  useEffect(() => {
    setPage(1);
  }, [selectedGameId, query]);

  useEffect(() => {
    setGamesPage(1);
  }, [query, selectedGameId]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    if (gamesPage > gamesTotalPages) setGamesPage(gamesTotalPages);
  }, [gamesPage, gamesTotalPages]);

  const flaggedCount = reviews.filter((r) => r.flagCount > 0).length;

  function openGame(gameId: string) {
    setSelectedGameId(gameId);
    setQuery("");
    setPage(1);
  }

  function backToGames() {
    setSelectedGameId(null);
    setQuery("");
    setPage(1);
  }

  function confirmDelete() {
    if (!pendingDeleteId) return;

    const id = pendingDeleteId;
    startTransition(async () => {
      try {
        const result = await deleteReviewAction(id);
        if (!result.success) {
          setAlertMessage(result.message);
          return;
        }
        setPendingDeleteId(null);
        router.refresh();
      } catch {
        setAlertMessage("Unable to delete the review.");
      }
    });
  }

  if (selectedGameId && selectedGame) {
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <button
              type="button"
              className="mb-2 text-xs text-white/45 transition-colors hover:text-white/80"
              onClick={backToGames}
            >
              ← All games
            </button>
            <h2 className="text-sm font-semibold text-white">
              {selectedGame.title}
            </h2>
            <p className="mt-0.5 text-xs text-white/40">
              {selectedGame.reviewCount} reviews · {selectedGame.flagCount} flags
              {gameReviews.length > PAGE_SIZE
                ? ` · page ${page} of ${totalPages}`
                : ""}
            </p>
          </div>
          <label className="block min-w-[200px] flex-1 sm:max-w-xs">
            <span className="sr-only">Search reviews</span>
            <input
              className="admin-input"
              placeholder="Search title, author…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>

        <div className="space-y-4">
          {gameReviews.length === 0 ? (
            <div className="rounded-xl border border-white/8 bg-black/25 px-5 py-12 text-center text-sm text-white/40">
              No reviews match your search.
            </div>
          ) : (
            paginatedReviews.map((review) => (
              <article
                key={review.id}
                className="rounded-xl border border-white/8 bg-black/25 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/8 pb-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold leading-snug text-white">
                      {review.title}
                    </h3>
                    <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.08em] text-white/40">
                      <span>{review.authorName}</span>
                      <span aria-hidden>·</span>
                      <span>{review.rating}/5</span>
                      <span aria-hidden>·</span>
                      <span>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      review.flagCount > 0
                        ? "bg-[rgba(142,3,20,0.35)] text-[#ff8f8f]"
                        : "bg-white/5 text-white/45"
                    }`}
                  >
                    {review.flagCount > 0 ? (
                      <svg
                        viewBox="0 0 24 24"
                        className="size-3.5"
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="M12 9v4M10.3 4.8 2.9 17.2A2 2 0 0 0 4.6 20h14.8a2 2 0 0 0 1.7-2.8L13.7 4.8a2 2 0 0 0-3.4 0Z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : null}
                    {review.flagCount} flag{review.flagCount === 1 ? "" : "s"}
                  </span>
                </div>

                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-white/75">
                  {review.content}
                </p>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-white/8 pt-4">
                  <button
                    type="button"
                    disabled={isPending}
                    className="glass-button rounded-lg px-3 py-1.5 text-xs text-[#ffb4b4]"
                    onClick={() => setPendingDeleteId(review.id)}
                  >
                    Delete review
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={gameReviews.length}
          onPageChange={setPage}
          label="Review pages"
        />

        <ConfirmDialog
          open={Boolean(pendingDeleteId)}
          title="Delete review"
          message="This review will be permanently removed. This cannot be undone."
          confirmLabel="Delete review"
          destructive
          onCancel={() => setPendingDeleteId(null)}
          onConfirm={confirmDelete}
        />

        <ConfirmDialog
          open={Boolean(alertMessage)}
          mode="alert"
          title="Error"
          message={alertMessage ?? ""}
          confirmLabel="OK"
          onCancel={() => setAlertMessage(null)}
          onConfirm={() => setAlertMessage(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-white">Games</h2>
          <p className="mt-0.5 text-xs text-white/40">
            {gameSummaries.length} with reviews · {reviews.length} total ·{" "}
            {flaggedCount} flagged
            {filteredGames.length > PAGE_SIZE
              ? ` · page ${gamesPage} of ${gamesTotalPages}`
              : ""}
          </p>
        </div>
        <label className="block min-w-[200px] flex-1 sm:max-w-xs">
          <span className="sr-only">Search games</span>
          <input
            className="admin-input"
            placeholder="Search game…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/8 bg-black/25">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-[0.12em] text-white/35">
                <th className="px-5 py-3 font-medium">Game</th>
                <th className="px-4 py-3 font-medium">Reviews</th>
                <th className="px-4 py-3 font-medium">Flags</th>
                <th className="px-4 py-3 font-medium">Last reviewed</th>
              </tr>
            </thead>
            <tbody>
              {filteredGames.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-10 text-center text-sm text-white/40"
                  >
                    No games match your search.
                  </td>
                </tr>
              ) : (
                paginatedGames.map((game) => (
                  <tr
                    key={game.gameId}
                    className="admin-table-row cursor-pointer"
                    onClick={() => openGame(game.gameId)}
                  >
                    <td className="px-5 py-3.5 font-medium text-white">
                      {game.title}
                    </td>
                    <td className="px-4 py-3.5 text-white/65">
                      {game.reviewCount}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex min-w-7 justify-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                          game.flagCount > 0
                            ? "bg-[rgba(142,3,20,0.35)] text-[#ff8f8f]"
                            : "bg-white/5 text-white/45"
                        }`}
                      >
                        {game.flagCount}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-white/55">
                      {new Date(game.lastReviewedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        page={gamesPage}
        totalPages={gamesTotalPages}
        totalItems={filteredGames.length}
        onPageChange={setGamesPage}
        label="Admin review game pages"
      />
    </div>
  );
}
