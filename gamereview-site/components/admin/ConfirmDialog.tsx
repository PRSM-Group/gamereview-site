"use client";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0c0505] p-6 shadow-2xl shadow-black/50">
        <h3 className="font-kumbh text-lg font-semibold text-white">{title}</h3>
        <p className="mt-3 font-kumbh text-sm leading-relaxed text-white/65">
          {message}
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-lg px-4 py-2 text-sm text-white/55 transition-colors hover:bg-white/5 hover:text-white/85"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="glass-button rounded-lg px-4 py-2 text-sm text-[#ffb4b4]"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
