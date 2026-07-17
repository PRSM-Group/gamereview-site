"use server";

import { getPostLoginRedirect } from "@/lib/auth/redirects";
import { mapResendAuthError } from "@/lib/auth/errors";
import { signOut } from "@/lib/auth";
import { syncPrismaUser } from "@/lib/auth/sync-user";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export type AuthActionState = {
  error?: string;
  field?: "username" | "displayName" | "email" | "password" | "confirmPassword";
  redirectTo?: string;
  success?: string;
};

const PASSWORD_RULE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/;

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

function mapAuthError(message: string): AuthActionState {
  const lower = message.toLowerCase();

  if (lower.includes("email not confirmed")) {
    return {
      error:
        "Verify your email before logging in. Check your inbox or resend below.",
      field: "email",
    };
  }

  if (lower.includes("invalid login credentials")) {
    return {
      error: "Invalid email or password.",
      field: "email",
    };
  }

  if (lower.includes("invalid path")) {
    return {
      error:
        "Auth is misconfigured. Check NEXT_PUBLIC_SUPABASE_URL uses the project root (no /rest/v1).",
      field: "email",
    };
  }

  return { error: message, field: "email" };
}

function mapResendError(message: string): AuthActionState {
  return { error: mapResendAuthError(message), field: "email" };
}

export async function logoutAction() {
  await signOut();
}

export async function loginAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = getString(formData, "email").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email) {
    return { error: "Please fill out this field.", field: "email" };
  }
  if (!password) {
    return { error: "Please fill out this field.", field: "password" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return mapAuthError(error.message);
  }

  if (!data.user?.email_confirmed_at) {
    await supabase.auth.signOut();
    return {
      error:
        "Verify your email before logging in. Check your inbox or resend below.",
      field: "email",
    };
  }

  const prismaUser = await syncPrismaUser(data.user);

  return {
    redirectTo: getPostLoginRedirect(
      getString(formData, "callbackUrl"),
      prismaUser.role,
    ),
  };
}

export async function prepareSignupAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const username = getString(formData, "username").trim();
  const displayName = getString(formData, "displayName").trim();
  const email = getString(formData, "email").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!username) {
    return { error: "Please fill out this field.", field: "username" };
  }
  if (!displayName) {
    return { error: "Please fill out this field.", field: "displayName" };
  }
  if (!email) {
    return { error: "Please fill out this field.", field: "email" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address.", field: "email" };
  }
  if (!PASSWORD_RULE.test(password)) {
    return {
      error:
        "Password must be at least 12 characters and include uppercase, lowercase, a number, and a symbol.",
      field: "password",
    };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match.", field: "confirmPassword" };
  }

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    return {
      error: "An account with this email already exists.",
      field: "email",
    };
  }

  const existingUsername = await prisma.user.findUnique({
    where: { username },
  });
  if (existingUsername) {
    return {
      error: "This username is already taken.",
      field: "username",
    };
  }

  return {};
}

export async function completeSignupAction(input: {
  supabaseId: string;
  email: string;
  username: string;
  displayName: string;
  emailVerified: string | null;
}): Promise<AuthActionState> {
  const email = input.email.trim().toLowerCase();

  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { supabaseId: input.supabaseId }, { username: input.username }],
    },
  });

  if (existing) {
    return {
      error: "An account with this email or username already exists.",
      field: "email",
    };
  }

  await prisma.user.create({
    data: {
      supabaseId: input.supabaseId,
      email,
      username: input.username,
      displayName: input.displayName,
      emailVerified: input.emailVerified ? new Date(input.emailVerified) : null,
    },
  });

  return {
    success:
      "Account created. Check your email for a verification link before logging in.",
  };
}

export async function signupAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  return prepareSignupAction(_prev, formData);
}

export async function resendVerificationAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = getString(formData, "email").trim().toLowerCase();
  const redirectOrigin =
    getString(formData, "redirectOrigin").replace(/\/$/, "") || appUrl();

  if (!email) {
    return { error: "Enter your email address.", field: "email" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address.", field: "email" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${redirectOrigin}/auth/callback`,
    },
  });

  if (error) {
    return mapResendError(error.message);
  }

  return {
    success:
      "Verification email sent. Check your inbox and spam folder.",
  };
}
