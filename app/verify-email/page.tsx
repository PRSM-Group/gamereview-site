import { redirect } from "next/navigation";

/** Email verification disabled — send users to login. */
export default function VerifyEmailPage() {
  redirect("/login");
}
