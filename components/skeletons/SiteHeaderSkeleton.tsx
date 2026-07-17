import { Skeleton } from "@/components/ui/Skeleton";
import { SITE_NAME } from "@/lib/seed-data";

export function SiteHeaderSkeleton() {
  return (
    <header className="relative z-50 border-b border-white/15">
      <div className="relative mx-auto flex h-[79px] max-w-[1280px] items-center justify-between px-6 md:px-[35px]">
        <Skeleton className="h-[30px] w-[26px] rounded-sm" />
        <span className="font-jersey text-[32px] leading-none tracking-wide text-white/90 md:text-[40px]">
          {SITE_NAME}
        </span>
        <Skeleton className="h-9 w-20 rounded-lg" />
      </div>
    </header>
  );
}
