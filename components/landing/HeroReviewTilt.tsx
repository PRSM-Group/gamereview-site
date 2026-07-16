"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";

type HeroReviewTiltProps = {
  children: ReactNode;
  className?: string;
};

export function HeroReviewTilt({ children, className }: HeroReviewTiltProps) {
  const ref = useRef<HTMLElement>(null);

  function handleMove(e: MouseEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 12;
    const rotateX = (0.5 - y) * 12;
    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
  }

  return (
    <aside
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </aside>
  );
}
