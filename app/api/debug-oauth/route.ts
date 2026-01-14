import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = "https://lpmpp.unsoed.ac.id/api/auth/callback/google";

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId || "");
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("prompt", "select_account");

  return NextResponse.json({
    message: "Copy URL below and open in browser to test Google OAuth directly",
    testUrl: authUrl.toString(),
    redirectUri: redirectUri,
    note: "If you get 'redirect_uri_mismatch' error, the callback URL is not registered in Google Console"
  });
}
