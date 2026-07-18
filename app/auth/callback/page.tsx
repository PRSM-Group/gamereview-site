"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Email verification disabled — legacy callback URLs redirect to login. */
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#070000] text-sm text-white/60">
      Redirecting…
    </div>
  );
}
