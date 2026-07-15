import Image from "next/image";

type StarRatingProps = {
  rating: number;
  size?: number;
};

export function StarRating({ rating, size = 18 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={`relative overflow-hidden ${index < rating ? "opacity-100" : "opacity-25"}`}
          style={{ width: size, height: size }}
        >
          <Image
            src="/images/star.png"
            alt=""
            width={size}
            height={size}
            className="size-full object-contain"
          />
        </span>
      ))}
    </div>
  );
}
