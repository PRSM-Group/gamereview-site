import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { BrowsePageClient } from "@/components/browse/BrowsePageClient";
import { getAllGames } from "@/services/game.service";
import { getLikedGameIdsForUser } from "@/services/like.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Browse · VOXEL",
  description: "Search, sort, and filter game reviews on VOXEL.",
};

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string | string[] }>;
}) {
  const { sort } = await searchParams;
  const initialSort = sort === "rating" ? "rating" : "reviews";
  const [session, games] = await Promise.all([auth(), getAllGames()]);
  const likedGameIds = session?.user.id
    ? [
        ...(await getLikedGameIdsForUser(
          session.user.id,
          games.map((game) => game.id),
        )),
      ]
    : [];

  return (
    <BrowsePageClient
      initialSession={session}
      initialSort={initialSort}
      games={games}
      likedGameIds={likedGameIds}
    />
  );
}
