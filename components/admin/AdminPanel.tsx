"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { GamesTab } from "@/components/admin/GamesTab";
import { ReviewsTab } from "@/components/admin/ReviewsTab";
import { UsersTab } from "@/components/admin/UsersTab";
import {
  initialGames,
  initialReviews,
  initialTags,
  type MockGame,
  type MockReview,
  type MockTag,
} from "@/lib/admin-mock";
import { SITE_NAME } from "@/lib/seed-data";

type Tab = "users" | "games" | "reviews";

const NAV: {
  id: Tab;
  label: string;
  icon: ReactNode;
}[] = [
  {
    id: "users",
    label: "USERS",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
        <path
          d="M16 19v-1.2A3.8 3.8 0 0 0 12.2 14H7.8A3.8 3.8 0 0 0 4 17.8V19"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="10" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M19 19v-1.1A3 3 0 0 0 17 15"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M16 5.1a3 3 0 0 1 0 5.8"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "games",
    label: "GAMES",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
        <rect
          x="3"
          y="6"
          width="18"
          height="12"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M8 12h2M9 11v2M15.2 11.2h.01M17 13h.01"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "reviews",
    label: "REVIEWS",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
        <path
          d="M6 4h12a2 2 0 0 1 2 2v14l-4-3-4 3-4-3-4 3V6a2 2 0 0 1 2-2Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M9 9h6M9 12.5h4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export function AdminPanel() {
  const [tab, setTab] = useState<Tab>("users");
  const [games, setGames] = useState<MockGame[]>(initialGames);
  const [reviews, setReviews] = useState<MockReview[]>(initialReviews);
  const [tags, setTags] = useState<MockTag[]>(initialTags);

  const gamesById = useMemo(
    () =>
      Object.fromEntries(games.map((g) => [g.id, g.title])) as Record<
        string,
        string
      >,
    [games],
  );

  const active = NAV.find((item) => item.id === tab)!;

  return (
    <div className="admin-shell flex min-h-full text-white">
      <aside className="admin-sidebar flex w-[240px] shrink-0 flex-col max-md:hidden">
        <div className="border-b border-white/8 px-5 py-6">
          <p className="font-jersey text-[28px] leading-none tracking-wide">
            {SITE_NAME}
          </p>
          <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
            Admin console
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-1.5 px-3 py-5">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
            Manage
          </p>
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className="admin-nav-item"
              data-active={tab === item.id}
              onClick={() => setTab(item.id)}
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-white/5">
                {item.icon}
              </span>
              <span className="text-left">
                <span className="block leading-tight">{item.label}</span>
              </span>
            </button>
          ))}
        </nav>

        <div className="border-t border-white/8 px-4 py-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] px-3 py-2.5">
            <div className="flex size-8 items-center justify-center rounded-full bg-[rgba(88,5,14,0.55)] text-xs font-semibold">
              SA
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">Site Admin</p>
              <p className="truncate text-[11px] text-white/40">
                mock · no auth
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="mt-3 flex items-center justify-center rounded-lg px-3 py-2 text-xs text-white/45 transition-colors hover:bg-white/5 hover:text-white/80"
          >
            ← Back to site
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-white/8 px-5 py-4 md:px-8">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/35">
              {active.label}
            </p>
            <h1 className="mt-1 font-kumbh text-xl font-semibold tracking-tight md:text-2xl">
              {active.id === "users"
                ? "User Management"
                : active.id === "games"
                  ? "Game Management"
                  : "Review Moderation"}
            </h1>
          </div>
          <Link
            href="/"
            className="glass-button rounded-lg px-3.5 py-2 text-xs md:hidden"
          >
            Site
          </Link>
        </header>

        {/* Mobile tab switcher */}
        <div className="flex gap-2 border-b border-white/8 px-5 py-3 md:hidden">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                tab === item.id
                  ? "bg-[rgba(88,5,14,0.5)] text-white"
                  : "bg-white/5 text-white/55"
              }`}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <main className="admin-panel m-4 flex-1 overflow-auto p-4 md:m-6 md:p-6">
          {tab === "users" ? (
            <UsersTab
              gamesById={gamesById}
              reviews={reviews}
              setReviewsAction={setReviews}
            />
          ) : tab === "games" ? (
            <GamesTab
              games={games}
              setGamesAction={setGames}
              reviews={reviews}
              tags={tags}
              setTagsAction={setTags}
            />
          ) : (
            <ReviewsTab
              reviews={reviews}
              gamesById={gamesById}
              setReviewsAction={setReviews}
            />
          )}
        </main>
      </div>
    </div>
  );
}
