import { apiRequest, unwrap } from "./api-client";
import type { Transaction, TransactionPayload } from "./types";

export async function listTransactions(): Promise<Transaction[]> {
  const payload = await apiRequest<unknown>("/api/transactions");
  const value = unwrap<Transaction[]>(payload, ["transactions", "items", "results", "data"]);
  return Array.isArray(value) ? value : [];
}

export async function getTransaction(id: string): Promise<Transaction> {
  const payload = await apiRequest<unknown>(`/api/transactions/${id}`);
  return unwrap<Transaction>(payload, ["transaction", "data"]);
}

export async function createTransaction(input: TransactionPayload): Promise<Transaction> {
  const payload = await apiRequest<unknown>("/api/transactions", { method: "POST", body: input });
  return unwrap<Transaction>(payload, ["transaction", "data"]);
}

export async function updateTransaction(
  id: string,
  input: Partial<TransactionPayload>,
): Promise<Transaction> {
  const payload = await apiRequest<unknown>(`/api/transactions/${id}`, {
    method: "PATCH",
    body: input,
  });
  return unwrap<Transaction>(payload, ["transaction", "data"]);
}

export async function deleteTransaction(id: string): Promise<void> {
  await apiRequest(`/api/transactions/${id}`, { method: "DELETE" });
}