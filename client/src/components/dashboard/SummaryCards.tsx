import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useCurrency } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { formatCurrency, formatPercent } from "@/utils/format";
import type { Totals } from "@/utils/transactions";

export function SummaryCards({ totals, count }: { totals: Totals; count: number }) {
  // Static classes so Tailwind can see them (dynamic interpolation isn't scanned).
  const stagger = ["stagger-0", "stagger-1", "stagger-2"] as const;
  const currency = useCurrency();
  const savingsRate = totals.income > 0 ? (totals.balance / totals.income) * 100 : 0;

  const cards = [
    {
      label: "Total balance",
      value: formatCurrency(totals.balance, currency),
      hint: `${formatPercent(savingsRate)} of income kept`,
      icon: Wallet,
      tone: "brand" as const,
    },
    {
      label: "Total income",
      value: formatCurrency(totals.income, currency),
      hint: `${count} transactions tracked`,
      icon: ArrowUpRight,
      tone: "success" as const,
    },
    {
      label: "Total expenses",
      value: formatCurrency(totals.expense, currency),
      hint:
        totals.income > 0
          ? `${formatPercent((totals.expense / totals.income) * 100)} of income spent`
          : "No income recorded yet",
      icon: ArrowDownRight,
      tone: "destructive" as const,
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {cards.map((card, index) => (
        <Card
          key={card.label}
          className={cn("card-surface card-interactive animate-rise overflow-hidden", stagger[index])}
        >
          <CardContent className="flex items-start justify-between gap-4 p-6 sm:p-6">
            <div className="min-w-0 space-y-1.5">
              <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
              <p className="truncate font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
                {card.value}
              </p>
              <p className="text-xs text-muted-foreground">{card.hint}</p>
            </div>
            <span
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-xl",
                card.tone === "brand" && "surface-brand",
                card.tone === "success" && "bg-success/12 text-success",
                card.tone === "destructive" && "bg-destructive/12 text-destructive",
              )}
            >
              <card.icon className="size-5" aria-hidden />
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}