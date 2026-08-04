import { ApiError, apiRequest, unwrap } from "./api-client";
import type { User } from "./types";

export type LoginInput = { email: string; password: string };
export type RegisterInput = { name: string; email: string; password: string };

export async function getCurrentUser(): Promise<User | null> {
  try {
    const payload = await apiRequest<unknown>("/api/users/me", { silentUnauthorized: true });
    const user = unwrap<User | null>(payload, ["user", "me", "data"]);
    return user && typeof user === "object" ? user : null;
  } catch (error) {
    // The session bootstrap must never break the app shell. A 401 means signed
    // out; an unreachable/erroring backend (status 0 or 5xx, e.g. no Express
    // server running) is treated the same way so the public pages still render
    // instead of every route falling into an error boundary.
    if (error instanceof ApiError) return null;
    return null;
  }
}

export async function login(input: LoginInput): Promise<User | null> {
  const payload = await apiRequest<unknown>("/api/users/login", {
    method: "POST",
    body: input,
    silentUnauthorized: true,
  });
  return unwrap<User | null>(payload, ["user", "data"]);
}

export async function register(input: RegisterInput): Promise<User | null> {
  const payload = await apiRequest<unknown>("/api/users/register", {
    method: "POST",
    body: input,
    silentUnauthorized: true,
  });
  return unwrap<User | null>(payload, ["user", "data"]);
}

export async function logout(): Promise<void> {
  await apiRequest("/api/users/logout", { method: "POST", silentUnauthorized: true });
}