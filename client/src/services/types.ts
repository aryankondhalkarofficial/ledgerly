import type { CurrencyCode, TransactionType } from "@/constants";

export type User = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  currency?: CurrencyCode;
  createdAt?: string;
  updatedAt?: string;
};

export type Transaction = {
  _id?: string;
  id?: string;
  title: string;
  note?: string;
  amount: number;
  type: TransactionType;
  date: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TransactionPayload = {
  title: string;
  note?: string;
  amount: number;
  type: TransactionType;
  date: string;
  category: string;
};

export function transactionId(transaction: Transaction): string {
  return String(transaction._id ?? transaction.id ?? "");
}