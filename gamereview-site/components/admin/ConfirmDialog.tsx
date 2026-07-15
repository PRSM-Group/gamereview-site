"use client";

import { useEffect } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Single OK button — for validation / notices */
  mode?: "confirm" | "alert";
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  mode = "confirm",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }

    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
      onClick={onCancel}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="admin-dialog-title"
        aria-describedby="admin-dialog-desc"
        className="relative w-full max-w-[400px] overflow-hidden rounded-2xl border border-white/10 bg-[#0e0606] shadow-[0_24px_80px_rgba(0,0,0,0.65)] animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`h-1 w-full ${
            destructive || mode === "confirm"
              ? "bg-gradient-to-r from-[#8e0314] via-[#58050e] to-transparent"
              : "bg-gradient-to-r from-white/25 via-white/10 to-transparent"
          }`}
        />

        <div className="p-6">
          <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-[rgba(88,5,14,0.35)] text-[#ff8f8f] ring-1 ring-[#8e0314]/35">
            {mode === "alert" ? (
              <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                <path
                  d="M12 8v5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="16" r="1" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
                <path
                  d="M12 9v4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M10.3 4.8 2.9 17.2A2 2 0 0 0 4.6 20h14.8a2 2 0 0 0 1.7-2.8L13.7 4.8a2 2 0 0 0-3.4 0Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="16.5" r="1" fill="currentColor" />
              </svg>
            )}
          </div>

          <h3
            id="admin-dialog-title"
            className="font-kumbh text-lg font-semibold tracking-tight text-white"
          >
            {title}
          </h3>
          <p
            id="admin-dialog-desc"
            className="mt-2 font-kumbh text-sm leading-relaxed text-white/60"
          >
            {message}
          </p>

          <div className="mt-6 flex justify-end gap-2">
            {mode === "confirm" ? (
              <button
                type="button"
                className="rounded-lg px-4 py-2.5 text-sm text-white/50 transition-colors hover:bg-white/5 hover:text-white/85"
                onClick={onCancel}
              >
                {cancelLabel}
              </button>
            ) : null}
            <button
              type="button"
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                destructive
                  ? "bg-[rgba(142,3,20,0.55)] text-white hover:bg-[rgba(142,3,20,0.7)]"
                  : "glass-button text-white"
              }`}
              onClick={onConfirm}
              autoFocus
            >
              {mode === "alert" ? confirmLabel || "OK" : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
