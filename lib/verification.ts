import { randomBytes } from "crypto";
import { sendVerificationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

const TOKEN_BYTES = 32;
const EXPIRY_HOURS = 24;

function createTokenValue(): string {
  return randomBytes(TOKEN_BYTES).toString("hex");
}

function tokenExpiry(): Date {
  return new Date(Date.now() + EXPIRY_HOURS * 60 * 60 * 1000);
}

export async function issueVerificationToken(userId: string): Promise<string> {
  await prisma.verificationTaken.deleteMany({ where: { userId } });

  const token = createTokenValue();
  await prisma.verificationTaken.create({
    data: {
      token,
      userId,
      expiresAt: tokenExpiry(),
    },
  });

  return token;
}

export async function sendUserVerificationEmail(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");
  if (user.emailVerified) return;

  const token = await issueVerificationToken(userId);
  await sendVerificationEmail({
    to: user.email,
    token,
    displayName: user.displayName,
  });
}

export async function verifyEmailToken(token: string): Promise<
  | { ok: true }
  | { ok: false; reason: "invalid" | "expired" }
> {
  const record = await prisma.verificationTaken.findUnique({
    where: { token },
  });

  if (!record) return { ok: false, reason: "invalid" };
  if (record.expiresAt < new Date()) {
    await prisma.verificationTaken.delete({ where: { id: record.id } });
    return { ok: false, reason: "expired" };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: new Date() },
    }),
    prisma.verificationTaken.deleteMany({ where: { userId: record.userId } }),
  ]);

  return { ok: true };
}
