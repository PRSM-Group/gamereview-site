import type { Metadata } from "next";
import { AdminPanel } from "@/components/admin/AdminPanel";

import { getAdminGames } from "@/services/game.service";
import { getAllTags } from "@/services/tag.service";

export const metadata: Metadata = {
  title: "Admin · VOXEL",
  description: "Admin Panel",
};

export default async function AdminPage() {
  const [games, tags] = await Promise.all([getAdminGames(), getAllTags()]);

  return <AdminPanel games={games} tags={tags} />;
}
