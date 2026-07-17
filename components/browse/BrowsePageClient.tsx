"use client";

import { useMemo, useState } from "react";
import type { Session } from "next-auth";
import Image from "next/image";
import { FeaturedCarousel } from "@/components/browse/FeaturedCarousel";
import { GameResultCard } from "@/components/browse/GameResultCard";
import { SiteHeader } from "@/components/layout/SiteHeader";
import type { SortOption } from "@/lib/browse-mock";

import type { GameSummary } from "@/services/game.service";
import { Genre, type Genre as GenreValue } from "@/generated/prisma/browser";
const GENRES = Object.values(Genre);

type BrowseProps = {
  initialSession?: Session | null;
  games: GameSummary[];
};

const SORT_LABELS: Record<SortOption, string> = {
  reviews: "Most reviews",
  rating: "Highest rating",
};

export function BrowsePageClient({
  initialSession = null,
  games,
}: BrowseProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("reviews");
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<GenreValue[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const availableTags = useMemo(
    () => [...new Set(games.flatMap((game) => game.tags))].sort(),
    [games],
  );

  const featuredBanners = useMemo(
    () =>
      [...games]
        .sort(
          (first, second) =>
            second.averageRating - first.averageRating ||
            second.reviewCount - first.reviewCount,
        )
        .slice(0, 5)
        .map((game) => ({
          id: game.id,
          title: game.title,
          subtitle: game.description,
          image: game.bannerImage,
          gameId: game.slug,
        })),
    [games],
  );

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filteredGames = games.filter((game) => {
      const matchesQuery =
        !normalizedQuery ||
        game.title.toLowerCase().includes(normalizedQuery) ||
        game.description.toLowerCase().includes(normalizedQuery);
      const matchesGenre =
        selectedGenres.length === 0 ||
        selectedGenres.some((genre) => game.genres.includes(genre));
      const matchesTag =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => game.tags.includes(tag));

      return matchesQuery && matchesGenre && matchesTag;
    });
    return [...filteredGames].sort((first, second) => {
      if (sort === "reviews") {
        return second.reviewCount - first.reviewCount;
      }
      return second.averageRating - first.averageRating;
    });
  }, [games, query, selectedGenres, selectedTags, sort]);

  function toggleGenre(genre: GenreValue) {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  }

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  return (
    <div className="min-h-full bg-[#070000] text-white">
      <SiteHeader initialSession={initialSession} />

      <main className="mx-auto max-w-[1280px] px-6 pb-16 pt-8 md:px-[113px] md:pt-10">
        <FeaturedCarousel banners={featuredBanners} />

        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_210px]">
          <div className="min-w-0 space-y-4">
            <label className="glass-card relative flex h-[46px] items-center gap-3 rounded-[15px] px-4">
              <Image
                src="/images/search.png"
                alt=""
                width={21}
                height={21}
                className="opacity-40"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search games..."
                className="w-full bg-transparent font-kumbh text-sm text-white outline-none placeholder:text-white/35"
              />
            </label>

            <p className="text-xs text-white/40">
              {results.length} game{results.length === 1 ? "" : "s"}
            </p>

            <div className="space-y-4">
              {results.length === 0 ? (
                <div className="rounded-[12px] border border-white/10 bg-[rgba(88,5,14,0.15)] px-5 py-10 text-center text-sm text-white/50">
                  No games match your search or filters.
                </div>
              ) : (
                results.map((game) => (
                  <GameResultCard key={game.id} game={game} />
                ))
              )}
            </div>
          </div>

          <aside className="space-y-3">
            <div className="relative">
              <button
                type="button"
                className="glass-button flex h-[46px] w-full items-center justify-center rounded-[10px] font-kumbh text-sm font-semibold tracking-wide"
                onClick={() => setSortOpen((open) => !open)}
                aria-expanded={sortOpen}
              >
                SORT BY
              </button>

              {sortOpen ? (
                <div className="absolute left-0 right-0 top-[52px] z-20 overflow-hidden rounded-[12px] border border-white/10 bg-[#100606] shadow-xl shadow-black/50">
                  {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`block w-full px-4 py-3 text-left text-sm transition-colors hover:bg-[rgba(88,5,14,0.35)] ${
                        sort === option
                          ? "bg-[rgba(88,5,14,0.4)] text-white"
                          : "text-white/70"
                      }`}
                      onClick={() => {
                        setSort(option);
                        setSortOpen(false);
                      }}
                    >
                      {SORT_LABELS[option]}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <p className="px-1 text-[11px] text-white/40">
              {SORT_LABELS[sort]}
            </p>

            <div className="glass-card rounded-[15px] p-4">
              <p className="font-kumbh text-xs font-semibold tracking-wide text-white">
                GENRES
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {GENRES.map((genre) => {
                  const selected = selectedGenres.includes(genre);
                  return (
                    <button
                      key={genre}
                      type="button"
                      className={`rounded-[5px] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition-colors ${
                        selected
                          ? "border border-white bg-[rgba(88,5,14,0.41)] text-white"
                          : "bg-[rgba(88,5,14,0.1)] text-white/55 hover:text-white/80"
                      }`}
                      onClick={() => toggleGenre(genre)}
                    >
                      {genre}
                    </button>
                  );
                })}
              </div>

              <p className="mt-5 font-kumbh text-xs font-semibold tracking-wide text-white">
                TAGS
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const selected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      className={`rounded-[5px] px-2.5 py-1.5 text-[10px] font-semibold tracking-wide transition-colors ${
                        selected
                          ? "border border-white bg-[rgba(88,5,14,0.41)] text-white"
                          : "bg-[rgba(88,5,14,0.1)] text-white/55 hover:text-white/80"
                      }`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>

              {selectedGenres.length > 0 || selectedTags.length > 0 ? (
                <button
                  type="button"
                  className="mt-4 text-xs text-[#8e0314] hover:underline"
                  onClick={() => {
                    setSelectedGenres([]);
                    setSelectedTags([]);
                  }}
                >
                  Clear filters
                </button>
              ) : null}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
