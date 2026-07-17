import { getAllGames } from "@/services/game.service";
import { getAllReviews } from "@/services/review.service";
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
  slug: string;
  title: string;
  coverImage: string | null;
  averageRating: number;
  reviewCount: number;
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
    topGames: [...seedGames]
      .sort(
        (a, b) =>
          b.averageRating - a.averageRating ||
          b.reviewCount - a.reviewCount,
      )
      .slice(0, 8)
      .map((game) => ({
        ...game,
        slug: game.id.replace(/^game_/, ""),
      })),
    fromDatabase: false,
  };
}

export async function getLandingData(): Promise<LandingData> {
  try {
    const [reviews, games] = await Promise.all([
      getAllReviews(),
      getAllGames(),
    ]);

    const landingReviews: LandingReview[] = reviews.map((review) => ({
      id: review.id,
      title: review.heading,
      content: review.content,
      rating:
        typeof review.rating === "number"
          ? review.rating
          : Number(review.rating),
      authorName: `@${review.user.username}`,
      coverImage: review.game.coverImage,
      featured: false,
    }));

    const fallback = getFallbackData();
    const featuredReview = landingReviews[0] ?? fallback.featuredReview;
    const recentReviews =
      landingReviews.length > 0
        ? landingReviews.slice(1, 5)
        : fallback.recentReviews;

    const topGames: LandingGame[] =
      games.length > 0
        ? [...games]
            .sort(
              (a, b) =>
                b.averageRating - a.averageRating ||
                b.reviewCount - a.reviewCount,
            )
            .slice(0, 8)
            .map((game) => ({
              id: game.id,
              slug: game.slug,
              title: game.title,
              coverImage: game.coverImage,
              averageRating: game.averageRating,
              reviewCount: game.reviewCount,
            }))
        : fallback.topGames;

    return {
      featuredReview,
      recentReviews,
      topGames,
      fromDatabase: reviews.length > 0 || games.length > 0,
    };
  } catch {
    return getFallbackData();
  }
}
