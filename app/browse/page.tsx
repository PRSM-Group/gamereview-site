import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { BrowsePageClient } from "@/components/browse/BrowsePageClient";

export const metadata: Metadata = {
  title: "Browse · VOXEL",
  description: "Search, sort, and filter game reviews on VOXEL.",
};

export default async function BrowsePage() {
  const session = await auth();
  return <BrowsePageClient initialSession={session} />;
}
