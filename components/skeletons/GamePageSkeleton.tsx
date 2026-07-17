import { Skeleton } from "@/components/ui/Skeleton";
import { SiteHeaderSkeleton } from "@/components/skeletons/SiteHeaderSkeleton";

export function GamePageSkeleton() {
  return (
    <div className="min-h-full bg-[#070000] text-white">
      <SiteHeaderSkeleton />
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <Skeleton className="h-5 w-24" />
      </div>
      <div className="mx-auto px-6 pb-16 pt-2 md:px-[113px]">
        <Skeleton className="h-[280px] w-full rounded-lg md:h-[360px]" />
        <div className="flex gap-6 p-8 pb-4">
          <Skeleton className="h-72 w-60 shrink-0 rounded" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        </div>
        <div className="space-y-4 p-8 pt-2">
          <Skeleton className="h-[200px] w-full rounded-[15px]" />
          <Skeleton className="h-[200px] w-full rounded-[15px]" />
        </div>
      </div>
    </div>
  );
}
