import type { Metadata } from "next";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { toAdminReview } from "@/lib/review-display";
import { getAllGames } from "@/services/game.service";
import { getAllReviews } from "@/services/review.service";
import { getAllTags } from "@/services/tag.service";

export const metadata: Metadata = {
  title: "Admin · VOXEL",
  description: "Admin Panel",
};

export default async function AdminPage() {
  const [games, tags, reviews] = await Promise.all([
    getAllGames(),
    getAllTags(),
    getAllReviews(),
  ]);

  return (
    <AdminPanel
      games={games}
      tags={tags}
      reviews={reviews.map(toAdminReview)}
    />
  );
}
