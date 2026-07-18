import Link from "next/link";

export function VerifyEmailPanel() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-16">
      <h1 className="font-kumbh text-2xl font-semibold text-white">
        Email verification is off
      </h1>
      <p className="mt-3 text-sm text-white/55">
        New accounts are verified automatically at sign up. Log in with your
        email and password.
      </p>
      <Link
        href="/login"
        className="glass-button mt-8 inline-flex h-11 items-center justify-center rounded-[10px] px-6 text-sm font-semibold text-white"
      >
        Go to log in
      </Link>
    </div>
  );
}
