"use client";

type PaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  label?: string;
};

export function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize = 15,
  onPageChange,
  label = "Pages",
}: PaginationProps) {
  if (totalItems <= pageSize) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label={label}
      className="flex flex-wrap items-center justify-center gap-2 pt-2"
    >
      <button
        type="button"
        disabled={page <= 1}
        className="rounded-lg px-3 py-1.5 text-xs text-white/50 transition-colors hover:bg-white/5 hover:text-white/85 disabled:opacity-30 disabled:hover:bg-transparent"
        onClick={() => onPageChange(Math.max(1, page - 1))}
      >
        Prev
      </button>
      {pages.map((pageNum) => (
        <button
          key={pageNum}
          type="button"
          aria-current={pageNum === page ? "page" : undefined}
          className={`min-w-9 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            pageNum === page
              ? "bg-[rgba(88,5,14,0.55)] text-white"
              : "bg-white/5 text-white/55 hover:bg-white/10 hover:text-white/85"
          }`}
          onClick={() => onPageChange(pageNum)}
        >
          {pageNum}
        </button>
      ))}
      <button
        type="button"
        disabled={page >= totalPages}
        className="rounded-lg px-3 py-1.5 text-xs text-white/50 transition-colors hover:bg-white/5 hover:text-white/85 disabled:opacity-30 disabled:hover:bg-transparent"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
      >
        Next
      </button>
    </nav>
  );
}
