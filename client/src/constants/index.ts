export const APP_NAME = "Ledgerly";

export const EXPENSE_CATEGORIES = [
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
] as const;

export const INCOME_CATEGORIES = ["Salary", "Freelance", "Investments", "Other"] as const;

export const TRANSACTION_TYPES = ["income", "expense"] as const;

export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const CURRENCIES = ["INR", "USD", "EUR"] as const;
export type CurrencyCode = (typeof CURRENCIES)[number];

export const CURRENCY_META: Record<
  CurrencyCode,
  { code: CurrencyCode; label: string; symbol: string; locale: string }
> = {
  INR: { code: "INR", label: "Indian Rupee", symbol: "₹", locale: "en-IN" },
  USD: { code: "USD", label: "US Dollar", symbol: "$", locale: "en-US" },
  EUR: { code: "EUR", label: "Euro", symbol: "€", locale: "de-DE" },
};

export function categoriesForType(type: TransactionType): string[] {
  return type === "income" ? [...INCOME_CATEGORIES] : [...EXPENSE_CATEGORIES];
}

export const ALL_CATEGORIES = Array.from(
  new Set<string>([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]),
);

export const FOOTER_SECTIONS = [
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Careers", to: "/careers" },
      { label: "Blog", to: "/blog" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", to: "/documentation" },
      { label: "Help Center", to: "/help" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
    ],
  },
] as const;