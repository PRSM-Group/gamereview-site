"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { submitGameReviewAction } from "@/actions/review";
import { useAppSession } from "@/components/auth/SessionProvider";
import {
  Recommendation,
  ReviewStatus,
} from "@/generated/prisma/enums";

type ReviewGameModalProps = {
  open: boolean;
  onClose: () => void;
  gameId: string;
  gameSlug: string;
  gameTitle: string;
};

const RATING_OPTIONS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

export function ReviewGameModal({
  open,
  onClose,
  gameId,
  gameSlug,
  gameTitle,
}: ReviewGameModalProps) {
  const router = useRouter();
  const session = useAppSession();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [heading, setHeading] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState<ReviewStatus>(ReviewStatus.FINISHED);
  const [recommendation, setRecommendation] = useState<Recommendation>(
    Recommendation.RECOMMENDED,
  );
  const [containsSpoilers, setContainsSpoilers] = useState(false);

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

  useEffect(() => {
    if (!open) return;
    setError(null);
    setHeading("");
    setContent("");
    setRating(5);
    setStatus(ReviewStatus.FINISHED);
    setRecommendation(Recommendation.RECOMMENDED);
    setContainsSpoilers(false);
  }, [open]);

  if (!open) return null;

  function submit() {
    if (!session?.user) {
      setError("You must be logged in to review.");
      return;
    }

    startTransition(async () => {
      const result = await submitGameReviewAction({
        gameId,
        gameSlug,
        heading,
        content,
        rating,
        status,
        recommendation,
        containsSpoilers,
      });

      if (!result.success) {
        setError(result.message);
        return;
      }

      onClose();
      router.refresh();
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-game-title"
        className="relative max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-2xl border border-white/10 bg-[#0e0606] shadow-[0_24px_80px_rgba(0,0,0,0.65)] animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 w-full bg-gradient-to-r from-[#8e0314] via-[#58050e] to-transparent" />

        <div className="p-6">
          <h3
            id="review-game-title"
            className="font-kumbh text-lg font-semibold tracking-tight text-white"
          >
            Review {gameTitle}
          </h3>
          <p className="mt-1 text-sm text-white/50">
            Share your rating and thoughts.
          </p>

          {!session?.user ? (
            <div className="mt-6 space-y-4">
              <p className="text-sm text-white/60">
                Log in to leave a review for this game.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-lg px-4 py-2.5 text-sm text-white/50 transition-colors hover:bg-white/5 hover:text-white/85"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <Link
                  href="/login"
                  className="glass-button rounded-lg px-4 py-2.5 text-sm font-medium text-white"
                >
                  Log in
                </Link>
              </div>
            </div>
          ) : (
            <form
              className="mt-5 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <label className="block text-xs text-white/45">
                Heading
                <input
                  className="admin-input mt-1.5"
                  value={heading}
                  maxLength={100}
                  required
                  onChange={(e) => setHeading(e.target.value)}
                />
              </label>

              <label className="block text-xs text-white/45">
                Review
                <textarea
                  className="admin-input mt-1.5 min-h-[120px] resize-y"
                  value={content}
                  maxLength={4000}
                  required
                  onChange={(e) => setContent(e.target.value)}
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-xs text-white/45">
                  Rating
                  <select
                    className="admin-input mt-1.5"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  >
                    {RATING_OPTIONS.map((value) => (
                      <option key={value} value={value}>
                        {value} ★
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-xs text-white/45">
                  Status
                  <select
                    className="admin-input mt-1.5"
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as ReviewStatus)
                    }
                  >
                    <option value={ReviewStatus.PLAYING}>Playing</option>
                    <option value={ReviewStatus.FINISHED}>Finished</option>
                    <option value={ReviewStatus.DROPPED}>Dropped</option>
                  </select>
                </label>
              </div>

              <label className="block text-xs text-white/45">
                Recommendation
                <select
                  className="admin-input mt-1.5"
                  value={recommendation}
                  onChange={(e) =>
                    setRecommendation(e.target.value as Recommendation)
                  }
                >
                  <option value={Recommendation.RECOMMENDED}>
                    Recommended
                  </option>
                  <option value={Recommendation.NOT_RECOMMENDED}>
                    Not recommended
                  </option>
                </select>
              </label>

              <label className="flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={containsSpoilers}
                  onChange={(e) => setContainsSpoilers(e.target.checked)}
                  className="size-4 rounded border-white/20 bg-black/40"
                />
                Contains spoilers
              </label>

              {error ? (
                <p className="text-sm text-[#ff8f8f]">{error}</p>
              ) : null}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="rounded-lg px-4 py-2.5 text-sm text-white/50 transition-colors hover:bg-white/5 hover:text-white/85"
                  onClick={onClose}
                  disabled={isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="glass-button rounded-lg px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
                >
                  {isPending ? "Submitting…" : "Submit review"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
