import Image from "next/image";
import type { LandingReview } from "@/lib/landing-data";
import { StarRating } from "@/components/StarRating";

type ReviewCardProps = {
  review: LandingReview;
};

export function ReviewCard({ review }: ReviewCardProps) {
  const snippet =
    review.content.length > 180
      ? `${review.content.slice(0, 180).trimEnd()}... `
      : `${review.content} `;

  return (
    <article className="glass-card flex gap-5 rounded-[15px] p-5 md:gap-6 md:p-6">
      {review.coverImage ? (
        <div className="relative h-[188px] w-[132px] shrink-0 overflow-hidden rounded-[10px]">
          <Image
            src={review.coverImage}
            alt=""
            fill
            className="object-cover"
            sizes="132px"
          />
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mb-2 flex items-start justify-between gap-3">
          <StarRating rating={review.rating} />
          <p className="shrink-0 text-right text-sm text-[#997777]">
            {review.authorName}
          </p>
        </div>

        <h3 className="font-kumbh text-lg font-semibold text-white">
          {review.title}
        </h3>

        <p className="mt-2 font-kumbh text-sm leading-normal text-white">
          {snippet}
          <a href="#" className="text-[#8e0314] hover:underline">
            See More
          </a>
        </p>
      </div>
    </article>
  );
}
