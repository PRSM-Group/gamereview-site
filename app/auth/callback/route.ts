import { NextResponse, type NextRequest } from "next/server";
import { syncPrismaUser } from "@/lib/auth/sync-user";
import {
  createRouteHandlerClient,
  parseOtpType,
} from "@/lib/supabase/route-handler";

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
      return NextResponse.redirect(`${origin}/login?error=auth`);
    }
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(`${origin}/login?error=auth`);
    }
  } else {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    try {
      await syncPrismaUser(user);
    } catch {
      return NextResponse.redirect(`${origin}/login?error=profile`);
    }
  }

  return response;
}
