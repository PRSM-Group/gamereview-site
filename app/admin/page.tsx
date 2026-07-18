import type { Metadata } from "next";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { auth } from "@/lib/auth";
import { toAdminReview } from "@/lib/review-display";
import { getAllGames } from "@/services/game.service";
import { getAllReviews } from "@/services/review.service";
import { getAllTags } from "@/services/tag.service";
import { getUsersForAdmin } from "@/services/user.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin · VOXEL",
  description: "Admin Panel",
};

export default async function AdminPage() {
  const [games, tags, reviews, users, session] = await Promise.all([
    getAllGames(),
    getAllTags(),
    getAllReviews(),
    getUsersForAdmin(),
    auth(),
  ]);

  return (
    <AdminPanel
      games={games}
      tags={tags}
      reviews={reviews.map(toAdminReview)}
      users={users.map((user) => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
      }))}
      adminUser={
        session?.user
          ? { name: session.user.name, email: session.user.email }
          : null
      }
    />
  );
}
