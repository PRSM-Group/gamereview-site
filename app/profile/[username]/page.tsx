import { seedGames, seedReviews } from "@/lib/seed-data";
import { SiteHeaderServer } from "@/components/layout/SiteHeaderServer";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileLikedGames } from "@/components/profile/ProfileLikedGames";
import { ProfileGameReviewCard } from "@/components/profile/ProfileGameReviewCard";
import { getUserByUsername } from "@/actions/user.service";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getUserByUsername(username);

  if (!user) return <div>User not found.</div>;

  const followersCount = user?.followers.length;
  const followingCount = user?.following.length;

  return (
    <div className="min-h-full bg-[#070000] text-white">
      <SiteHeaderServer />
      <div className="max-w-6xl text-base mx-auto px-4 pt-6 pb-2">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 items-start">
          <ProfileHeader
            user={user}
            followersCount={followersCount}
            followingCount={followingCount}
          />
          <ProfileLikedGames games={user.likedGames} />
        </div>

        {/* recent reviews */}
        <div className="space-y-4 mt-8">
          <div className="flex justify-between items-end">
            <h2 className="text-xl font-black tracking-wider uppercase text-gray-100">
              Recent Reviews
            </h2>
            <a
              href={`/profile/${username}/reviews`}
              className="text-xs font-bold tracking-widest text-red-700 hover:text-red-500 transition-colors uppercase"
            >
              View All &gt;
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            {user.reviews.map((review) => {
              const game = seedGames.find((g) => g.id === review.gameId);
              if (!game) return null;
              return (
                <ProfileGameReviewCard
                  key={review.id}
                  review={review}
                  game={game}
                  profileId={username}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
