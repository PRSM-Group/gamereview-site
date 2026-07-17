import { Skeleton } from "@/components/ui/Skeleton";
import { SiteHeaderSkeleton } from "@/components/skeletons/SiteHeaderSkeleton";

function ReviewCardSkeleton() {
  return (
    <div className="glass-card flex gap-5 rounded-[15px] p-5 md:gap-6 md:p-6">
      <Skeleton className="h-[188px] w-[132px] shrink-0 rounded-[10px]" />
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex justify-between gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-6 w-3/4 max-w-[280px]" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

function TopGameCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-[3/4] w-full rounded-[12px]" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export function HomePageSkeleton() {
  return (
    <div className="min-h-full bg-[#070000] text-white">
      <SiteHeaderSkeleton />
      <main>
        <section className="relative overflow-hidden">
          <div className="relative z-10 mx-auto grid max-w-[1280px] gap-10 px-4 pb-24 pt-16 md:grid-cols-[minmax(0,1.15fr)_minmax(280px,379px)] md:items-start md:gap-12 md:px-12 md:pb-32 md:pt-[156px]">
            <div className="max-w-[735px] space-y-6 md:space-y-8">
              <Skeleton className="h-12 w-full max-w-[620px] md:h-16" />
              <Skeleton className="h-12 w-full max-w-[520px] md:h-14" />
              <Skeleton className="mt-4 h-6 w-full max-w-[480px]" />
              <Skeleton className="mt-4 h-6 w-full max-w-[400px]" />
              <Skeleton className="mt-6 h-14 w-[181px] rounded-[10px] md:mt-8" />
            </div>
            <div className="relative mx-auto w-full max-w-[385px] space-y-5 md:mx-0">
              <Skeleton className="h-[220px] w-[calc(100%-1.75rem)] rounded-[20px]" />
              <Skeleton className="ml-20 h-[220px] w-[calc(100%-1.75rem)] rounded-[20px]" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-6 pb-16 pt-8 md:px-[105px] md:pb-20 md:pt-12">
          <Skeleton className="mb-8 h-9 w-56 md:mb-10" />
          <div className="grid gap-5 md:grid-cols-2 md:gap-6">
            <ReviewCardSkeleton />
            <ReviewCardSkeleton />
            <ReviewCardSkeleton />
            <ReviewCardSkeleton />
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-6 pb-24 md:px-[105px] md:pb-32">
          <Skeleton className="mb-8 h-9 w-40 md:mb-10" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            <TopGameCardSkeleton />
            <TopGameCardSkeleton />
            <TopGameCardSkeleton />
            <TopGameCardSkeleton />
          </div>
        </section>
      </main>
    </div>
  );
}
