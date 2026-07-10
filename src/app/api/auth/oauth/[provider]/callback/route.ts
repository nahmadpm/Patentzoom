import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

import { loginOAuthUser } from "@/lib/auth";
import {
  buildOAuthErrorRedirect,
  exchangeOAuthCode,
  getOAuthCallbackUrl,
  isOAuthProvider,
  readOAuthState,
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
  const error = searchParams.get("error");
  const code = searchParams.get("code");
  const state = readOAuthState(searchParams.get("state"), provider);
  const returnTo = state?.returnTo || "/";

  if (error) {
    redirect(buildOAuthErrorRedirect(returnTo, "The provider canceled sign-in."));
  }

  if (!code || !state) {
    redirect(
      buildOAuthErrorRedirect(
        returnTo,
        "That sign-in link expired. Please try again.",
      ),
    );
  }

  try {
    const profile = await exchangeOAuthCode({
      provider,
      code,
      redirectUri: getOAuthCallbackUrl(provider, request.url),
    });

    const result = await loginOAuthUser({
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      pendingService: state.serviceIntent,
      pendingPackageKey: state.packageKey,
      pendingPackageLabel: state.packageLabel,
    });

    redirect(result.redirectTo);
  } catch {
    redirect(
      buildOAuthErrorRedirect(
        returnTo,
        `${provider === "google" ? "Google" : "Facebook"} sign-in could not be completed. Please use email registration for now.`,
      ),
    );
  }
}
