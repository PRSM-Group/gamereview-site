"use client";

import {
  FormEvent,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getSession } from "next-auth/react";
import { SITE_NAME } from "@/lib/seed-data";
import { loginAction, signupAction } from "@/app/login/actions";

type AuthMode = "login" | "signup";

type FieldName =
  | "username"
  | "displayName"
  | "email"
  | "password"
  | "confirmPassword";

type FieldTip = {
  field: FieldName;
  message: string;
};

const LOGIN_FIELDS: FieldName[] = ["email", "password"];
const SIGNUP_FIELDS: FieldName[] = [
  "username",
  "displayName",
  "email",
  "password",
  "confirmPassword",
];

function fieldClass(active: boolean) {
  return `admin-input ${
    active ? "border-[#8e0314] shadow-[0_0_0_3px_rgba(142,3,20,0.2)]" : ""
  }`;
}

function FieldTipBubble({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="pointer-events-none absolute bottom-full left-0 z-30 mb-2 max-w-[min(100%,280px)] animate-fade-up rounded-lg border border-[#8e0314]/45 bg-[#1a080a] px-3 py-2 text-[12px] leading-snug text-[#ffb4b4] shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
    >
      {message}
      <span
        aria-hidden
        className="absolute left-4 top-full h-0 w-0 border-x-[6px] border-t-[6px] border-x-transparent border-t-[#1a080a]"
      />
    </div>
  );
}

