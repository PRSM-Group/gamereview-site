"use server";

import { verifyEmailToken } from "@/lib/verification";

export type VerifyEmailState = {
  error?: string;
  success?: string;
};

export async function verifyEmailAction(token: string): Promise<VerifyEmailState> {
  const trimmed = token.trim();
  if (!trimmed) {
    return { error: "Invalid verification link." };
  }

  const result = await verifyEmailToken(trimmed);
  if (!result.ok) {
    return {
      error:
        result.reason === "expired"
          ? "This link has expired. Request a new one from the login page."
          : "Invalid verification link.",
    };
  }

  return { success: "Email verified. You can log in now." };
}
