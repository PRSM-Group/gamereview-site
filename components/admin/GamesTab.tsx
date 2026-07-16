"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createGameAction,
  deleteGameAction,
  updateGameAction,
} from "@/actions/game";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { GameTagSelector } from "@/components/admin/GameTagSelector";
import {
  Genre,
  Platform,
  type Genre as GenreValue,
  type Platform as PlatformValue,
} from "@/generated/prisma/browser";

const GENRES = Object.values(Genre);
const PLATFORMS = Object.values(Platform);

export type AdminGame = {
  id: string;
  title: string;
  description: string;
  developer: string;
  releaseDate: string;
  coverImage: string;
  bannerImage: string;
  genres: GenreValue[];
  platforms: PlatformValue[];
  tagIds: string[];
  reviewCount: number;
  averageRating: number;
};

export type AdminTag = {
  id: string;
  name: string;
};

type GamesTabProps = {
  games: AdminGame[];
  tags: AdminTag[];
};

type FormState = Omit<AdminGame, "id" | "reviewCount" | "averageRating">;

function emptyGameForm(): FormState {
  return {
    title: "",
    description: "",
    developer: "",
    releaseDate: "",
    coverImage: "",
    bannerImage: "",
    genres: [Genre.ACTION],
    platforms: [Platform.PC],
    tagIds: [],
  };
}

export function GamesTab({ games, tags }: GamesTabProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyGameForm());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const editingGame = games.find((game) => game.id === editingId);

  function openCreate() {
    setMode("create");
    setEditingId(null);
    setForm(emptyGameForm());
  }

  function openEdit(game: AdminGame) {
    setMode("edit");
    setEditingId(game.id);
    setForm({
      title: game.title,
      description: game.description,
      developer: game.developer,
      releaseDate: game.releaseDate,
      coverImage: game.coverImage,
      bannerImage: game.bannerImage,
      genres: [...game.genres],
      platforms: [...game.platforms],
      tagIds: [...game.tagIds],
    });
  }

  function closeEditor() {
    setMode("list");
    setEditingId(null);
    setForm(emptyGameForm());
  }

  function toggleGenre(genre: GenreValue) {
    setForm((previous) => {
      const selected = previous.genres.includes(genre);

      return {
        ...previous,
        genres: selected
          ? previous.genres.filter((item) => item !== genre)
          : [...previous.genres, genre],
      };
    });
  }

  function togglePlatform(platform: PlatformValue) {
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

  function saveGame() {
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.developer.trim() ||
      !form.releaseDate ||
      !form.coverImage.trim() ||
      !form.bannerImage.trim()
    ) {
      setAlertMessage("Complete all game and image fields.");
      return;
    }
    if (form.genres.length === 0) {
      setAlertMessage("Select at least one genre.");
      return;
    }
    if (form.platforms.length === 0) {
      setAlertMessage("Select at least one platform.");
      return;
    }
    if (form.tagIds.length === 0) {
      setAlertMessage("Select at least one tag.");
      return;
    }

    startTransition(async () => {
      try {
        const data = {
          ...form,
          releaseDate: new Date(`${form.releaseDate}T00:00:00`),
        };
        const result =
          mode === "create"
            ? await createGameAction(data)
            : editingId
              ? await updateGameAction(editingId, data)
              : null;

        if (!result?.success) {
          setAlertMessage(result?.message ?? "Unable to save the game.");
          return;
        }

        closeEditor();
        router.refresh();
      } catch {
        setAlertMessage("Unable to save the game.");
      }
    });
  }

  function confirmDelete() {
    if (!deleteId) return;

    const id = deleteId;
    startTransition(async () => {
      try {
        const result = await deleteGameAction(id);

        if (!result.success) {
          setAlertMessage(result.message);
          return;
        }

        if (editingId === id) closeEditor();
        setDeleteId(null);
        router.refresh();
      } catch {
        setAlertMessage("Unable to delete the game.");
      }
    });
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
              <div className="md:col-span-2">
                <p className="text-xs text-white/45">Genres</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {GENRES.map((genre) => {
                    const active = form.genres.includes(genre);

                    return (
                      <button
                        key={genre}
                        type="button"
                        className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                          active
                            ? "border-[#8e0314] bg-[rgba(88,5,14,0.4)] text-white"
                            : "border-white/10 text-white/50 hover:border-white/25"
                        }`}
                        onClick={() => toggleGenre(genre)}
                      >
                        {genre}
                      </button>
                    );
                  })}
                </div>
              </div>

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
                Cover image URL
                <input
                  className="admin-input mt-1.5"
                  value={form.coverImage}
                  placeholder="/images/cover.jpg or https://…"
                  onChange={(e) =>
                    setForm({ ...form, coverImage: e.target.value })
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
                Banner image URL
                <input
                  className="admin-input mt-1.5"
                  value={form.bannerImage}
                  placeholder="/images/banner.jpg or https://…"
                  onChange={(e) =>
                    setForm({ ...form, bannerImage: e.target.value })
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
                disabled={isPending}
                className="glass-button rounded-lg px-5 py-2.5 text-sm font-medium"
                onClick={saveGame}
              >
                {isPending
                  ? "Saving…"
                  : mode === "create"
                    ? "Create game"
                    : "Save changes"}
              </button>
              {mode === "edit" && editingId ? (
                <button
                  type="button"
                  disabled={isPending}
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
                    {(editingGame?.averageRating ?? 0).toFixed(1)}
                  </p>
                </div>
                <div className="rounded-xl border border-white/8 bg-black/25 p-4">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-white/35">
                    Reviews
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight">
                    {editingGame?.reviewCount ?? 0}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <ConfirmDialog
          open={Boolean(deleteId)}
          title="Delete game"
          message="This permanently deletes the game. Continue?"
          confirmLabel="Delete"
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
          <p className="mt-0.5 text-xs text-white/40">{games.length} titles</p>
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
        {games.map((game) => {
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
                  {game.genres.join(" · ")} · {game.reviewCount} reviews
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
        message="This permanently deletes the game. Continue?"
        confirmLabel="Delete"
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
