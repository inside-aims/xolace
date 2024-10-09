import { createClient } from "@/utils/supabase/server";
import { builderUrl } from "@/utils/url-helpers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hashed_token: string = searchParams.get("hashed_token") || "";
  const isRecovery = searchParams.get("type") === "recovery";
  const isSignUp = searchParams.get("type") === "signup";

  let verifyType = "magiclink";
  if (isRecovery) verifyType = "recovery";
  else if (isSignUp) verifyType = "signup";

  const UserUrl = (path: any) => builderUrl(path, request);
  const getRedirect = (path: any) => NextResponse.redirect(UserUrl(path));

  const supabase = createClient();
  const { error } = await supabase.auth.verifyOtp({
    type: verifyType,
    token_hash: hashed_token,
  });

  if (error) {
    return getRedirect("/error?type=invalid_magiclink");
  } else {
    if (isRecovery) {
      return getRedirect("/tickets/change-password");
    } else {
      return getRedirect("/tickets");
    }
  }
}
