import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/layout/SiteHeader";

export async function SiteHeaderServer() {
  const session = await auth();
  return <SiteHeader initialSession={session} />;
}
