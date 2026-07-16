"use client";

import { useMemo, useState } from "react";

type GameTagSelectorProps = {
  tags: { id: string; name: string }[];
  selectedIds: string[];
  onChange: (tagIds: string[]) => void;
};

export function GameTagSelector({
  tags,
  selectedIds,
  onChange,
}: GameTagSelectorProps) {
  const [query, setQuery] = useState("");

  const selectedTags = useMemo(
    () => tags.filter((tag) => selectedIds.includes(tag.id)),
    [tags, selectedIds],
  );

  const filteredTags = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tags;
    return tags.filter((tag) => tag.name.toLowerCase().includes(q));
  }, [tags, query]);

  function toggleTag(tagId: string) {
    if (selectedIds.includes(tagId)) {
      onChange(selectedIds.filter((id) => id !== tagId));
    } else {
      onChange([...selectedIds, tagId]);
    }
  }

  function removeTag(tagId: string) {
    onChange(selectedIds.filter((id) => id !== tagId));
  }

  if (tags.length === 0) {
    return (
      <p className="mt-2 text-xs text-white/35">
        No tags are available in the database.
      </p>
    );
  }

  return (
    <div className="mt-2 space-y-3">
      {selectedTags.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {selectedTags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 rounded-lg border border-[#8e0314]/45 bg-[rgba(88,5,14,0.35)] py-1 pl-2.5 pr-1 text-xs text-white"
            >
              {tag.name}
              <button
                type="button"
                aria-label={`Remove ${tag.name}`}
                className="rounded-md p-0.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                onClick={() => removeTag(tag.id)}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-3.5"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M8 8l8 8M16 8l-8 8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </span>
          ))}
          <button
            type="button"
            className="text-[11px] text-white/40 transition-colors hover:text-white/70"
            onClick={() => onChange([])}
          >
            Clear all
          </button>
        </div>
      ) : (
        <p className="text-[11px] text-white/35">No tags selected</p>
      )}

      <div className="overflow-hidden rounded-lg border border-white/10 bg-black/30">
        <div className="border-b border-white/8 p-2">
          <input
            className="admin-input py-2 text-xs"
            placeholder="Search tags…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <ul className="max-h-44 overflow-y-auto p-1.5">
          {filteredTags.length === 0 ? (
            <li className="px-2 py-4 text-center text-xs text-white/40">
              No tags match &ldquo;{query}&rdquo;
            </li>
          ) : (
            filteredTags.map((tag) => {
              const checked = selectedIds.includes(tag.id);
              return (
                <li key={tag.id}>
                  <label className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors hover:bg-white/[0.04]">
                    <input
                      type="checkbox"
                      className="size-3.5 shrink-0 accent-[#8e0314]"
                      checked={checked}
                      onChange={() => toggleTag(tag.id)}
                    />
                    <span className={checked ? "text-white" : "text-white/70"}>
                      {tag.name}
                    </span>
                  </label>
                </li>
              );
            })
          )}
        </ul>
        <div className="border-t border-white/8 px-3 py-2 text-[11px] text-white/35">
          {selectedIds.length} of {tags.length} selected
        </div>
      </div>
    </div>
  );
}
