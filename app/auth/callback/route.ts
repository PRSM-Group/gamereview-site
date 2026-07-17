import { NextResponse, type NextRequest } from "next/server";
import { mapCallbackAuthError } from "@/lib/auth/errors";
import { syncPrismaUser } from "@/lib/auth/sync-user";
import {
  createRouteHandlerClient,
  parseOtpType,
} from "@/lib/supabase/route-handler";

function redirectToLogin(origin: string, error: string) {
  return NextResponse.redirect(`${origin}/login?error=${error}`);
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = parseOtpType(requestUrl.searchParams.get("type"));
  const origin = requestUrl.origin;

  let response = NextResponse.redirect(`${origin}/login?verified=1`);
  const supabase = createRouteHandlerClient(request, response);

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });
    if (error) {
      return redirectToLogin(origin, mapCallbackAuthError(error.message));
    }
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return redirectToLogin(origin, mapCallbackAuthError(error.message));
    }
  } else {
    return redirectToLogin(origin, "auth");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    try {
      await syncPrismaUser(user);
    } catch {
      return redirectToLogin(origin, "profile");
    }
  }

  return response;
}
