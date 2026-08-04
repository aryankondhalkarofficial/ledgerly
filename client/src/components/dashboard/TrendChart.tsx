import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/contexts/auth-context";
import { formatCurrency } from "@/utils/format";
import type { Transaction } from "@/services/types";
import { monthlySeries } from "@/utils/transactions";

export function TrendChart({ transactions }: { transactions: Transaction[] }) {
  const currency = useCurrency();
  const data = monthlySeries(transactions, 6);

  return (
    <Card className="card-surface card-interactive animate-rise stagger-4">
      <CardHeader>
        <CardTitle>Income vs expenses</CardTitle>
        <CardDescription>Last 6 months, in {currency}</CardDescription>
      </CardHeader>
      <CardContent className="h-[290px] pr-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-success)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-destructive)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--color-destructive)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={70}
              tickFormatter={(value: number) => formatCurrency(value, currency, { compact: true })}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-popover)",
                border: "1px solid var(--color-border)",
                borderRadius: "0.75rem",
                color: "var(--color-popover-foreground)",
              }}
              formatter={(value: number, name: string) => [
                formatCurrency(Number(value), currency),
                name === "income" ? "Income" : "Expenses",
              ]}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="var(--color-success)"
              strokeWidth={2}
              fill="url(#incomeFill)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="var(--color-destructive)"
              strokeWidth={2}
              fill="url(#expenseFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}