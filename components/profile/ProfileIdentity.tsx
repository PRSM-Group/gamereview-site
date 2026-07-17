type ProfileIdentityProps = {
  displayName: string | null;
  username: string | null;
  profileImage?: string | null;
  size?: "sm" | "lg";
};

export function ProfileIdentity({
  displayName,
  username,
  profileImage,
  size = "lg",
}: ProfileIdentityProps) {
  const profileImg = size === "lg" ? "w-24 h-24" : "w-20 h-20";
  const nameSize = size === "lg" ? "text-3xl" : "text-3xl";

  return (
    <div className="flex items-center gap-4">
      <div
        className={`${profileImg} rounded-full bg-neutral-300 shrink-0 overflow-hidden relative`}
      ></div>
      <div className="flex flex-col">
        <h1 className={`${nameSize} font-extrabold tracking-tight`}>
          {displayName}
        </h1>
        <span className="text-lg text-neutral-500">{username}</span>
      </div>
    </div>
  );
}
