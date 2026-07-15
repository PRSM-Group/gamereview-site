import type { LandingReview } from "@/lib/landing-data";
import { HeroReviewTilt } from "@/components/HeroReviewTilt";
import { StarRating } from "@/components/StarRating";
import { seedHeroSecondaryReview } from "@/lib/seed-data";

type HeroSectionProps = {
  featuredReview: LandingReview;
};

function HeroReviewCard({
  review,
  className,
}: {
  review: LandingReview;
  className?: string;
}) {
  return (
    <HeroReviewTilt
      className={`glass-card hero-review-card rounded-[20px] p-6 md:p-7 ${className ?? ""}`}
    >
      <div className="flex items-center justify-between gap-3">
        <StarRating rating={review.rating} />
        <p className="font-kumbh text-sm text-[#997777]">{review.authorName}</p>
      </div>

      <h2 className="mt-4 font-kumbh text-xl font-semibold text-white">
        {review.title}
      </h2>

      <p className="mt-4 font-kumbh text-sm leading-relaxed text-white/90 md:text-base">
        {review.content}
      </p>
    </HeroReviewTilt>
  );
}

export function HeroSection({ featuredReview }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="hero-orb hero-orb-a left-[-6%] top-[12%] h-[280px] w-[280px] md:left-[1%] md:h-[340px] md:w-[340px]"
      />
      <div
        aria-hidden="true"
        className="hero-orb hero-orb-b right-[-4%] top-[28%] h-[220px] w-[220px] md:right-[6%] md:top-[18%] md:h-[300px] md:w-[300px]"
      />
      <div
        aria-hidden="true"
        className="hero-orb hero-orb-c bottom-[8%] left-[42%] h-[180px] w-[180px] md:bottom-[12%] md:h-[240px] md:w-[240px]"
      />

      <div className="relative z-10 mx-auto grid max-w-[1280px] gap-10 px-4 pb-24 pt-16 md:grid-cols-[minmax(0,1.15fr)_minmax(280px,379px)] md:items-start md:gap-12 md:px-12 md:pb-32 md:pt-[156px]">
        <div className="max-w-[735px]">
          <h1 className="hero-headline-gradient animate-fade-up font-unbounded text-[38px] font-normal leading-tight tracking-[-2px] md:text-[52px]">
            YOUR NEXT GAMING OBSESSION STARTS HERE.
          </h1>

          <p className="animate-fade-up animate-delay-1 mt-8 max-w-[540px] font-kumbh text-lg text-white md:mt-10 md:text-2xl">
            We play the bugs, endure the grinds, and celebrate the masterpieces
            so you don&apos;t waste your time or money.
          </p>

          <a
            href="#recent-reviews"
            className="glass-button animate-fade-up animate-delay-2 mt-10 inline-flex h-14 w-[181px] items-center justify-center rounded-[10px] font-kumbh text-base font-semibold text-white md:mt-14"
          >
            GET STARTED
          </a>
        </div>

        <div className="relative mx-auto w-full max-w-[385px] md:mx-0">
          <HeroReviewCard
            review={featuredReview}
            className="animate-fade-in animate-delay-1 relative z-20 w-[calc(100%-1.75rem)]"
          />
          <HeroReviewCard
            review={seedHeroSecondaryReview}
            className="animate-fade-in animate-delay-2 relative z-10 mt-5 ml-20 w-[calc(100%-1.75rem)]"
          />
        </div>
      </div>
    </section>
  );
}
