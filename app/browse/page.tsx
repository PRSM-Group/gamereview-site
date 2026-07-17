import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import {
  browseGames as fallbackBrowseGames,
  featuredBanners as fallbackFeaturedBanners,
  type Genre,
  type Tag,
} from "@/lib/browse-mock";
import { BrowsePageClient } from "@/components/browse/BrowsePageClient";
import { resolveImageSrc } from "@/lib/image-src";
import { getBrowseGames } from "@/services/game.service";

export const metadata: Metadata = {
  title: "Browse · VOXEL",
  description: "Search, sort, and filter game reviews on VOXEL.",
};

export default async function BrowsePage() {
  const [session, dbGames] = await Promise.all([auth(), getBrowseGames()]);

  const browseGames =
    dbGames.length > 0
      ? dbGames.map((game) => ({
          ...game,
          genre: game.genre as Genre,
          tags: game.tags as Tag[],
        }))
      : fallbackBrowseGames;

  const featuredBanners =
    dbGames.length > 0
      ? browseGames.slice(0, 3).map((game) => ({
          id: game.id,
          title: game.title,
          subtitle: game.description.slice(0, 100),
          image: resolveImageSrc(game.bannerImage || game.coverImage),
          gameId: game.id,
        }))
      : fallbackFeaturedBanners;

  return (
    <BrowsePageClient
      initialSession={session}
      games={browseGames}
      featuredBanners={featuredBanners}
    />
  );
}
