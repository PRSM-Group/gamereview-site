import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthPanel } from "@/components/auth/AuthPanel";

export const metadata: Metadata = {
  title: "Log in · VOXEL",
  description: "Log in or create a VOXEL account.",
};

export default function LoginPage() {
  return (
    <div className="min-h-dvh bg-[#070000] text-white">
      <Suspense
        fallback={
          <div className="flex min-h-dvh items-center justify-center text-sm text-white/40">
            Loading…
          </div>
        }
      >
        <AuthPanel />
      </Suspense>
    </div>
  );
}
