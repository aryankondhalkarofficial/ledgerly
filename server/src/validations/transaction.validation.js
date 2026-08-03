import { z } from "zod";

const expenseCategories = [
  "Food",
  "Groceries",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Other",
];

const incomeCategories = ["Salary", "Freelance", "Investments", "Other"];

// Create transaction (POST)
export const createTransactionSchema = z.discriminatedUnion("type", [
  z.object({
    title: z.string().trim().min(2).max(100),
    note: z.string().trim().min(2).max(1000).optional(),
    amount: z.number().positive(),
    type: z.literal("expense"),
    date: z.coerce.date().optional(),
    category: z.enum(expenseCategories),
  }),
  z.object({
    title: z.string().trim().min(2).max(100),
    note: z.string().trim().min(2).max(1000).optional(),
    amount: z.number().positive(),
    type: z.literal("income"),
    date: z.coerce.date().optional(),
    category: z.enum(incomeCategories),
  }),
]);

// Update transaction (PATCH)
export const updateTransactionSchema = z
  .object({
    title: z.string().trim().min(2).max(100).optional(),
    note: z.string().trim().min(2).max(1000).optional(),
    amount: z.number().positive().optional(),
    type: z.enum(["income", "expense"]).optional(),
    date: z.coerce.date().optional(),
    category: z.string().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  })
  .superRefine((data, ctx) => {
    if (data.type === "expense" && data.category) {
      if (!expenseCategories.includes(data.category)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["category"],
          message: "Invalid category for expense transaction",
        });
      }
    }

    if (data.type === "income" && data.category) {
      if (!incomeCategories.includes(data.category)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["category"],
          message: "Invalid category for income transaction",
        });
      }
    }
  });
