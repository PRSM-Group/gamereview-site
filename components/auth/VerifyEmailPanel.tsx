"use client";

import Link from "next/link";

export function VerifyEmailPanel() {
  return (
    <div className="mx-auto max-w-md p-8">
      <h1 className="text-xl font-semibold">Verify email</h1>
      <p className="mt-2 text-sm text-white/60">
        Email verification is handled by the link Supabase sends after sign up.
        After confirming, you&apos;ll return here to log in.
      </p>
      <Link href="/login" className="mt-6 inline-block text-sm text-[#8e0314]">
        Back to login
      </Link>
    </div>
  );
}
