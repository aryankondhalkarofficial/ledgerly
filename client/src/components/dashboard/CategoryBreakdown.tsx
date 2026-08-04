import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { EmptyState } from "@/components/common/StateBlocks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCurrency } from "@/contexts/auth-context";
import type { Transaction } from "@/services/types";
import { formatCurrency } from "@/utils/format";
import { groupByCategory } from "@/utils/transactions";

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

export function CategoryBreakdown({ transactions }: { transactions: Transaction[] }) {
  const currency = useCurrency();
  const data = groupByCategory(transactions, "expense");
  const total = data.reduce((sum, item) => sum + item.total, 0);
  const top = data.slice(0, 5);

  return (
    <Card className="card-surface card-interactive animate-rise stagger-3">
      <CardHeader>
        <CardTitle>Spending by category</CardTitle>
        <CardDescription>Where your money goes, in {currency}</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <EmptyState
            title="No expenses yet"
            description="Add your first expense to see a category breakdown."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={top}
                    dataKey="total"
                    nameKey="category"
                    innerRadius={52}
                    outerRadius={80}
                    paddingAngle={3}
                    stroke="var(--color-card)"
                  >
                    {top.map((entry, index) => (
                      <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "0.75rem",
                      color: "var(--color-popover-foreground)",
                    }}
                    formatter={(value: number, name: string) => [
                      formatCurrency(Number(value), currency),
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-3">
              {top.map((item, index) => (
                <li key={item.category} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        aria-hidden
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ background: COLORS[index % COLORS.length] }}
                      />
                      <span className="truncate font-medium">{item.category}</span>
                    </span>
                    <span className="tabular-nums text-muted-foreground">
                      {formatCurrency(item.total, currency)}
                    </span>
                  </div>
                  <Progress value={total > 0 ? (item.total / total) * 100 : 0} className="h-1.5" />
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}