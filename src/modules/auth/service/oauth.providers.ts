import { createHash, randomBytes } from "node:crypto";

import { config } from "#config/env";
import { BadRequestError, UnauthorizedError } from "#shared/errors/app-error";

export type OAuthProviderName = "GOOGLE" | "GITHUB" | "FACEBOOK";

export type OAuthStatePayload = {
  provider: OAuthProviderName;
  createdAt: number;
};

export type OAuthIdentity = {
  provider: OAuthProviderName;
  providerAccountId: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  usernameSeed: string;
};

type OAuthProviderConfig = {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  authUrl: string;
  tokenUrl: string;
  scopes: string[];
  userInfoUrl?: string;
};

const STATE_TTL_SECONDS = 10 * 60;

const providerConfigs: Record<OAuthProviderName, OAuthProviderConfig> = {
  GOOGLE: {
    clientId: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackUrl: config.GOOGLE_CALLBACK_URL,
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    scopes: ["openid", "email", "profile"],
    userInfoUrl: "https://openidconnect.googleapis.com/v1/userinfo",
  },
  GITHUB: {
    clientId: config.GITHUB_CLIENT_ID,
    clientSecret: config.GITHUB_CLIENT_SECRET,
    callbackUrl: config.GITHUB_CALLBACK_URL,
    authUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
    scopes: ["read:user", "user:email"],
    userInfoUrl: "https://api.github.com/user",
  },
  FACEBOOK: {
    clientId: config.FACEBOOK_CLIENT_ID,
    clientSecret: config.FACEBOOK_CLIENT_SECRET,
    callbackUrl: config.FACEBOOK_CALLBACK_URL,
    authUrl: "https://www.facebook.com/v21.0/dialog/oauth",
    tokenUrl: "https://graph.facebook.com/v21.0/oauth/access_token",
    scopes: ["email", "public_profile"],
    userInfoUrl: "https://graph.facebook.com/me",
  },
};

function requireProviderConfig(provider: OAuthProviderName) {
  const providerConfig = providerConfigs[provider];

  if (!providerConfig.clientId || !providerConfig.clientSecret || !providerConfig.callbackUrl) {
    throw new BadRequestError(`Konfigurasi OAuth ${provider} belum lengkap`);
  }

  return providerConfig;
}

function base64Url(input: Buffer) {
  return input.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function createOAuthStatePayload(provider: OAuthProviderName) {
  return {
    provider,
    createdAt: Date.now(),
  } satisfies OAuthStatePayload;
}

export function createOAuthStateToken() {
  return randomBytes(32).toString("hex");
}

export function createOAuthAuthorizationUrl(provider: OAuthProviderName, state: string) {
  const cfg = requireProviderConfig(provider);
  const url = new URL(cfg.authUrl);

  url.searchParams.set("client_id", cfg.clientId);
  url.searchParams.set("redirect_uri", cfg.callbackUrl);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", cfg.scopes.join(" "));
  url.searchParams.set("state", state);

  if (provider === "GOOGLE") {
    url.searchParams.set("access_type", "offline");
    url.searchParams.set("prompt", "consent");
    url.searchParams.set("include_granted_scopes", "true");
  }

  return url.toString();
}

async function exchangeCode(provider: OAuthProviderName, code: string) {
  const cfg = requireProviderConfig(provider);
  const body = new URLSearchParams({
    client_id: cfg.clientId,
    client_secret: cfg.clientSecret,
    code,
    redirect_uri: cfg.callbackUrl,
    grant_type: "authorization_code",
  });

  const response = await fetch(cfg.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body,
  });

  if (!response.ok) {
    throw new UnauthorizedError(`Gagal menukar code OAuth ${provider}`);
  }

  return (await response.json()) as {
    access_token?: string;
    token_type?: string;
    scope?: string;
    id_token?: string;
  };
}

function normalizeEmail(email: string | null | undefined) {
  const normalized = email?.trim().toLowerCase() ?? "";

  return normalized || null;
}

function normalizeSeed(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");

  const seed = slug || base64Url(createHash("sha256").update(value).digest()).slice(0, 10);

  return seed.slice(0, 24);
}

