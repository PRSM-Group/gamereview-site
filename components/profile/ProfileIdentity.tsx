type ProfileIdentityProps = {
  displayName: string;
  username: string;
  avatarUrl?: string | null;
  size?: "sm" | "lg";
};

export function ProfileIdentity({
  displayName,
  username,
  avatarUrl,
  size = "lg",
}: ProfileIdentityProps) {
  const avatarSize = size === "lg" ? "w-24 h-24" : "w-20 h-20";
  const nameSize = size === "lg" ? "text-3xl" : "text-3xl";

  return (
    <div className="flex items-center gap-4">
      <div
        className={`${avatarSize} rounded-full bg-neutral-300 shrink-0 overflow-hidden relative`}
      ></div>
      <div className="flex flex-col">
        <h1 className={`${nameSize} font-extrabold tracking-tight`}>
          {displayName}
        </h1>
        <span className="text-sm text-neutral-500">{username}</span>
      </div>
    </div>
  );
}
