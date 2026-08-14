export const REFRESH_TOKEN_COOKIE = "refreshToken";
export const CSRF_TOKEN_COOKIE = "csrfToken";

export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict" as const,
  path: "/api/auth",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

export const csrfTokenCookieOptions = {
  httpOnly: false,
  secure: true,
  sameSite: "strict" as const,
  path: "/api/auth",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};
