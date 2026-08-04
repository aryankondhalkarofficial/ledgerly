/**
 * Centralized API client.
 * - Always sends cookies (HTTP-only JWT auth).
 * - Normalizes error messages coming from the Express backend.
 * - Broadcasts 401s so the auth layer can react (redirect / session expiry).
 */
export const API_BASE_URL = (import.meta.env['VITE_API_BASE_URL'] as string | undefined) ?? "";

export const UNAUTHORIZED_EVENT = "ledgerly:unauthorized";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  /** Skip broadcasting the unauthorized event (used by the session bootstrap call). */
  silentUnauthorized?: boolean;
  signal?: AbortSignal;
};

function extractMessage(payload: unknown, fallback: string): string {
  if (typeof payload === "string" && payload.trim()) return payload;
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    for (const key of ["message", "error", "msg"]) {
      const value = record[key];
      if (typeof value === "string" && value.trim()) return value;
    }
    const errors = record['errors'];
    if (Array.isArray(errors) && errors.length) {
      const first = errors[0];
      if (typeof first === "string") return first;
      if (first && typeof first === "object" && typeof (first as { message?: string }).message === "string") {
        return (first as { message: string }).message;
      }
    }
  }
  return fallback;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, silentUnauthorized, signal } = options;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: "include",
      signal: signal ?? null,
      headers: body === undefined ? { Accept: "application/json" } : { Accept: "application/json", "Content-Type": "application/json" },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError("Can't reach the server. Check your connection and try again.", 0);
  }

  const raw = await response.text();
  let payload: unknown = null;
  if (raw) {
    try {
      payload = JSON.parse(raw);
    } catch {
      payload = raw;
    }
  }

  if (!response.ok) {
    if (response.status === 401 && !silentUnauthorized && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));
    }
    throw new ApiError(
      extractMessage(payload, defaultMessageForStatus(response.status)),
      response.status,
      payload,
    );
  }

  return payload as T;
}

function defaultMessageForStatus(status: number): string {
  if (status === 400) return "Please check the submitted details.";
  if (status === 401) return "Your session has expired. Please sign in again.";
  if (status === 403) return "You don't have permission to do that.";
  if (status === 404) return "We couldn't find what you were looking for.";
  if (status === 409) return "That record already exists.";
  if (status >= 500) return "Something went wrong on the server. Please try again.";
  return "Request failed. Please try again.";
}

/** Unwraps common Express response envelopes: `{ data }`, `{ user }`, `{ transaction(s) }`. */
export function unwrap<T>(payload: unknown, keys: string[]): T {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    const record = payload as Record<string, unknown>;
    for (const key of keys) {
      if (record[key] !== undefined && record[key] !== null) return record[key] as T;
    }
    if (record['data'] && typeof record['data'] === "object") {
      const nested = record['data'] as Record<string, unknown>;
      for (const key of keys) {
        if (nested[key] !== undefined && nested[key] !== null) return nested[key] as T;
      }
    }
  }
  return payload as T;
}