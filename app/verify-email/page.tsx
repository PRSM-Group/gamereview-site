import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmailPanel } from "@/components/auth/VerifyEmailPanel";

export const metadata: Metadata = {
  title: "Verify email · VOXEL",
};

export default function VerifyEmailPage() {
  return (
    <div className="min-h-dvh bg-[#070000] text-white">
      <Suspense
        fallback={
          <div className="flex min-h-dvh items-center justify-center text-sm text-white/40">
            Loading…
          </div>
        }
      >
        <VerifyEmailPanel />
      </Suspense>
    </div>
  );
}
