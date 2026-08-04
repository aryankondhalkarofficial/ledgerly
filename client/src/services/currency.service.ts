import type { CurrencyCode } from "@/constants";
import { apiRequest, unwrap } from "./api-client";
import type { User } from "./types";

export async function updateCurrency(currency: CurrencyCode): Promise<User | null> {
  const payload = await apiRequest<unknown>("/api/currency", {
    method: "PATCH",
    body: { currency },
  });
  return unwrap<User | null>(payload, ["user", "data"]);
}