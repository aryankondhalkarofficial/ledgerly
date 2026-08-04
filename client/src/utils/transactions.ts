import type { Transaction } from "@/services/types";

export type Totals = { income: number; expense: number; balance: number };

export function computeTotals(transactions: Transaction[]): Totals {
  let income = 0;
  let expense = 0;
  for (const t of transactions) {
    const amount = Number(t.amount) || 0;
    if (t.type === "income") income += amount;
    else expense += amount;
  }
  return { income, expense, balance: income - expense };
}

export function groupByCategory(transactions: Transaction[], type: "income" | "expense") {
  const map = new Map<string, number>();
  for (const t of transactions) {
    if (t.type !== type) continue;
    const key = t.category || "Other";
    map.set(key, (map.get(key) ?? 0) + (Number(t.amount) || 0));
  }
  return Array.from(map, ([category, total]) => ({ category, total })).sort(
    (a, b) => b.total - a.total,
  );
}

export function monthlySeries(transactions: Transaction[], months = 6) {
  const buckets: { key: string; label: string; income: number; expense: number }[] = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleDateString("en-GB", { month: "short" }),
      income: 0,
      expense: 0,
    });
  }
  const index = new Map(buckets.map((b) => [b.key, b]));
  for (const t of transactions) {
    const d = new Date(t.date);
    if (Number.isNaN(d.getTime())) continue;
    const bucket = index.get(`${d.getFullYear()}-${d.getMonth()}`);
    if (!bucket) continue;
    const amount = Number(t.amount) || 0;
    if (t.type === "income") bucket.income += amount;
    else bucket.expense += amount;
  }
  return buckets;
}

export function sortTransactions(
  transactions: Transaction[],
  sort: "date-desc" | "date-asc" | "amount-desc" | "amount-asc",
) {
  const copy = [...transactions];
  copy.sort((a, b) => {
    if (sort.startsWith("amount")) {
      const diff = (Number(a.amount) || 0) - (Number(b.amount) || 0);
      return sort === "amount-asc" ? diff : -diff;
    }
    const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
    return sort === "date-asc" ? diff : -diff;
  });
  return copy;
}