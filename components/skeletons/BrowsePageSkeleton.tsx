import { Skeleton } from "@/components/ui/Skeleton";
import { SiteHeaderSkeleton } from "@/components/skeletons/SiteHeaderSkeleton";

function GameResultSkeleton() {
  return (
    <article className="flex overflow-hidden rounded-[12px] bg-[rgba(88,5,14,0.41)]">
      <Skeleton className="w-[140px] shrink-0 self-stretch sm:w-[257px]" />
      <div className="flex min-w-0 flex-1 flex-col gap-3 px-4 py-3 sm:px-5 sm:py-4">
        <Skeleton className="h-7 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </article>
  );
}

export function BrowsePageSkeleton() {
  return (
    <div className="min-h-full bg-[#070000] text-white">
      <SiteHeaderSkeleton />
      <main className="mx-auto max-w-[1280px] px-6 pb-16 pt-8 md:px-[113px] md:pt-10">
        <Skeleton className="h-[240px] w-full rounded-[16px] md:h-[375px]" />
        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_210px]">
          <div className="space-y-4">
            <Skeleton className="h-[46px] w-full rounded-[15px]" />
            <GameResultSkeleton />
            <GameResultSkeleton />
            <GameResultSkeleton />
          </div>
          <aside className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </aside>
        </div>
      </main>
    </div>
  );
}
