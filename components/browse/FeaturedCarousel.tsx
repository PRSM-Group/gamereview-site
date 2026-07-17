"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { FeaturedBanner } from "@/lib/browse-mock";
import { resolveImageSrc } from "@/lib/image-src";

const INTERVAL_MS = 4500;

type FeaturedCarouselProps = {
  banners: FeaturedBanner[];
};

export function FeaturedCarousel({ banners }: FeaturedCarouselProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;

    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <div className="relative h-[240px] w-full overflow-hidden rounded-[16px] md:h-[375px]">
      {banners.map((banner, i) => {
        const active = i === index;

        return (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              active ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={!active}
          >
            <Image
              src={resolveImageSrc(banner.image)}
              alt={banner.title}
              fill
              priority={i === 0}
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1054px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
            <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
              <h2 className="mt-2 font-kumbh text-2xl font-bold text-white md:text-4xl">
                {banner.title}
              </h2>
              <p className="mt-2 max-w-xl font-kumbh text-sm text-white/75 md:text-base">
                {banner.subtitle}
              </p>
              <Link
                href={`/games/${banner.gameId}`}
                className="glass-button mt-4 inline-flex rounded-[10px] px-4 py-2 text-sm font-semibold text-white"
              >
                View Game
              </Link>
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-4 right-4 flex gap-2 md:bottom-6 md:right-6">
        {banners.map((banner, i) => (
          <button
            key={banner.id}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-6 bg-white" : "w-2 bg-white/35 hover:bg-white/55"
            }`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
