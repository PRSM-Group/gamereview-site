"use client";

import { useEffect, useId, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { submitGameReviewAction } from "@/actions/review";
import { useAppSession } from "@/components/auth/SessionProvider";
import {
  Recommendation,
  ReviewStatus,
} from "@/generated/prisma/enums";
import type { AppSession } from "@/lib/auth";

type ReviewGameModalProps = {
  open: boolean;
  onClose: () => void;
  gameId: string;
  gameSlug: string;
  gameTitle: string;
  initialSession?: AppSession | null;
};

const RATING_OPTIONS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5] as const;

export function ReviewGameModal({
  open,
  onClose,
  gameId,
  gameSlug,
  gameTitle,
  initialSession = null,
}: ReviewGameModalProps) {
  const router = useRouter();
  const titleId = useId();
  const clientSession = useAppSession();
  const session = clientSession ?? initialSession;
  const [mounted, setMounted] = useState(false);
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
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isPending) onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open, onClose, isPending]);

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

  function submit() {
    if (!session?.user) {
      setError("You must be logged in to review.");
      return;
    }

    const trimmedHeading = heading.trim();
    const trimmedContent = content.trim();
    if (!trimmedHeading || !trimmedContent) {
      setError("Heading and review content are required.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await submitGameReviewAction({
          gameId,
          gameSlug,
          heading: trimmedHeading,
          content: trimmedContent,
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
      } catch {
        setError("Unable to submit the review. Please try again.");
      }
    });
  }

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isPending) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[1] flex max-h-[90vh] w-full max-w-[520px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0e0606] shadow-[0_24px_80px_rgba(0,0,0,0.65)] animate-fade-up"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="h-1 w-full shrink-0 bg-gradient-to-r from-[#8e0314] via-[#58050e] to-transparent" />

        <div className="overflow-y-auto p-6">
          <h3
            id={titleId}
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
              onSubmit={(event) => {
                event.preventDefault();
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
                  autoFocus
                  disabled={isPending}
                  onChange={(event) => setHeading(event.target.value)}
                />
              </label>

              <label className="block text-xs text-white/45">
                Review
                <textarea
                  className="admin-input mt-1.5 min-h-[120px] resize-y"
                  value={content}
                  maxLength={4000}
                  required
                  disabled={isPending}
                  onChange={(event) => setContent(event.target.value)}
                />
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block text-xs text-white/45">
                  Rating
                  <select
                    className="admin-input mt-1.5"
                    value={rating}
                    disabled={isPending}
                    onChange={(event) => setRating(Number(event.target.value))}
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
                    disabled={isPending}
                    onChange={(event) =>
                      setStatus(event.target.value as ReviewStatus)
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
                  disabled={isPending}
                  onChange={(event) =>
                    setRecommendation(event.target.value as Recommendation)
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
                  disabled={isPending}
                  onChange={(event) => setContainsSpoilers(event.target.checked)}
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
    </div>,
    document.body,
  );
}
