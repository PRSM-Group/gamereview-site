import { Resend } from "resend";

const FROM = process.env.EMAIL_FROM ?? "VOXEL <onboarding@resend.dev>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

type SendVerificationEmailParams = {
  to: string;
  token: string;
  displayName?: string;
};

export function buildVerificationUrl(token: string): string {
  const url = new URL("/verify-email", APP_URL);
  url.searchParams.set("token", token);
  return url.toString();
}

function verificationHtml(displayName: string, verifyUrl: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
      <h1 style="color: #8e0314;">Verify your VOXEL account</h1>
      <p>Hi ${displayName},</p>
      <p>Click the button below to verify your email. This link expires in 24 hours.</p>
      <p style="margin: 32px 0;">
        <a href="${verifyUrl}" style="background: #8e0314; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
          Verify email
        </a>
      </p>
      <p style="font-size: 12px; color: #666;">
        Or copy this link: <a href="${verifyUrl}">${verifyUrl}</a>
      </p>
    </div>
  `;
}

function verificationText(displayName: string, verifyUrl: string): string {
  return `Hi ${displayName},

Verify your VOXEL account by opening this link (expires in 24 hours):

${verifyUrl}`;
}

export async function sendVerificationEmail({
  to,
  token,
  displayName = "there",
}: SendVerificationEmailParams): Promise<void> {
  const verifyUrl = buildVerificationUrl(token);
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.info("[dev] Verification link:", verifyUrl);
      return;
    }
    throw new Error("RESEND_API_KEY is not set");
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "Verify your VOXEL account",
    html: verificationHtml(displayName, verifyUrl),
    text: verificationText(displayName, verifyUrl),
  });

  if (error) {
    throw new Error(error.message);
  }
}
