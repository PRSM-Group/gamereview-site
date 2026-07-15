import { seedGames, seedReviews } from "@/lib/seed-data";

export type LandingReview = {
  id: string;
  title: string;
  content: string;
  rating: number;
  authorName: string;
  coverImage: string | null;
  featured: boolean;
};

export type LandingGame = {
  id: string;
  title: string;
  coverImage: string | null;
  averageRating: number;
};

export type LandingData = {
  featuredReview: LandingReview;
  recentReviews: LandingReview[];
  topGames: LandingGame[];
  fromDatabase: boolean;
};

function getFallbackData(): LandingData {
  const reviews = seedReviews.map((review) => ({ ...review }));
  const featuredReview =
    reviews.find((review) => review.featured) ?? reviews[0];

  return {
    featuredReview,
    recentReviews: reviews.filter((review) => !review.featured).slice(0, 4),
    topGames: seedGames.map((game) => ({ ...game })),
    fromDatabase: false,
  };
}

export async function getLandingData(): Promise<LandingData> {
  if (!process.env.DATABASE_URL) {
    return getFallbackData();
  }

  try {
    const { prisma } = await import("@/lib/prisma");

    const [featuredReview, recentReviews, topGames] = await Promise.all([
      prisma.review.findFirst({
        where: { featured: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.review.findMany({
        where: { featured: false },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
      prisma.game.findMany({
        orderBy: { averageRating: "desc" },
        take: 4,
      }),
    ]);

    if (!featuredReview || recentReviews.length === 0 || topGames.length === 0) {
      return getFallbackData();
    }

    return {
      featuredReview,
      recentReviews,
      topGames,
      fromDatabase: true,
    };
  } catch {
    return getFallbackData();
  }
}
