"use client";

import { useCallback, useState } from "react";
import { ReviewGameModal } from "@/components/games/ReviewGameModal";
import type { AppSession } from "@/lib/auth";

type ReviewThisGameButtonProps = {
  gameId: string;
  gameSlug: string;
  gameTitle: string;
  initialSession?: AppSession | null;
};

export function ReviewThisGameButton({
  gameId,
  gameSlug,
  gameTitle,
  initialSession = null,
}: ReviewThisGameButtonProps) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full glass-button mt-4 rounded-[10px] px-4 py-3.5 text-base font-semibold cursor-pointer text-white"
      >
        Review this Game
      </button>
      <ReviewGameModal
        open={open}
        onClose={close}
        gameId={gameId}
        gameSlug={gameSlug}
        gameTitle={gameTitle}
        initialSession={initialSession}
      />
    </>
  );
}
