export type AuthField =
  | "username"
  | "displayName"
  | "email"
  | "password"
  | "confirmPassword";

export type AuthActionState = {
  error?: string;
  field?: AuthField;
  redirectTo?: string;
  success?: string;
};

export type AuthCallbackError = "auth" | "expired" | "profile";
