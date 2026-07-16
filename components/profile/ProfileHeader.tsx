import { ProfileIdentity } from "@/components/profile/ProfileIdentity";

type User = {
  displayName: string;
  username: string;
  followers: number;
  following: number;
  bio: string;
};

export function ProfileHeader({ user }: { user: User }) {
  return (
    <div className="space-y-6">
      <ProfileIdentity
        displayName={user.displayName}
        username={user.username}
        size="lg"
      />

      <div className="flex gap-6 text-sm">
        <div>
          <span className="font-bold text-gray-200">{user.following}</span>
          <span className="text-neutral-400 ml-1.5">Following</span>
        </div>
        <div>
          <span className="font-bold text-gray-200">{user.followers}</span>
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
