import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

import {
  buildOAuthErrorRedirect,
  createOAuthState,
  getOAuthCallbackUrl,
  getOAuthConfiguration,
  isOAuthProvider,
} from "@/lib/oauth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;

  if (!isOAuthProvider(provider)) {
    redirect("/");
  }

  const searchParams = request.nextUrl.searchParams;
  const returnTo = searchParams.get("returnTo") || "/";
  const config = getOAuthConfiguration(provider);

  if (!config.clientId || !config.clientSecret) {
    redirect(
      buildOAuthErrorRedirect(
        returnTo,
        `${provider === "google" ? "Google" : "Facebook"} sign-in needs provider keys before it can be used.`,
      ),
    );
  }

  const redirectUri = getOAuthCallbackUrl(provider, request.url);
  const state = createOAuthState({
    provider,
    returnTo,
    serviceIntent: searchParams.get("serviceIntent"),
    packageKey: searchParams.get("packageKey"),
    packageLabel: searchParams.get("packageLabel"),
  });

  if (provider === "google") {
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.searchParams.set("client_id", config.clientId);
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "openid email profile");
    url.searchParams.set("state", state);
    url.searchParams.set("prompt", "select_account");
    redirect(url.toString());
  }

  const url = new URL("https://www.facebook.com/dialog/oauth");
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "email,public_profile");
  url.searchParams.set("state", state);
  redirect(url.toString());
}
