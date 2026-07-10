import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

import { type ServiceIntent, normalizeServiceIntent } from "@/lib/service-intents";

export type OAuthProvider = "google" | "facebook";

export type OAuthProfile = {
  email: string;
  firstName: string;
  lastName: string;
};

export type OAuthState = {
  nonce: string;
  provider: OAuthProvider;
  returnTo: string;
  serviceIntent: ServiceIntent | null;
  packageKey: string | null;
  packageLabel: string | null;
  issuedAt: number;
};

const OAUTH_SECRET =
  process.env.PATENTZOOM_AUTH_SECRET ?? "patentzoom-dev-session-secret";
const STATE_MAX_AGE_MS = 10 * 60 * 1000;

function getAppUrl(requestUrl: string) {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    new URL(requestUrl).origin
  ).replace(/\/$/, "");
}

function getProviderConfig(provider: OAuthProvider) {
  if (provider === "google") {
    return {
      clientId:
        process.env.GOOGLE_CLIENT_ID ?? process.env.PATENTZOOM_GOOGLE_CLIENT_ID,
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET ??
        process.env.PATENTZOOM_GOOGLE_CLIENT_SECRET,
    };
  }

  return {
    clientId:
      process.env.FACEBOOK_CLIENT_ID ??
      process.env.PATENTZOOM_FACEBOOK_CLIENT_ID,
    clientSecret:
      process.env.FACEBOOK_CLIENT_SECRET ??
      process.env.PATENTZOOM_FACEBOOK_CLIENT_SECRET,
  };
}

function sanitizeReturnTo(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

export function isOAuthProvider(value: string): value is OAuthProvider {
  return value === "google" || value === "facebook";
}

export function getOAuthCallbackUrl(provider: OAuthProvider, requestUrl: string) {
  return `${getAppUrl(requestUrl)}/api/auth/oauth/${provider}/callback`;
}

export function getOAuthConfiguration(provider: OAuthProvider) {
  return getProviderConfig(provider);
}

export function createOAuthState(input: {
  provider: OAuthProvider;
  returnTo: string | null;
  serviceIntent: string | null;
  packageKey: string | null;
  packageLabel: string | null;
}) {
  const state: OAuthState = {
    nonce: randomBytes(16).toString("hex"),
    provider: input.provider,
    returnTo: sanitizeReturnTo(input.returnTo),
    serviceIntent: normalizeServiceIntent(input.serviceIntent),
    packageKey: input.packageKey?.trim() || null,
    packageLabel: input.packageLabel?.trim() || null,
    issuedAt: Date.now(),
  };
  const payload = Buffer.from(JSON.stringify(state)).toString("base64url");
  const signature = createHmac("sha256", OAUTH_SECRET)
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}

export function readOAuthState(value: string | null, provider: OAuthProvider) {
  if (!value) {
    return null;
  }

  const [payload, signature] = value.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expected = createHmac("sha256", OAUTH_SECRET)
    .update(payload)
    .digest("base64url");
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const state = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as OAuthState;

    if (
      state.provider !== provider ||
      Date.now() - state.issuedAt > STATE_MAX_AGE_MS
    ) {
      return null;
    }

    return state;
  } catch {
    return null;
  }
}

export function buildOAuthErrorRedirect(returnTo: string, message: string) {
  const redirectUrl = new URL(returnTo, "https://patentzoom.local");
  redirectUrl.searchParams.set("authMessage", message);
  return `${redirectUrl.pathname}${redirectUrl.search}`;
}

export async function exchangeOAuthCode(input: {
  provider: OAuthProvider;
  code: string;
  redirectUri: string;
}) {
  const config = getProviderConfig(input.provider);

  if (!config.clientId || !config.clientSecret) {
    throw new Error(`${input.provider} OAuth is not configured.`);
  }

  if (input.provider === "google") {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code: input.code,
        grant_type: "authorization_code",
        redirect_uri: input.redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error("Google did not accept the login code.");
    }

    const token = (await response.json()) as { access_token?: string };

    if (!token.access_token) {
      throw new Error("Google did not return an access token.");
    }

    const profileResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      },
    );

    if (!profileResponse.ok) {
      throw new Error("Google profile could not be loaded.");
    }

    const profile = (await profileResponse.json()) as {
      email?: string;
      given_name?: string;
      family_name?: string;
      name?: string;
    };

    return normalizeOAuthProfile(profile);
  }

  const tokenUrl = new URL("https://graph.facebook.com/oauth/access_token");
  tokenUrl.searchParams.set("client_id", config.clientId);
  tokenUrl.searchParams.set("client_secret", config.clientSecret);
  tokenUrl.searchParams.set("code", input.code);
  tokenUrl.searchParams.set("redirect_uri", input.redirectUri);

  const tokenResponse = await fetch(tokenUrl);

  if (!tokenResponse.ok) {
    throw new Error("Facebook did not accept the login code.");
  }

  const token = (await tokenResponse.json()) as { access_token?: string };

  if (!token.access_token) {
    throw new Error("Facebook did not return an access token.");
  }

  const profileUrl = new URL("https://graph.facebook.com/me");
  profileUrl.searchParams.set("fields", "email,first_name,last_name,name");
  profileUrl.searchParams.set("access_token", token.access_token);

  const profileResponse = await fetch(profileUrl);

  if (!profileResponse.ok) {
    throw new Error("Facebook profile could not be loaded.");
  }

  const profile = (await profileResponse.json()) as {
    email?: string;
    first_name?: string;
    last_name?: string;
    name?: string;
  };

  return normalizeOAuthProfile({
    email: profile.email,
    given_name: profile.first_name,
    family_name: profile.last_name,
    name: profile.name,
  });
}

function normalizeOAuthProfile(profile: {
  email?: string;
  given_name?: string;
  family_name?: string;
  name?: string;
}): OAuthProfile {
  if (!profile.email) {
    throw new Error("The provider did not return a verified email address.");
  }

  const fallbackName = profile.name?.trim() || profile.email.split("@")[0] || "";
  const [fallbackFirstName = "", ...fallbackLastName] = fallbackName.split(" ");

  return {
    email: profile.email.trim().toLowerCase(),
    firstName: profile.given_name?.trim() || fallbackFirstName,
    lastName: profile.family_name?.trim() || fallbackLastName.join(" "),
  };
}
