export const GENRES = [
  "ACTION",
  "ADVENTURE",
  "RPG",
  "SHOOTER",
  "STRATEGY",
  "SIMULATION",
  "SPORTS",
  "RACING",
  "HORROR",
  "INDIE",
  "OTHER",
] as const;

export const PLATFORMS = [
  "PC",
  "PLAYSTATION",
  "XBOX",
  "NINTENDO",
  "MOBILE",
  "OTHER",
] as const;

export const ROLES = ["USER", "ADMIN"] as const;

export type Genre = (typeof GENRES)[number];
export type Platform = (typeof PLATFORMS)[number];
export type Role = (typeof ROLES)[number];

export type MockReview = {
  id: string;
  title: string;
  content: string;
  rating: number;
  authorId: string;
  authorName: string;
  gameId: string;
  flagCount: number;
  createdAt: string;
};

export type MockUser = {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: Role;
  createdAt: string;
};

export type MockGame = {
  id: string;
  title: string;
  description: string;
  developer: string;
  releaseDate: string;
  coverImage: string | null;
  bannerImage: string | null;
  genre: Genre;
  platforms: Platform[];
  tagIds: string[];
  deleted: boolean;
};

export type MockTag = {
  id: string;
  name: string;
};

export const initialTags: MockTag[] = [
  { id: "tag_coop", name: "Co-op" },
  { id: "tag_multi", name: "Multiplayer" },
  { id: "tag_single", name: "Singleplayer" },
  { id: "tag_indie", name: "Indie" },
  { id: "tag_early", name: "Early Access" },
  { id: "tag_story", name: "Story-rich" },
  { id: "tag_open", name: "Open World" },
  { id: "tag_comp", name: "Competitive" },
  { id: "tag_roguelike", name: "Roguelike" },
  { id: "tag_horror", name: "Horror" },
];

export const initialUsers: MockUser[] = [
  {
    id: "user_admin",
    username: "admin",
    displayName: "Site Admin",
    email: "admin@critline.local",
    role: "ADMIN",
    createdAt: "2025-01-01",
  },
  {
    id: "user_danaln",
    username: "danaln",
    displayName: "Dana LN",
    email: "dana@critline.local",
    role: "USER",
    createdAt: "2025-03-12",
  },
  {
    id: "user_lootwreck",
    username: "lootwreck",
    displayName: "Loot Wreck",
    email: "loot@critline.local",
    role: "USER",
    createdAt: "2025-04-02",
  },
  {
    id: "user_pixelbruise",
    username: "pixelbruise",
    displayName: "Pixel Bruise",
    email: "pixel@critline.local",
    role: "USER",
    createdAt: "2025-05-18",
  },
];

export const initialGames: MockGame[] = [
  {
    id: "game_repo",
    title: "R.E.P.O.",
    description: "Chaotic co-op retrieval missions packed with loud failures.",
    developer: "Semiwork",
    releaseDate: "2025-02-26",
    coverImage: "/images/review-cover.png",
    bannerImage: "/images/review-cover.png",
    genre: "HORROR",
    platforms: ["PC"],
    tagIds: ["tag_coop", "tag_multi", "tag_horror"],
    deleted: false,
  },
  {
    id: "game_nightfall",
    title: "Nightfall Protocol",
    description: "Tactical night-ops where every mistake is loud.",
    developer: "Black Iris Studio",
    releaseDate: "2024-11-12",
    coverImage: "/images/review-cover.png",
    bannerImage: "/images/review-cover.png",
    genre: "SHOOTER",
    platforms: ["PC", "PLAYSTATION", "XBOX"],
    tagIds: ["tag_multi", "tag_comp"],
    deleted: false,
  },
  {
    id: "game_hollow",
    title: "Hollow Signal",
    description: "Slow-burn survival mystery about transmission and isolation.",
    developer: "Quiet Frequency",
    releaseDate: "2025-01-17",
    coverImage: "/images/review-cover.png",
    bannerImage: "/images/review-cover.png",
    genre: "ADVENTURE",
    platforms: ["PC", "PLAYSTATION"],
    tagIds: ["tag_story", "tag_single"],
    deleted: false,
  },
];

export const initialReviews: MockReview[] = [
  {
    id: "review_1",
    title: "THIS IS BADASS!",
    content: "Co-op chaos at its peak — loud, messy, impossible to put down.",
    rating: 5,
    authorId: "user_danaln",
    authorName: "@danaln",
    gameId: "game_repo",
    flagCount: 3,
    createdAt: "2025-07-02",
  },
  {
    id: "review_2",
    title: "WORTH EVERY LATE NIGHT",
    content: "The loop clicks by hour three and never lets go.",
    rating: 5,
    authorId: "user_lootwreck",
    authorName: "@lootwreck",
    gameId: "game_nightfall",
    flagCount: 0,
    createdAt: "2025-07-03",
  },
  {
    id: "review_3",
    title: "A MASTERCLASS IN TENSION",
    content:
      "Combat is spiteful in the best way and the story sticks the landing.",
    rating: 5,
    authorId: "user_pixelbruise",
    authorName: "@pixelbruise",
    gameId: "game_hollow",
    flagCount: 1,
    createdAt: "2025-07-01",
  },
  {
    id: "review_4",
    title: "ONE MORE RUN ENERGY",
    content: "Short sessions turn into all-nighters.",
    rating: 4,
    authorId: "user_lootwreck",
    authorName: "@lootwreck",
    gameId: "game_repo",
    flagCount: 0,
    createdAt: "2025-07-05",
  },
];

export function emptyGameForm(): Omit<MockGame, "id" | "deleted"> {
  return {
    title: "",
    description: "",
    developer: "",
    releaseDate: "",
    coverImage: null,
    bannerImage: null,
    genre: "ACTION",
    platforms: ["PC"],
    tagIds: [],
  };
}

export function ratingStats(reviews: MockReview[]) {
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const review of reviews) {
    const key = Math.min(5, Math.max(1, review.rating)) as 1 | 2 | 3 | 4 | 5;
    distribution[key] += 1;
  }
  const count = reviews.length;
  const average =
    count === 0 ? 0 : reviews.reduce((sum, r) => sum + r.rating, 0) / count;
  return { average, count, distribution };
}
