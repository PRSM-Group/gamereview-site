import Image from "next/image";
import { resolveImageSrc } from "@/lib/image-src";

export default function GameHero({ bannerImage }: { bannerImage: string }) {
  return (
    <div className="relative h-96 w-full bg-black">
      <Image
        src={resolveImageSrc(bannerImage)}
        alt="Game Banner"
        fill
        priority
        className="object-cover object-top"
      />

      <div className="absolute inset-x-0 bottom-0 h-2/4 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
    </div>
  );
}
