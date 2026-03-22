import "server-only";

import { createHmac, timingSafeEqual } from "crypto";

import { cookies } from "next/headers";

const sessionCookieName = "pk_admin_session";

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_DASHBOARD_KEY || "";
}

function signValue(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "",
    password: process.env.ADMIN_PASSWORD || "",
  };
}

export function isAdminCredentialValid(username: string, password: string) {
  const creds = getAdminCredentials();
  return Boolean(
    creds.username &&
      creds.password &&
      username === creds.username &&
      password === creds.password
  );
}

export async function createAdminSession(username: string) {
  const cookieStore = await cookies();
  const payload = `${username}.${signValue(username)}`;
  cookieStore.set(sessionCookieName, payload, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
}

export async function isAdminAuthenticated() {
  const creds = getAdminCredentials();
  const secret = getSessionSecret();

  if (!creds.username || !creds.password || !secret) {
    return false;
  }

  const cookieStore = await cookies();
  const raw = cookieStore.get(sessionCookieName)?.value;
  if (!raw) return false;

  const [username, signature] = raw.split(".");
  if (!username || !signature) return false;

  const expected = signValue(username);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);

  if (a.length !== b.length) return false;
  if (!timingSafeEqual(a, b)) return false;

  return username === creds.username;
}
