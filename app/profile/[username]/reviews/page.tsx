import { seedUsers, seedReviews, seedGames } from "@/lib/seed-data";
import { toPublicProfileReview } from "@/lib/review-display";
import { UserReviewCard } from "@/components/profile/UserReviewCard";
import { ProfileIdentity } from "@/components/profile/ProfileIdentity";
import { SiteHeaderServer } from "@/components/layout/SiteHeaderServer";
import { prisma } from "@/lib/prisma";
import { getReviewsByUserId } from "@/services/review.service";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const dbUser = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      displayName: true,
    },
  });

  if (dbUser) {
    const dbReviews = await getReviewsByUserId(dbUser.id);
    const reviews = dbReviews.map((review) => toPublicProfileReview(review));

    return (
      <div className="min-h-full bg-[#070000] text-white">
        <SiteHeaderServer />
        <div className="max-w-6xl text-base mx-auto px-4 pt-6 pb-2">
          <Link
            href={`/profile/${username}`}
            className="font-bold tracking-widest text-red-700 hover:text-red-500 uppercase transition-colors inline-flex items-center gap-1"
          >
            &lt; Return
          </Link>
        </div>
        <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans">
          <div className="max-w-5xl mx-auto space-y-10">
            <ProfileIdentity
              displayName={dbUser.displayName}
              username={dbUser.username}
              size="sm"
            />

            <h2 className="text-2xl font-black tracking-wider uppercase text-gray-100 mb-4">
              Recent Reviews
            </h2>

            <div className="flex flex-col gap-6">
              {reviews.length === 0 ? (
                <p className="text-sm text-white/45">No reviews yet.</p>
              ) : (
                reviews.map((review) => (
                  <UserReviewCard
                    key={review.id}
                    review={review}
                    game={{
                      id: review.gameId,
                      title:
                        dbReviews.find((item) => item.id === review.id)?.game
                          .title ?? "Unknown game",
                      coverImage: review.coverImage ?? "",
                    }}
                    profileId={dbUser.id}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const user = seedUsers.find((u) => u.username === username);
  if (!user) return null;

  const visibleReviews = seedReviews.filter((review) => {
    const matchesAuthor = review.authorName === user.username;
    const matchesReviewId = user.reviewIds.includes(review.id);
    return matchesAuthor || matchesReviewId;
  });

  return (
    <div className="min-h-full bg-[#070000] text-white">
      <SiteHeaderServer />
      <div className="max-w-6xl text-base mx-auto px-4 pt-6 pb-2">
        <Link
          href={`/profile/${username}`}
          className="font-bold tracking-widest text-red-700 hover:text-red-500 uppercase transition-colors inline-flex items-center gap-1"
        >
          &lt; Return
        </Link>
      </div>
      <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans">
        <div className="max-w-5xl mx-auto space-y-10">
          <ProfileIdentity
            displayName={user.displayName}
            username={user.username}
            size="sm"
          />

          <h2 className="text-2xl font-black tracking-wider uppercase text-gray-100 mb-4">
            Recent Reviews
          </h2>

          <div className="flex flex-col gap-6">
            {visibleReviews.map((review) => {
              const game = seedGames.find((g) => g.id === review.gameId);
              if (!game) return null;

              return (
                <UserReviewCard
                  key={review.id}
                  review={review}
                  game={game}
                  profileId={user.id}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