export function AuthPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode: AuthMode =
    searchParams.get("mode") === "signup" ? "signup" : "login";
  const callbackUrl = searchParams.get("callbackUrl") ?? "";
  const [tip, setTip] = useState<FieldTip | null>(null);
  const [pending, startTransition] = useTransition();

  function switchMode(next: AuthMode) {
    setTip(null);
    router.replace(next === "signup" ? "/login?mode=signup" : "/login", {
      scroll: false,
    });
  }

  function findFirstError(form: HTMLFormElement): FieldTip | null {
    const data = new FormData(form);
    const fields = mode === "login" ? LOGIN_FIELDS : SIGNUP_FIELDS;

    for (const field of fields) {
      const value = String(data.get(field) ?? "");

      if (field === "username" && !value.trim()) {
        return { field, message: "Please fill out this field." };
      }
      if (field === "displayName" && !value.trim()) {
        return { field, message: "Please fill out this field." };
      }
      if (field === "email") {
        const email = value.trim();
        if (!email) return { field, message: "Please fill out this field." };
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return { field, message: "Please enter a valid email address." };
        }
      }
      if (field === "password") {
        if (!value) return { field, message: "Please fill out this field." };
        if (mode === "signup") {
          const ok =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/.test(
              value,
            );
          if (!ok) {
            return {
              field,
              message:
                "Password must be at least 12 characters and include uppercase, lowercase, a number, and a symbol.",
            };
          }
        }
      }
      if (field === "confirmPassword") {
        const password = String(data.get("password") ?? "");
        if (!value) return { field, message: "Please fill out this field." };
        if (value !== password) {
          return { field, message: "Passwords do not match." };
        }
      }
    }

    return null;
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const first = findFirstError(form);
    setTip(first);

    if (first) {
      form.querySelector<HTMLElement>(`[name="${first.field}"]`)?.focus();
      return;
    }

    const formData = new FormData(form);

    startTransition(async () => {
      const result =
        mode === "login"
          ? await loginAction({}, formData)
          : await signupAction({}, formData);

      if (result?.error && result.field) {
        setTip({ field: result.field, message: result.error });
        form.querySelector<HTMLElement>(`[name="${result.field}"]`)?.focus();
        return;
      }

      if (result?.redirectTo) {
        router.refresh();
        await getSession();
        router.push(result.redirectTo);
      }
    });
  }

  const isLogin = mode === "login";

  function wrapField(field: FieldName, label: string, input: ReactNode) {
    return (
      <label className="block text-xs text-white/45">
        {label}
        <div className="relative mt-1.5">
          {tip?.field === field ? (
            <FieldTipBubble message={tip.message} />
          ) : null}
          {input}
        </div>
      </label>
    );
  }

  return (
    <div className="relative min-h-dvh w-full bg-[#070000]">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-1/2 flex-col justify-start overflow-hidden border-r border-white/10 px-12 pb-12 pt-24 xl:px-16 xl:pt-40 lg:flex">
        <div className="pointer-events-none absolute inset-0">
          <div className="hero-orb hero-orb-a left-[-10%] top-[10%] h-[320px] w-[320px]" />
          <div className="hero-orb hero-orb-b right-[-5%] bottom-[15%] h-[280px] w-[280px]" />
          <div className="hero-orb hero-orb-c left-[35%] top-[45%] h-[180px] w-[180px]" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#58050e]/40 via-transparent to-black/60" />
        </div>

        <Link
          href="/"
          className="relative z-10 mb-16 font-jersey text-[40px] leading-none text-white transition-opacity hover:opacity-80 xl:mb-20"
        >
          {SITE_NAME}
        </Link>

        <div className="relative z-10 max-w-xl">
          <h1 className="hero-headline-gradient font-unbounded text-[44px] font-normal leading-[1.05] tracking-[-2px] xl:text-[56px]">
            YOUR NEXT GAMING OBSESSION STARTS HERE.
          </h1>
          <p className="mt-10 font-kumbh text-lg leading-relaxed text-white/75 xl:mt-12 xl:text-xl">
            We play the bugs, endure the grinds, and celebrate the masterpieces
            so you don&apos;t waste your time or money.
          </p>
        </div>
      </aside>

      <div className="fixed top-10 left-1/2 z-20 -translate-x-1/2 lg:left-[75%] lg:top-30">
        <div className="relative inline-grid grid-cols-2 rounded-full border border-white/10 bg-[rgba(7,0,0,0.65)] p-1 backdrop-blur-md">
          <span
            aria-hidden
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-[rgba(88,5,14,0.55)] shadow-sm transition-transform duration-300 ease-out ${
              isLogin ? "left-1 translate-x-0" : "left-1 translate-x-full"
            }`}
          />
          <button
            type="button"
            className={`relative z-10 rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors duration-300 ${
              isLogin ? "text-white" : "text-white/45 hover:text-white/75"
            }`}
            onClick={() => switchMode("login")}
          >
            Log in
          </button>
          <button
            type="button"
            className={`relative z-10 rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors duration-300 ${
              !isLogin ? "text-white" : "text-white/45 hover:text-white/75"
            }`}
            onClick={() => switchMode("signup")}
          >
            Sign up
          </button>
        </div>
      </div>

      <section className="flex min-h-dvh w-full flex-col justify-center px-6 pb-12 pt-28 sm:px-10 lg:ml-[50%] lg:w-1/2 lg:px-14 lg:pt-32 xl:px-20">
        <Link
          href="/"
          className="mb-10 font-jersey text-[32px] leading-none text-white lg:hidden"
        >
          {SITE_NAME}
        </Link>

        <div className="mx-auto w-full max-w-[420px]">
          <div key={mode} className="animate-fade-up">
            <h2 className="font-kumbh text-2xl font-semibold tracking-tight text-white">
              {isLogin ? "Welcome back" : "Create an account"}
            </h2>
            <p className="mt-2 text-sm text-white/50">
              {isLogin
                ? "Log in to track reviews and keep exploring."
                : "Join VOXEL and start sharing what you play."}
            </p>

            <form className="mt-8 space-y-4" onSubmit={onSubmit} noValidate>
              {isLogin && callbackUrl ? (
                <input type="hidden" name="callbackUrl" value={callbackUrl} />
              ) : null}
              {!isLogin
                ? wrapField(
                    "username",
                    "Username",
                    <input
                      name="username"
                      type="text"
                      autoComplete="username"
                      className={fieldClass(tip?.field === "username")}
                      placeholder="johndoe123"
                      onChange={() => tip?.field === "username" && setTip(null)}
                    />,
                  )
                : null}

              {!isLogin
                ? wrapField(
                    "displayName",
                    "Display name",
                    <input
                      name="displayName"
                      type="text"
                      autoComplete="nickname"
                      className={fieldClass(tip?.field === "displayName")}
                      placeholder="John Doe"
                      onChange={() =>
                        tip?.field === "displayName" && setTip(null)
                      }
                    />,
                  )
                : null}

              {wrapField(
                "email",
                "Email",
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={fieldClass(tip?.field === "email")}
                  placeholder="you@email.com"
                  onChange={() => tip?.field === "email" && setTip(null)}
                />,
              )}

              {wrapField(
                "password",
                "Password",
                <input
                  name="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  className={fieldClass(tip?.field === "password")}
                  placeholder="Password"
                  onChange={() => tip?.field === "password" && setTip(null)}
                />,
              )}

              {!isLogin
                ? wrapField(
                    "confirmPassword",
                    "Confirm password",
                    <input
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      className={fieldClass(tip?.field === "confirmPassword")}
                      placeholder="SamePassword"
                      onChange={() =>
                        tip?.field === "confirmPassword" && setTip(null)
                      }
                    />,
                  )
                : null}

              <button
                type="submit"
                className="glass-button mt-2 flex h-12 w-full items-center justify-center rounded-[10px] font-kumbh text-sm font-semibold uppercase tracking-[0.12em] text-white"
              >
                {pending ? "Please wait..." : isLogin ? "Log in" : "Sign up"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-white/40">
              {isLogin ? "New here?" : "Already have an account?"}{" "}
              <button
                type="button"
                className="text-[#8e0314] transition-colors hover:text-[#b00a1c] hover:underline"
                onClick={() => switchMode(isLogin ? "signup" : "login")}
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
