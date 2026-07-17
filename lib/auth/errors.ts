export function mapResendAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("rate limit") || lower.includes("too many")) {
    return "Too many emails sent. Wait a few minutes, then try again.";
  }

  if (lower.includes("already confirmed") || lower.includes("already verified")) {
    return "This email is already verified. Try logging in.";
  }

  return message;
}
