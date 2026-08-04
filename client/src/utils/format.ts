import { CURRENCY_META, type CurrencyCode } from "@/constants";

export function currencySymbol(currency: CurrencyCode): string {
  return CURRENCY_META[currency]?.symbol ?? "$";
}

export function formatCurrency(
  amount: number,
  currency: CurrencyCode,
  options: { compact?: boolean; signed?: boolean } = {},
): string {
  const meta = CURRENCY_META[currency] ?? CURRENCY_META.USD;
  const value = Number.isFinite(amount) ? amount : 0;
  const formatted = new Intl.NumberFormat(meta.locale, {
    style: "currency",
    currency: meta.code,
    notation: options.compact ? "compact" : "standard",
    maximumFractionDigits: options.compact ? 1 : 2,
    minimumFractionDigits: options.compact ? 0 : 2,
  }).format(Math.abs(value));

  if (!options.signed) return value < 0 ? `-${formatted}` : formatted;
  return `${value < 0 ? "−" : "+"}${formatted}`;
}

export function formatDate(value: string | Date, style: "short" | "long" = "short"): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: style === "long" ? "long" : "short",
    year: "numeric",
    ...(style === "long" ? { weekday: "long" } : {}),
  }).format(date);
}

export function toDateInputValue(value?: string | Date): string {
  const date = value ? (value instanceof Date ? value : new Date(value)) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export function initials(name?: string): string {
  if (!name) return "LG";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return "0%";
  return `${Math.round(value)}%`;
}