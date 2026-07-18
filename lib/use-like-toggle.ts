"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ToggleResult = {
  success: boolean;
  liked?: boolean;
  likeCount?: number;
  message?: string;
};

export function useLikeToggle({
  itemId,
  initialLiked,
  initialCount,
  onToggle,
}: {
  itemId: string;
  initialLiked: boolean;
  initialCount?: number;
  onToggle: (liked: boolean) => Promise<ToggleResult>;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount ?? 0);
  const [error, setError] = useState<string | null>(null);
  const likedRef = useRef(initialLiked);
  const countRef = useRef(initialCount ?? 0);
  const requestId = useRef(0);

  useEffect(() => {
    likedRef.current = initialLiked;
    countRef.current = initialCount ?? 0;
    setLiked(initialLiked);
    if (initialCount !== undefined) {
      setCount(initialCount);
    }
    setError(null);
  }, [itemId, initialLiked, initialCount]);

  const toggle = useCallback(() => {
    const previousLiked = likedRef.current;
    const previousCount = countRef.current;
    const nextLiked = !previousLiked;
    const currentRequest = ++requestId.current;

    likedRef.current = nextLiked;
    setLiked(nextLiked);
    if (initialCount !== undefined) {
      const nextCount = Math.max(0, previousCount + (nextLiked ? 1 : -1));
      countRef.current = nextCount;
      setCount(nextCount);
    }
    setError(null);

    void onToggle(nextLiked).then((result) => {
      if (currentRequest !== requestId.current) {
        return;
      }

      if (!result.success) {
        likedRef.current = previousLiked;
        countRef.current = previousCount;
        setLiked(previousLiked);
        setCount(previousCount);
        setError(result.message ?? "Unable to update like.");
        return;
      }

      if (typeof result.liked === "boolean") {
        likedRef.current = result.liked;
        setLiked(result.liked);
      }
      if (typeof result.likeCount === "number") {
        countRef.current = result.likeCount;
        setCount(result.likeCount);
      }
    });
  }, [initialCount, onToggle]);

  return { liked, count, error, toggle, setError };
}
