import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { auth } from "@/lib/auth";
import { getPostLoginRedirect } from "@/lib/auth/redirects";

export const metadata: Metadata = {
  title: "Log in · VOXEL",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const { callbackUrl } = await searchParams;

  if (session?.user) {
    redirect(
      getPostLoginRedirect(callbackUrl ?? "", session.user.role),
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-[#070000] text-sm text-white/40">
          Loading…
        </div>
      }
    >
      <AuthPanel />
    </Suspense>
  );
}
