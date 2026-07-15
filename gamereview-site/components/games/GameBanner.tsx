import Image from "next/image";

export default function GameHero({ bannerImage }: { bannerImage: string }) {
  return (
    <div className="relative w-full h-64 md:h-96 bg-black">
      <Image
        src={bannerImage}
        alt="Game Banner"
        fill
        priority
        className="object-cover object-top"
      />

      <div className="absolute inset-x-0 bottom-0 h-2/4 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
    </div>
  );
}
