import type { Metadata } from "next";
import { Jersey_15, Kumbh_Sans, Unbounded } from "next/font/google";
import { auth } from "@/lib/auth";
import { SessionProvider } from "@/components/auth/SessionProvider";
import "./globals.css";

const jersey = Jersey_15({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-jersey",
});

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-unbounded",
});

const kumbh = Kumbh_Sans({
  subsets: ["latin"],
  variable: "--font-kumbh",
});

export const metadata: Metadata = {
  title: "VOXEL",
  description:
    "We play the bugs, endure the grinds, and celebrate the masterpieces so you don't waste your time or money.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${jersey.variable} ${unbounded.variable} ${kumbh.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-kumbh">
        <SessionProvider
          session={session}
          key={session?.user?.id ?? "guest"}
        >
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
