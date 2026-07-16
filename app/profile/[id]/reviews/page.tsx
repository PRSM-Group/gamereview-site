import { seedUsers, seedReviews, seedGames } from "@/lib/seed-data";
import { UserReviewCard } from "@/components/profile/UserReviewCard";
import { ProfileIdentity } from "@/components/profile/ProfileIdentity";
import { SiteHeaderServer } from "@/components/layout/SiteHeaderServer";
import Link from "next/link";

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profileId = id;
  const user = seedUsers.find((u) => u.id === profileId);

  if (!user) return null;

  const visibleReviews = seedReviews.filter((review) => {
    const matchesAuthor =
      review.authorName === user.username || review.authorName === profileId;
    const matchesReviewId = user.reviewIds.includes(review.id);
    return matchesAuthor || matchesReviewId;
  });

  return (
    <div className="min-h-full bg-[#070000] text-white">
      <SiteHeaderServer />
      <div className="max-w-6xl text-base mx-auto px-4 pt-6 pb-2">
        <Link
          href={`/profile/${profileId}`}
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
                  profileId={profileId}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