async function fetchGoogleIdentity(code: string) {
  const tokens = await exchangeCode("GOOGLE", code);

  if (!tokens.access_token) {
    throw new UnauthorizedError("Google tidak mengembalikan access token");
  }

  const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
    },
  });

  if (!response.ok) {
    throw new UnauthorizedError("Gagal mengambil profil Google");
  }

  const profile = (await response.json()) as {
    sub?: string;
    email?: string;
    email_verified?: boolean;
    name?: string;
    given_name?: string;
    picture?: string;
  };

  const email = normalizeEmail(profile.email);

  if (!email || !profile.email_verified) {
    throw new UnauthorizedError("Email Google tidak terverifikasi");
  }

  return {
    provider: "GOOGLE" as const,
    providerAccountId: profile.sub ?? "",
    email,
    emailVerified: true,
    displayName: profile.name ?? profile.given_name ?? email,
    usernameSeed: normalizeSeed(profile.given_name ?? profile.name ?? email),
  };
}

async function fetchGithubIdentity(code: string) {
  const tokens = await exchangeCode("GITHUB", code);

  if (!tokens.access_token) {
    throw new UnauthorizedError("GitHub tidak mengembalikan access token");
  }

  const [profileResponse, emailsResponse] = await Promise.all([
    fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "Aether",
      },
    }),
    fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "Aether",
      },
    }),
  ]);

  if (!profileResponse.ok) {
    throw new UnauthorizedError("Gagal mengambil profil GitHub");
  }

  const profile = (await profileResponse.json()) as {
    id?: number;
    login?: string;
    name?: string | null;
    email?: string | null;
  };

  let email = normalizeEmail(profile.email);
  let emailVerified = false;

  if (emailsResponse.ok) {
    const emails = (await emailsResponse.json()) as Array<{
      email?: string;
      primary?: boolean;
      verified?: boolean;
      visibility?: string | null;
    }>;

    const primaryVerified = emails.find((item) => item.primary && item.verified);
    const anyVerified = emails.find((item) => item.verified);
    const selected = primaryVerified ?? anyVerified;

    if (selected?.email) {
      email = normalizeEmail(selected.email);
      emailVerified = Boolean(selected.verified);
    }
  }

  if (!email || !emailVerified) {
    throw new UnauthorizedError("Email GitHub tidak tersedia atau belum terverifikasi");
  }

  return {
    provider: "GITHUB" as const,
    providerAccountId: profile.id?.toString() ?? "",
    email,
    emailVerified: true,
    displayName: profile.name ?? profile.login ?? email,
    usernameSeed: normalizeSeed(profile.login ?? profile.name ?? email),
  };
}

async function fetchFacebookIdentity(code: string) {
  const tokens = await exchangeCode("FACEBOOK", code);

  if (!tokens.access_token) {
    throw new UnauthorizedError("Facebook tidak mengembalikan access token");
  }

  const response = await fetch(
    "https://graph.facebook.com/me?fields=id,name,email&access_token=" +
      encodeURIComponent(tokens.access_token),
  );

  if (!response.ok) {
    throw new UnauthorizedError("Gagal mengambil profil Facebook");
  }

  const profile = (await response.json()) as {
    id?: string;
    name?: string;
    email?: string;
  };

  const email = normalizeEmail(profile.email);

  if (!email) {
    throw new UnauthorizedError("Email Facebook tidak tersedia");
  }

  return {
    provider: "FACEBOOK" as const,
    providerAccountId: profile.id ?? "",
    email,
    emailVerified: true,
    displayName: profile.name ?? email,
    usernameSeed: normalizeSeed(profile.name ?? email),
  };
}

export async function fetchOAuthIdentity(
  provider: OAuthProviderName,
  code: string,
): Promise<OAuthIdentity> {
  if (!code) {
    throw new UnauthorizedError("OAuth code tidak valid");
  }

  switch (provider) {
    case "GOOGLE":
      return fetchGoogleIdentity(code);
    case "GITHUB":
      return fetchGithubIdentity(code);
    case "FACEBOOK":
      return fetchFacebookIdentity(code);
    default:
      throw new BadRequestError("Provider OAuth tidak didukung");
  }
}

export function encodeOAuthStatePayload(payload: OAuthStatePayload) {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function decodeOAuthStatePayload(value: string) {
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as OAuthStatePayload;
  } catch {
    throw new UnauthorizedError("State OAuth tidak valid");
  }
}

export const oauthStateTtlSeconds = STATE_TTL_SECONDS;
