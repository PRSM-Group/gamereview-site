import type { AuthCallbackError, AuthField } from "@/lib/auth/types";

export type AuthErrorResult = {
  message: string;
  field: AuthField;
};

function includesAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

export function mapLoginAuthError(
  message: string,
  field: AuthField = "email",
): AuthErrorResult {
  const lower = message.toLowerCase();

  if (includesAny(lower, ["email not confirmed", "email not verified"])) {
    return {
      message:
        "Verify your email before logging in. Check your inbox or resend below.",
      field: "email",
    };
  }

  if (includesAny(lower, ["invalid login credentials", "invalid credentials"])) {
    return { message: "Invalid email or password.", field: "email" };
  }

  if (lower.includes("invalid path")) {
    return {
      message:
        "Auth is misconfigured. Check NEXT_PUBLIC_SUPABASE_URL uses the project root (no /rest/v1).",
      field: "email",
    };
  }

  if (includesAny(lower, ["network", "fetch failed", "failed to fetch"])) {
    return {
      message: "Network error. Check your connection and try again.",
      field,
    };
  }

  return { message, field };
}

export function mapSignupAuthError(
  message: string,
  field: AuthField = "email",
): AuthErrorResult {
  const lower = message.toLowerCase();

  if (
    includesAny(lower, [
      "user already registered",
      "already been registered",
      "already exists",
    ])
  ) {
    return {
      message: "An account with this email already exists.",
      field: "email",
    };
  }

  if (includesAny(lower, ["password", "weak", "at least"])) {
    return {
      message:
        "Password must be at least 12 characters and include uppercase, lowercase, a number, and a symbol.",
      field: "password",
    };
  }

  if (includesAny(lower, ["rate limit", "too many"])) {
    return {
      message: "Too many attempts. Wait a few minutes, then try again.",
      field: "email",
    };
  }

  const loginMapped = mapLoginAuthError(message, field);
  if (loginMapped.message !== message) {
    return loginMapped;
  }

  return { message, field };
}

export function mapResendAuthError(message: string): AuthErrorResult {
  const lower = message.toLowerCase();

  if (includesAny(lower, ["rate limit", "too many"])) {
    return {
      message: "Too many emails sent. Wait a few minutes, then try again.",
      field: "email",
    };
  }

  if (includesAny(lower, ["already confirmed", "already verified"])) {
    return {
      message: "This email is already verified. Try logging in.",
      field: "email",
    };
  }

  if (includesAny(lower, ["user not found", "no user"])) {
    return {
      message:
        "No unverified account found for that email. Sign up or check the address.",
      field: "email",
    };
  }

  return mapLoginAuthError(message, "email");
}

export function mapCallbackAuthError(message: string): AuthCallbackError {
  const lower = message.toLowerCase();

  if (includesAny(lower, ["expired", "otp_expired"])) {
    return "expired";
  }

  return "auth";
}

export function getCallbackErrorMessage(error: string | null): string | null {
  if (!error) return null;

  switch (error as AuthCallbackError) {
    case "profile":
      return "Email verified, but we could not finish setting up your profile. Contact support.";
    case "expired":
      return "This verification link has expired. Resend a new one below.";
    case "auth":
    default:
      return "Authentication link is invalid or expired. Open the link in the same browser you used to sign up, or resend verification below.";
  }
}

export function mapPrismaSignupError(message: string): AuthErrorResult {
  const lower = message.toLowerCase();

  if (includesAny(lower, ["unique constraint", "p2002"])) {
    return {
      message: "An account with this email or username already exists.",
      field: "email",
    };
  }

  return {
    message: "Could not finish creating your account. Try again later.",
    field: "email",
  };
}
