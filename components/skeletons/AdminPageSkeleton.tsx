import { Skeleton } from "@/components/ui/Skeleton";
import { SITE_NAME } from "@/lib/seed-data";

export function AdminPageSkeleton() {
  return (
    <div className="admin-shell flex min-h-full text-white">
      <aside className="admin-sidebar flex w-[240px] shrink-0 flex-col max-md:hidden">
        <div className="border-b border-white/8 px-5 py-6">
          <p className="font-jersey text-[28px] leading-none tracking-wide">
            {SITE_NAME}
          </p>
          <Skeleton className="mt-2 h-3 w-28" />
        </div>
        <div className="space-y-2 px-3 py-5">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-white/8 px-5 py-4 md:px-8">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="mt-2 h-8 w-48" />
        </header>
        <main className="admin-panel m-4 flex-1 p-4 md:m-6 md:p-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
