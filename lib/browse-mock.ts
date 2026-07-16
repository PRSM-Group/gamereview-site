import { GENRES, type Genre } from "@/lib/admin-mock";

export { GENRES };
export type { Genre };

export const TAGS = [
  "Co-op",
  "Multiplayer",
  "Singleplayer",
  "Indie",
  "Early Access",
  "Story-rich",
  "Open World",
  "Competitive",
] as const;

export type Tag = (typeof TAGS)[number];

export type SortOption = "reviews" | "rating";

export type BrowseGame = {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  bannerImage: string;
  rating: number;
  reviewCount: number;
  genre: Genre;
  tags: Tag[];
};

export type FeaturedBanner = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  gameId: string;
};

export const browseGames: BrowseGame[] = [
  {
    id: "game_repo",
    title: "R.E.P.O.",
    description:
      "Chaotic co-op retrieval missions packed with loud failures and louder victories.",
    coverImage: "/images/browse-game.png",
    bannerImage: "/images/browse-game.png",
    rating: 4.8,
    reviewCount: 128,
    genre: "HORROR",
    tags: ["Co-op", "Multiplayer", "Early Access"],
  },
  {
    id: "game_nightfall",
    title: "Nightfall Protocol",
    description:
      "A tactical night-ops shooter where information is scarce and every mistake is loud.",
    coverImage: "/images/review-cover.png",
    bannerImage: "/images/review-cover.png",
    rating: 4.5,
    reviewCount: 86,
    genre: "SHOOTER",
    tags: ["Singleplayer", "Story-rich"],
  },
  {
    id: "game_ember",
    title: "Ember Circuit",
    description:
      "Neon racing through collapsing city circuits with high-risk boost routes.",
    coverImage: "/images/browse-game.png",
    bannerImage: "/images/browse-game.png",
    rating: 4.2,
    reviewCount: 54,
    genre: "RACING",
    tags: ["Competitive", "Multiplayer"],
  },
  {
    id: "game_hollow",
    title: "Hollow Signal",
    description:
      "A slow-burn survival mystery about transmission, isolation, and what answers after dark.",
    coverImage: "/images/review-cover.png",
    bannerImage: "/images/review-cover.png",
    rating: 4.9,
    reviewCount: 203,
    genre: "ADVENTURE",
    tags: ["Singleplayer", "Story-rich", "Indie"],
  },
  {
    id: "game_ashreach",
    title: "Ashreach",
    description:
      "Build outposts across a scorched frontier while rival clans contest every scrap of land.",
    coverImage: "/images/browse-game.png",
    bannerImage: "/images/browse-game.png",
    rating: 4.1,
    reviewCount: 67,
    genre: "STRATEGY",
    tags: ["Multiplayer", "Open World"],
  },
  {
    id: "game_drift",
    title: "Drift Syntax",
    description:
      "An indie puzzle-platformer about rewiring gravity and rewriting your last mistake.",
    coverImage: "/images/review-cover.png",
    bannerImage: "/images/review-cover.png",
    rating: 4.6,
    reviewCount: 41,
    genre: "INDIE",
    tags: ["Singleplayer", "Indie"],
  },
];

export const featuredBanners: FeaturedBanner[] = [
  {
    id: "banner_1",
    title: "R.E.P.O.",
    subtitle: "Co-op chaos at its loudest — grab your friends and extract or scream.",
    image: "/images/browse-game.png",
    gameId: "game_repo",
  },
  {
    id: "banner_2",
    title: "Hollow Signal",
    subtitle: "A quiet horror mystery that refuses to let you breathe.",
    image: "/images/review-cover.png",
    gameId: "game_hollow",
  },
  {
    id: "banner_3",
    title: "Nightfall Protocol",
    subtitle: "When the lights die, only clean tactics keep you alive.",
    image: "/images/browse-game.png",
    gameId: "game_nightfall",
  },
  {
    id: "banner_4",
    title: "Ember Circuit",
    subtitle: "Race the neon collapse before the track burns out.",
    image: "/images/review-cover.png",
    gameId: "game_ember",
  },
  {
    id: "banner_5",
    title: "Ashreach",
    subtitle: "Claim the frontier, or watch rivals turn the ash against you.",
    image: "/images/browse-game.png",
    gameId: "game_ashreach",
  },
];

export function filterAndSortGames(
  games: BrowseGame[],
  query: string,
  genres: Genre[],
  tags: Tag[],
  sort: SortOption,
): BrowseGame[] {
  const normalized = query.trim().toLowerCase();

  let result = games.filter((game) => {
    const matchesQuery =
      !normalized ||
      game.title.toLowerCase().includes(normalized) ||
      game.description.toLowerCase().includes(normalized);

    const matchesGenre =
      genres.length === 0 || genres.includes(game.genre);

    const matchesTags =
      tags.length === 0 || tags.some((tag) => game.tags.includes(tag));

    return matchesQuery && matchesGenre && matchesTags;
  });

  result = [...result].sort((a, b) => {
    if (sort === "reviews") return b.reviewCount - a.reviewCount;
    return b.rating - a.rating;
  });

  return result;
}
