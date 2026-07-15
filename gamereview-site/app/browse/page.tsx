import type { Metadata } from "next";
import { BrowsePageClient } from "@/components/browse/BrowsePageClient";

export const metadata: Metadata = {
  title: "Browse · VOXEL",
  description: "Search, sort, and filter game reviews on VOXEL.",
};

export default function BrowsePage() {
  return <BrowsePageClient />;
}
