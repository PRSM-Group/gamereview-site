import Image from "next/image";

type Game = {
  id: string;
  title: string;
  coverImage: string;
};

export function ProfileLikedGames({ games }: { games: Game[] }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <h2 className="text-xl font-black tracking-wider uppercase text-gray-100">
          Liked Games
        </h2>
        <a
          href="#"
          className="text-xs font-bold tracking-widest text-red-700 hover:text-red-500 transition-colors uppercase"
        >
          View All &gt;
        </a>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {games.map((game) => (
          <div
            key={game.id}
            className="aspect-[3/4] rounded-lg overflow-hidden border border-white/5 shadow-lg group cursor-pointer relative"
          >
            <Image
              src={game.coverImage}
              alt={game.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
