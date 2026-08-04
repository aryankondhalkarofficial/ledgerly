import { z } from "zod";
import { CURRENCIES, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/constants";

// Mirrors the backend Zod schemas exactly: password must be at least 8 characters.
const passwordMinLength = 8;

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(passwordMinLength, `Password must be at least ${passwordMinLength} characters`),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(60, "Name is too long"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(passwordMinLength, `Password must be at least ${passwordMinLength} characters`),
});

const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES] as [string, ...string[]];

export const transactionSchema = z
  .object({
    title: z.string().min(2, "Title must be at least 2 characters").max(80, "Title is too long"),
    note: z.string().max(300, "Note is too long").optional().or(z.literal("")),
    amount: z
      .string()
      .min(1, "Amount is required")
      .refine((v) => Number(v) > 0, "Amount must be greater than 0")
      .refine((v) => Number(v) < 1_000_000_000, "Amount is too large"),
    type: z.enum(["income", "expense"]),
    date: z.string().min(1, "Date is required"),
    category: z.enum(allCategories),
  })
  .refine(
    (data) =>
      data.type === "income"
        ? (INCOME_CATEGORIES as readonly string[]).includes(data.category)
        : (EXPENSE_CATEGORIES as readonly string[]).includes(data.category),
    { path: ["category"], message: "Pick a category that matches the transaction type" },
  );

export type TransactionFormValues = z.infer<typeof transactionSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const currencySchema = z.enum(CURRENCIES);