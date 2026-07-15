"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";

export type AuthActionState = {
  error?: string;
  field?: "username" | "displayName" | "email" | "password" | "confirmPassword";
};

const PASSWORD_RULE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/;

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
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
  if (!user) {
    return { error: "Invalid email or password.", field: "email" };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { error: "Invalid email or password.", field: "email" };
  }

  const redirectTo = user.role === "ADMIN" ? "/admin" : "/";

  try {
    // Use redirectTo so Auth.js sets the session cookie (redirect:false often does not).
    await signIn("credentials", {
      email,
      password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: "Invalid email or password.",
        field: "email",
      };
    }
    throw error;
  }

  return {};
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
  await prisma.user.create({
    data: {
      username,
      displayName,
      email,
      passwordHash,
      role: "USER",
    },
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: "Account created, but sign-in failed. Please log in.",
        field: "email",
      };
    }
    throw error;
  }

  return {};
}
