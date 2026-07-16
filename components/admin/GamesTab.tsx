"use client";

import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { GameTagSelector } from "@/components/admin/GameTagSelector";
import { TagCatalogPanel } from "@/components/admin/TagCatalogPanel";
import {
  emptyGameForm,
  GENRES,
  PLATFORMS,
  ratingStats,
  type Genre,
  type MockGame,
  type MockReview,
  type MockTag,
  type Platform,
} from "@/lib/admin-mock";

type GamesTabProps = {
  games: MockGame[];
  setGamesAction: React.Dispatch<React.SetStateAction<MockGame[]>>;
  reviews: MockReview[];
  tags: MockTag[];
  setTagsAction: React.Dispatch<React.SetStateAction<MockTag[]>>;
};

type FormState = Omit<MockGame, "id" | "deleted">;

async function fileToObjectUrl(file: File | null): Promise<string | null> {
  if (!file) return null;
  return URL.createObjectURL(file);
}

export function GamesTab({
  games,
  setGamesAction,
  reviews,
  tags,
  setTagsAction,
}: GamesTabProps) {
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyGameForm());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const activeGames = useMemo(() => games.filter((g) => !g.deleted), [games]);

  const gameReviews = useMemo(
    () => reviews.filter((r) => r.gameId === editingId),
    [reviews, editingId],
  );

  const stats = ratingStats(gameReviews);

  function openCreate() {
    setMode("create");
    setEditingId(null);
    setForm(emptyGameForm());
  }

  function openEdit(game: MockGame) {
    setMode("edit");
    setEditingId(game.id);
    setForm({
      title: game.title,
      description: game.description,
      developer: game.developer,
      releaseDate: game.releaseDate,
      coverImage: game.coverImage,
      bannerImage: game.bannerImage,
      genre: game.genre,
      platforms: [...game.platforms],
      tagIds: [...game.tagIds],
    });
  }

  function closeEditor() {
    setMode("list");
    setEditingId(null);
    setForm(emptyGameForm());
  }

  function togglePlatform(platform: Platform) {
    setForm((prev) => {
      const has = prev.platforms.includes(platform);
      return {
        ...prev,
        platforms: has
          ? prev.platforms.filter((p) => p !== platform)
          : [...prev.platforms, platform],
      };
    });
  }

  async function onImageChange(
    field: "coverImage" | "bannerImage",
    file: File | null,
  ) {
    const url = await fileToObjectUrl(file);
    setForm((prev) => ({ ...prev, [field]: url }));
  }

  function saveGame() {
    if (!form.title.trim() || !form.developer.trim() || !form.releaseDate) {
      setAlertMessage("Title, developer, and release date are required.");
      return;
    }
    if (form.platforms.length === 0) {
      setAlertMessage("Select at least one platform.");
      return;
    }

    if (mode === "create") {
      const id = `game_${Date.now().toString(36)}`;
      setGamesAction((prev) => [{ id, deleted: false, ...form }, ...prev]);
    } else if (editingId) {
      setGamesAction((prev) =>
        prev.map((g) => (g.id === editingId ? { ...g, ...form } : g)),
      );
    }
    closeEditor();
  }

  function confirmDelete() {
    if (!deleteId) return;
    setGamesAction((prev) =>
      prev.map((g) => (g.id === deleteId ? { ...g, deleted: true } : g)),
    );
    if (editingId === deleteId) closeEditor();
    setDeleteId(null);
  }

  if (mode !== "list") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-white/35">
              Catalog
            </p>
            <h2 className="mt-1 text-lg font-semibold text-white">
              {mode === "create" ? "Add Game" : "Edit Game"}
            </h2>
          </div>
          <button
            type="button"
            className="rounded-lg px-3 py-1.5 text-xs text-white/45 transition-colors hover:bg-white/5 hover:text-white/80"
            onClick={closeEditor}
          >
            ← Back to list
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl border border-white/8 bg-black/25 p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-xs text-white/45">
                Title
                <input
                  className="admin-input mt-1.5"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </label>
              <label className="block text-xs text-white/45">
                Developer
                <input
                  className="admin-input mt-1.5"
                  value={form.developer}
                  onChange={(e) =>
                    setForm({ ...form, developer: e.target.value })
                  }
                />
              </label>
              <label className="block text-xs text-white/45 md:col-span-2">
                Description
                <textarea
                  rows={3}
                  className="admin-input mt-1.5 resize-y"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </label>
              <label className="block text-xs text-white/45">
                Release date
                <input
                  type="date"
                  className="admin-input mt-1.5"
                  value={form.releaseDate}
                  onChange={(e) =>
                    setForm({ ...form, releaseDate: e.target.value })
                  }
                />
              </label>
              <label className="block text-xs text-white/45">
                Genre
                <select
                  className="admin-input mt-1.5"
                  value={form.genre}
                  onChange={(e) =>
                    setForm({ ...form, genre: e.target.value as Genre })
                  }
                >
                  {GENRES.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </label>

              <div className="md:col-span-2">
                <p className="text-xs text-white/45">Platforms</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PLATFORMS.map((platform) => {
                    const active = form.platforms.includes(platform);
                    return (
                      <button
                        key={platform}
                        type="button"
                        className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                          active
                            ? "border-[#8e0314] bg-[rgba(88,5,14,0.4)] text-white"
                            : "border-white/10 text-white/50 hover:border-white/25"
                        }`}
                        onClick={() => togglePlatform(platform)}
                      >
                        {platform}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="md:col-span-2">
                <p className="text-xs text-white/45">Tags</p>
                <GameTagSelector
                  tags={tags}
                  selectedIds={form.tagIds}
                  onChange={(tagIds) =>
                    setForm((prev) => ({ ...prev, tagIds }))
                  }
                />
              </div>

              <label className="block text-xs text-white/45">
                Cover image
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2 block w-full text-xs text-white/50 file:mr-3 file:rounded-md file:border-0 file:bg-[rgba(88,5,14,0.45)] file:px-3 file:py-1.5 file:text-xs file:text-white"
                  onChange={(e) =>
                    onImageChange("coverImage", e.target.files?.[0] ?? null)
                  }
                />
                {form.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.coverImage}
                    alt=""
                    className="mt-3 h-32 w-24 rounded-lg object-cover ring-1 ring-white/10"
                  />
                ) : null}
              </label>

              <label className="block text-xs text-white/45">
                Banner image
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2 block w-full text-xs text-white/50 file:mr-3 file:rounded-md file:border-0 file:bg-[rgba(88,5,14,0.45)] file:px-3 file:py-1.5 file:text-xs file:text-white"
                  onChange={(e) =>
                    onImageChange("bannerImage", e.target.files?.[0] ?? null)
                  }
                />
                {form.bannerImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.bannerImage}
                    alt=""
                    className="mt-3 h-24 w-full max-w-md rounded-lg object-cover ring-1 ring-white/10"
                  />
                ) : null}
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 border-t border-white/8 pt-5">
              <button
                type="button"
                className="glass-button rounded-lg px-5 py-2.5 text-sm font-medium"
                onClick={saveGame}
              >
                {mode === "create" ? "Create game" : "Save changes"}
              </button>
              {mode === "edit" && editingId ? (
                <button
                  type="button"
                  className="glass-button rounded-lg px-5 py-2.5 text-sm text-[#ffb4b4]"
                  onClick={() => setDeleteId(editingId)}
                >
                  Delete
                </button>
              ) : null}
            </div>
          </div>

          {mode === "edit" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/8 bg-black/25 p-4">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-white/35">
                    Avg rating
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight">
                    {stats.average.toFixed(1)}
                  </p>
                </div>
                <div className="rounded-xl border border-white/8 bg-black/25 p-4">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-white/35">
                    Reviews
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight">
                    {stats.count}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-white/8 bg-black/25 p-4">
                <p className="text-[11px] uppercase tracking-[0.12em] text-white/35">
                  Distribution
                </p>
                <div className="mt-3 space-y-2">
                  {[5, 4, 3, 2, 1].map((n) => {
                    const count =
                      stats.distribution[n as 1 | 2 | 3 | 4 | 5] ?? 0;
                    const pct =
                      stats.count === 0 ? 0 : (count / stats.count) * 100;
                    return (
                      <div key={n} className="flex items-center gap-3 text-xs">
                        <span className="w-6 text-white/45">{n}★</span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-[#8e0314]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-4 text-right text-white/40">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <TagCatalogPanel tags={tags} setTagsAction={setTagsAction} />
            </div>
          ) : (
            <div className="space-y-4">
              <TagCatalogPanel tags={tags} setTagsAction={setTagsAction} />
            </div>
          )}
        </div>

        <ConfirmDialog
          open={Boolean(deleteId)}
          title="Delete game"
          message="This will hide the game from the admin list (soft delete). Continue?"
          confirmLabel="Soft delete"
          destructive
          onCancel={() => setDeleteId(null)}
          onConfirm={confirmDelete}
        />

        <ConfirmDialog
          open={Boolean(alertMessage)}
          mode="alert"
          title="Missing information"
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
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-white">Game Catalog</h2>
          <p className="mt-0.5 text-xs text-white/40">
            {activeGames.length} active titles
          </p>
        </div>
        <button
          type="button"
          className="glass-button rounded-lg px-4 py-2 text-sm font-medium"
          onClick={openCreate}
        >
          Add Game
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {activeGames.map((game) => {
          const count = reviews.filter((r) => r.gameId === game.id).length;
          return (
            <article
              key={game.id}
              className="group overflow-hidden rounded-xl border border-white/8 bg-black/25 transition-colors hover:border-white/15"
            >
              <div className="relative h-40 overflow-hidden bg-[rgba(88,5,14,0.18)]">
                {game.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={game.coverImage}
                    alt=""
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : null}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-10">
                  <h3 className="font-semibold text-white">{game.title}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-[11px] uppercase tracking-[0.1em] text-white/35">
                  {game.genre} · {count} reviews
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-white/60">
                  {game.description}
                </p>
                <p className="mt-2 text-xs text-white/35">
                  {game.platforms.join(" · ")}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    className="glass-button flex-1 rounded-lg px-3 py-2 text-xs font-medium"
                    onClick={() => openEdit(game)}
                  >
                    Details
                  </button>
                  <button
                    type="button"
                    className="glass-button rounded-lg px-3 py-2 text-xs text-[#ffb4b4]"
                    onClick={() => setDeleteId(game.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete game"
        message="This will hide the game from the admin list (soft delete). Continue?"
        confirmLabel="Soft delete"
        destructive
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />

      <ConfirmDialog
        open={Boolean(alertMessage)}
        mode="alert"
        title="Missing information"
        message={alertMessage ?? ""}
        confirmLabel="OK"
        onCancel={() => setAlertMessage(null)}
        onConfirm={() => setAlertMessage(null)}
      />
    </div>
  );
}
