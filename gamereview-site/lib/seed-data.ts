export const SITE_NAME = "VOXEL";

export const seedGames = [
  {
    id: "game_repo",
    title: "R.E.P.O.",
    description:
      "An online co-op horror game with up to 6 players. Locate  valuable, fully physics-based objects and handle them with care as you retrieve and extract to satisfy your creator's desires.",
    developer: "semiwork",
    releaseDate: "26 February 2025",
    coverImage: "/images/review-cover.png",
    bannerImage: "/images/browse-game.png",
    genres: ["Horror", "Survival", "Action", "Adventure"],
    tags: ["Co-op", "3D", "Online", "Multiplayer", "Single-player"],
    platform: "PC via Steam",
    averageRating: 4.8,
    reviewCount: 128,
  },
  {
    id: "game_nightfall",
    title: "Nightfall Protocol",
    coverImage: "/images/review-cover.png",
    averageRating: 4.5,
    reviewCount: 86,
  },
  {
    id: "game_ember",
    title: "Ember Circuit",
    coverImage: "/images/review-cover.png",
    averageRating: 4.2,
    reviewCount: 54,
  },
  {
    id: "game_hollow",
    title: "Hollow Signal",
    coverImage: "/images/review-cover.png",
    averageRating: 4.9,
    reviewCount: 203,
  },
] as const;

export const seedReviews = [
  {
    id: "review_featured",
    title: "A MASTERCLASS IN TENSION",
    content:
      "From the opening hours this game refuses to let you breathe. Combat is spiteful in the best way, exploration is rewarding, and the story sticks the landing without sanding off the edges.",
    rating: 5,
    authorName: "@pixelbruise",
    displayName: "daylight",
    userName: "danaln",
    coverImage: null,
    featured: true,
    gameId: "game_hollow",
    status: "Playing",
  },
  {
    id: "review_1",
    title: "THIS IS BADASS!",
    content:
      "We play the bugs, endure the grinds, and celebrate the masterpieces so you don’t waste your time or money. We play the bugs, endure the grinds, and celebrate the masterpieces so you don’t waste your bug bug celebrate the masterpieces so you don’t waste your bug bug celebrate the your bug bug I LOOOOOOOVE I LOVE I LOVE I LOVE",
    rating: 5,
    displayName: "daylight",
    userName: "danaln",
    coverImage: "/images/review-cover.png",
    featured: false,
    gameId: "game_repo",
    status: "Playing",
  },
  {
    id: "review_2",
    title: "WORTH EVERY LATE NIGHT",
    content:
      "The loop clicks by hour three and never lets go. Builds feel expressive, bosses feel fair, and the soundtrack carries every long session without getting stale.",
    rating: 5,
    displayName: "daylight",
    userName: "danaln",
    coverImage: "/images/review-cover.png",
    featured: false,
    gameId: "game_nightfall",
    status: "Finished",
  },
  {
    id: "review_3",
    title: "ROUGH EDGES, REAL HEART",
    content:
      "It stumbles in the midgame, but the characters and systems keep pulling you back. If you can push through the rough patches, there is a special campaign waiting underneath.",
    rating: 4,
    displayName: "daylight",
    userName: "danaln",
    coverImage: "/images/review-cover.png",
    featured: false,
    gameId: "game_ember",
    status: "Dropped",
  },
  {
    id: "review_4",
    title: "CAN'T STOP RECOMMENDING THIS",
    content:
      "Atmosphere for days, encounters that stay scary, and a pace that respects your time. Not perfect, but it is one of the clearest must-plays on the board right now.",
    rating: 5,
    displayName: "daylight",
    userName: "danaln",
    coverImage: "/images/review-cover.png",
    featured: false,
    gameId: "game_hollow",
    status: "Finished",
  },
] as const;

export const seedHeroSecondaryReview = {
  id: "review_hero_secondary",
  title: "ONE MORE RUN ENERGY",
  content:
    "Short sessions turn into all-nighters. The risk-reward loop is addictive and the co-op screams are worth it.",
  rating: 4,
  displayName: "daylight",
  userName: "danaln",
  coverImage: null,
  featured: false,
  status: "Playing",
} as const;
