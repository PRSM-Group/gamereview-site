import { ProfileIdentity } from "@/components/profile/ProfileIdentity";

type User = {
  displayName: string | null;
  username: string | null;
  profileImage: string | null;
  bio: string | null;
};

export function ProfileHeader({
  user,
  followersCount,
  followingCount,
}: {
  user: User;
  followersCount: number;
  followingCount: number;
}) {
  return (
    <div className="space-y-6">
      <ProfileIdentity
        displayName={user.displayName}
        username={user.username}
        size="lg"
      />

      <div className="flex gap-6 text-sm">
        <div>
          <span className="font-bold text-gray-200">{followingCount}</span>
          <span className="text-neutral-400 ml-1.5">Following</span>
        </div>
        <div>
          <span className="font-bold text-gray-200">{followersCount}</span>
          <span className="text-neutral-400 ml-1.5">Followers</span>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="inline-block text-sm font-black tracking-widest uppercase border-b-2 border-white pb-1">
          Bio
        </h2>
        <p className="text-sm leading-relaxed text-gray-300">{user.bio}</p>
      </div>
    </div>
  );
}
