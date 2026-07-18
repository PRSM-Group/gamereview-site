"use server";

import {
  mapLoginAuthError,
  mapPrismaSignupError,
  // mapResendAuthError,
} from "@/lib/auth/errors";
import { autoConfirmSupabaseUser } from "@/lib/auth/auto-confirm";
import { getPostLoginRedirect } from "@/lib/auth/redirects";
import { signOut } from "@/lib/auth";
import type { AuthActionState } from "@/lib/auth/types";
import { syncPrismaUser } from "@/lib/auth/sync-user";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export type { AuthActionState } from "@/lib/auth/types";

const PASSWORD_RULE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/;

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function toState(result: { message: string; field: AuthActionState["field"] }) {
  return { error: result.message, field: result.field };
}

export async function logoutAction() {
  await signOut();
}

export async function resolveLoginErrorAction(
  email: string,
  supabaseMessage: string,
): Promise<AuthActionState> {
  const lower = supabaseMessage.toLowerCase();
  if (
    lower.includes("invalid login credentials") ||
    lower.includes("invalid credentials")
  ) {
    const prismaUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: { supabaseId: true },
    });

    if (!prismaUser) {
      return toState({
        message:
          "No account found for that email. Sign up first, then log in.",
        field: "email",
      });
    }

    if (!prismaUser.supabaseId) {
      return toState({
        message:
          "This seed/dev account isn't linked to Supabase yet. Run: npm run auth:sync-seed",
        field: "email",
      });
    }
  }

  return toState(mapLoginAuthError(supabaseMessage));
}

export async function finishLoginAction(
  callbackUrl: string,
): Promise<AuthActionState> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return toState({
        message: "Could not establish a session. Try logging in again.",
        field: "email",
      });
    }

    // Email verification disabled — skip email_confirmed_at check.
    // if (!user.email_confirmed_at) {
    //   await supabase.auth.signOut();
    //   return toState(mapLoginAuthError("Email not confirmed"));
    // }

    const prismaUser = await syncPrismaUser(user);

    return {
      redirectTo: getPostLoginRedirect(callbackUrl, prismaUser.role),
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not log in. Try again.";
    return toState(mapLoginAuthError(message));
  }
}

/* Email verification disabled
export async function confirmEmailAction(): Promise<{ ok: boolean }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { ok: false };
    await syncPrismaUser(user);
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
*/

export async function autoConfirmSignupAction(
  supabaseId: string,
): Promise<{ ok: boolean }> {
  return autoConfirmSupabaseUser(supabaseId);
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
}): Promise<AuthActionState> {
  const email = input.email.trim().toLowerCase();

  try {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { supabaseId: input.supabaseId },
          { username: input.username },
        ],
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
        emailVerified: new Date(),
      },
    });

    return {
      success: "Account created. You can log in now.",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return toState(mapPrismaSignupError(message));
  }
}

export async function signupAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  return prepareSignupAction(_prev, formData);
}

/* Email verification disabled
export async function resendVerificationAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = getString(formData, "email").trim().toLowerCase();
  const redirectOrigin =
    getString(formData, "redirectOrigin").replace(/\/$/, "") || getAppUrl();

  if (!email) {
    return { error: "Enter your email address.", field: "email" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address.", field: "email" };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: getSignupEmailOptions(redirectOrigin),
    });

    if (error) {
      return toState(mapResendAuthError(error.message));
    }

    return {
      success: "Verification email sent. Check your inbox and spam folder.",
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not send email.";
    return toState(mapResendAuthError(message));
  }
}
*/
