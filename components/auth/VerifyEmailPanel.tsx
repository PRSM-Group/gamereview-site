"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { verifyEmailAction } from "@/app/verify-email/actions";

export function VerifyEmailPanel() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!token) return;

    startTransition(async () => {
      const result = await verifyEmailAction(token);
      setMessage(result.success ?? null);
      setError(result.error ?? null);
    });
  }, [token]);

  if (!token) {
    return (
      <div className="mx-auto max-w-md p-8">
        <h1 className="text-xl font-semibold">Verify email</h1>
        <p className="mt-2 text-sm text-white/60">
          Open the link from your email, or resend from the login page.
        </p>
        <Link href="/login" className="mt-6 inline-block text-sm text-[#8e0314]">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md p-8 text-center">
      {pending && <p className="text-white/50">Verifying…</p>}
      {message && <p className="text-[#9ae6b4]">{message}</p>}
      {error && <p className="text-[#ffb4b4]">{error}</p>}
      <Link
        href="/login"
        className="mt-6 inline-block glass-button rounded-lg px-4 py-2 text-sm"
      >
        Go to login
      </Link>
    </div>
  );
}
