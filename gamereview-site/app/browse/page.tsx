import type { Metadata } from "next";
import { BrowsePageClient } from "@/components/browse/BrowsePageClient";

export const metadata: Metadata = {
  title: "Browse · CRITLINE",
  description: "Search, sort, and filter game reviews on CRITLINE.",
};

export default function BrowsePage() {
  return <BrowsePageClient />;
}
