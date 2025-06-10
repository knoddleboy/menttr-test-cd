import { addMilliseconds } from "date-fns";
import { CookieOptions } from "express";
import ms, { StringValue } from "ms";

export function getCookieOptions(grantType: "access" | "refresh") {
  const options: CookieOptions = {
    httpOnly: true,
    sameSite: "strict",
    // secure: true,
  };

  if (grantType === "access") {
    const ttl = process.env.JWT_ACCESS_TOKEN_TTL || "1d";
    const expiresInMs = ms(ttl as StringValue);
    const expiresAt = addMilliseconds(new Date().getTime(), expiresInMs);
    options.maxAge = expiresInMs;
    options.expires = expiresAt;
  } else if (grantType === "refresh") {
    const ttl = process.env.JWT_REFRESH_TOKEN_TTL || "14d";
    const expiresInMs = ms(ttl as StringValue);
    const expiresAt = addMilliseconds(new Date().getTime(), expiresInMs);
    options.maxAge = expiresInMs;
    options.expires = expiresAt;
    // options.path = "/refresh";
  }

  return options;
}
