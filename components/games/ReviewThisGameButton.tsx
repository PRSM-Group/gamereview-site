"use client";

import { useState } from "react";
import { ReviewGameModal } from "@/components/games/ReviewGameModal";

type ReviewThisGameButtonProps = {
  gameId: string;
  gameSlug: string;
  gameTitle: string;
};

export function ReviewThisGameButton({
  gameId,
  gameSlug,
  gameTitle,
}: ReviewThisGameButtonProps) {
  const [open, setOpen] = useState(false);

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
        onClose={() => setOpen(false)}
        gameId={gameId}
        gameSlug={gameSlug}
        gameTitle={gameTitle}
      />
    </>
  );
}
