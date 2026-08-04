import { Link } from "@tanstack/react-router";
import { ArrowRight, PlusCircle } from "lucide-react";

import { EmptyState } from "@/components/common/StateBlocks";
import { CategoryBadge } from "@/components/transactions/CategoryBadge";
import { TransactionAmount } from "@/components/transactions/TransactionAmount";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { transactionId, type Transaction } from "@/services/types";
import { formatDate } from "@/utils/format";
import { sortTransactions } from "@/utils/transactions";

export function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  const recent = sortTransactions(transactions, "date-desc").slice(0, 6);

  return (
    <Card className="card-surface card-interactive animate-rise stagger-5">
      <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
        <div className="space-y-1">
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>Your latest six records</CardDescription>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link to="/transactions">
            View all <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        {recent.length === 0 ? (
          <EmptyState
            title="Nothing here yet"
            description="Record your first income or expense to start seeing insights."
            action={
              <Button asChild>
                <Link to="/transactions/new">
                  <PlusCircle className="size-4" aria-hidden /> Add transaction
                </Link>
              </Button>
            }
          />
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((transaction) => {
              const id = transactionId(transaction);
              return (
                <li key={id}>
                  <Link
                    to="/transactions/$id"
                    params={{ id }}
                    className="flex items-center justify-between gap-3 rounded-lg px-2 py-4 transition-colors duration-200 hover:bg-accent/50"
                  >
                    <div className="min-w-0 space-y-1">
                      <p className="truncate text-sm font-medium">{transaction.title}</p>
                      <p className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CategoryBadge category={transaction.category} />
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                    <TransactionAmount amount={Number(transaction.amount) || 0} type={transaction.type} />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}