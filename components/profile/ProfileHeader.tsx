import { ProfileIdentity } from "@/components/profile/ProfileIdentity";

type User = {
  displayName: string | null;
  username: string | null;
  profileImage: string | null;
  bio: string | null;
};

export function ProfileHeader({ user }: { user: User }) {
  return (
    <div className="space-y-6">
      <ProfileIdentity
        displayName={user.displayName}
        username={user.username}
        size="lg"
      />

      <div className="space-y-2">
        <h2 className="inline-block text-sm font-black tracking-widest uppercase border-b-2 border-white pb-1">
          Bio
        </h2>
        <p className="text-sm leading-relaxed text-gray-300">{user.bio}</p>
      </div>
    </div>
  );
}
