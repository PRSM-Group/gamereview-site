"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createTagAction,
  deleteTagAction,
  updateTagAction,
} from "@/actions/tag";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Pagination } from "@/components/ui/Pagination";
import { PAGE_SIZE, paginateItems, totalPagesFor } from "@/lib/pagination";
import type { TagSummary } from "@/services/tag.service";

type TagCatalogPanelProps = {
  tags: TagSummary[];
};

export function TagCatalogPanel({ tags }: TagCatalogPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const totalPages = totalPagesFor(tags.length);
  const pageTags = useMemo(() => paginateItems(tags, page), [tags, page]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  function addTag() {
    const name = newName.trim();
    if (!name) {
      setAlertMessage("Enter a tag name.");
      return;
    }
    if (tags.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
      setAlertMessage("A tag with this name already exists.");
      return;
    }
    startTransition(async () => {
      try {
        const result = await createTagAction({ name });
        if (!result.success) {
          setAlertMessage(result.message);
          return;
        }
        setNewName("");
        router.refresh();
      } catch {
        setAlertMessage("Unable to create the tag.");
      }
    });
  }

  function startEdit(tag: TagSummary) {
    setEditingId(tag.id);
    setEditName(tag.name);
  }

  function saveEdit() {
    if (!editingId) return;
    const name = editName.trim();
    if (!name) {
      setAlertMessage("Tag name cannot be empty.");
      return;
    }
    if (
      tags.some(
        (t) =>
          t.id !== editingId && t.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      setAlertMessage("A tag with this name already exists.");
      return;
    }
    startTransition(async () => {
      try {
        const result = await updateTagAction(editingId, { name });
        if (!result.success) {
          setAlertMessage(result.message);
          return;
        }
        setEditingId(null);
        setEditName("");
        router.refresh();
      } catch {
        setAlertMessage("Unable to update the tag.");
      }
    });
  }

  function confirmDelete() {
    if (!deleteId) return;
    const id = deleteId;
    startTransition(async () => {
      try {
        const result = await deleteTagAction(id);
        if (!result.success) {
          setAlertMessage(result.message);
          return;
        }
        if (editingId === id) {
          setEditingId(null);
          setEditName("");
        }
        setDeleteId(null);
        router.refresh();
      } catch {
        setAlertMessage("Unable to delete the tag.");
      }
    });
  }

  return (
    <>
      <div className="rounded-xl border border-white/8 bg-black/25 p-4">
        <h4 className="text-sm font-semibold text-white">Tag Catalog</h4>
        <p className="mt-1 text-xs text-white/40">
          {tags.length} tags
          {tags.length > PAGE_SIZE ? ` · page ${page} of ${totalPages}` : ""}
        </p>
        <div className="mt-4 flex gap-2">
          <input
            className="admin-input flex-1"
            placeholder="New tag name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <button
            type="button"
            disabled={isPending}
            className="glass-button shrink-0 rounded-lg px-3 py-2 text-xs font-medium"
            onClick={addTag}
          >
            {isPending ? "Saving…" : "Add"}
          </button>
        </div>

        <ul className="mt-4 max-h-[280px] space-y-2 overflow-y-auto">
          {tags.length === 0 ? (
            <li className="text-xs text-white/40">No tags yet.</li>
          ) : (
            pageTags.map((tag) => (
              <li
                key={tag.id}
                className="flex items-center gap-2 rounded-lg border border-white/6 bg-white/[0.02] px-3 py-2"
              >
                {editingId === tag.id ? (
                  <>
                    <input
                      className="admin-input flex-1 py-1.5 text-xs"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          saveEdit();
                        }
                        if (e.key === "Escape") {
                          setEditingId(null);
                          setEditName("");
                        }
                      }}
                      autoFocus
                    />
                    <button
                      type="button"
                      disabled={isPending}
                      className="text-[11px] text-white/70 hover:text-white"
                      onClick={saveEdit}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      className="text-[11px] text-white/40 hover:text-white/70"
                      onClick={() => {
                        setEditingId(null);
                        setEditName("");
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm text-white/85">
                      {tag.name}
                    </span>
                    <button
                      type="button"
                      disabled={isPending}
                      className="text-[11px] text-white/45 hover:text-white/80"
                      onClick={() => startEdit(tag)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      className="text-[11px] text-[#ffb4b4]"
                      onClick={() => setDeleteId(tag.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))
          )}
        </ul>

        <div className="mt-4">
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={tags.length}
            onPageChange={setPage}
            label="Admin tag pages"
          />
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete tag"
        message="Remove this tag from the global catalog? Games using it will need reassignment later."
        confirmLabel="Delete tag"
        destructive
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />

      <ConfirmDialog
        open={Boolean(alertMessage)}
        mode="alert"
        title="Tag catalog"
        message={alertMessage ?? ""}
        confirmLabel="OK"
        onCancel={() => setAlertMessage(null)}
        onConfirm={() => setAlertMessage(null)}
      />
    </>
  );
}
