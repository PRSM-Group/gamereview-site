"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendUserVerificationEmail } from "@/lib/verification";

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

function getSafeCallbackUrl(formData: FormData): string {
  const raw = getString(formData, "callbackUrl").trim();
  if (raw.startsWith("/") && !raw.startsWith("//")) {
    return raw;
  }
  return "/";
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

export async function loginAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = getString(formData, "email").trim();
  const password = String(formData.get("password") ?? "");

  if (!email) {
    return { error: "Please fill out this field.", field: "email" };
  }
  if (!password) {
    return { error: "Please fill out this field.", field: "password" };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (valid && !user.emailVerified) {
      return {
        error:
          "Verify your email before logging in. Check your inbox or resend below.",
        field: "email",
      };
    }
  }

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      return {
        error: "Invalid email or password.",
        field: "email",
      };
    }
    return { redirectTo: getSafeCallbackUrl(formData) };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: "Invalid email or password.",
        field: "email",
      };
    }
    throw error;
  }
}

export async function signupAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const username = getString(formData, "username").trim();
  const displayName = getString(formData, "displayName").trim();
  const email = getString(formData, "email").trim();
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

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      username,
      displayName,
      email,
      passwordHash,
      role: "USER",
    },
  });

  try {
    await sendUserVerificationEmail(user.id);
  } catch {
    return {
      error:
        "Account created, but we couldn't send the verification email. Use resend below.",
      field: "email",
    };
  }

  return {
    success:
      "Account created. Check your email for a verification link before logging in.",
  };
}

export async function resendVerificationAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = getString(formData, "email").trim().toLowerCase();

  if (!email) {
    return { error: "Enter your email address.", field: "email" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address.", field: "email" };
  }

  const genericSuccess =
    "If an unverified account exists for that email, we sent a new link.";

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.emailVerified) {
    return { success: genericSuccess };
  }

  try {
    await sendUserVerificationEmail(user.id);
  } catch {
    return {
      error: "Could not send email. Try again later.",
      field: "email",
    };
  }

  return { success: genericSuccess };
}
