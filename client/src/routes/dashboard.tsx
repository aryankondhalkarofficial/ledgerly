import { createFileRoute, Link } from "@tanstack/react-router";
import { PlusCircle } from "lucide-react";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { DashboardSkeleton, ErrorState } from "@/components/common/StateBlocks";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useTransactions } from "@/hooks/use-transactions";
import { computeTotals } from "@/utils/transactions";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Ledgerly" },
      {
        name: "description",
        content: "See your balance, income, expenses and category insights at a glance.",
      },
      { property: "og:title", content: "Dashboard — Ledgerly" },
      { property: "og:description", content: "Balance, income, expenses and spending trends." },
    ],
  }),
  component: () => (
    <RequireAuth>
      <AppLayout>
        <DashboardPage />
      </AppLayout>
    </RequireAuth>
  ),
});

function DashboardPage() {
  const { user } = useAuth();
  const { data, isPending, isError, error, refetch } = useTransactions();
  const transactions = data ?? [];
  const totals = computeTotals(transactions);

  return (
    <>
      <PageHeader
        title={`Hello${user?.name ? `, ${user.name.split(" ")[0]}` : ""}`}
        description="Here's how your money is moving."
        actions={
          <Button asChild>
            <Link to="/transactions/new">
              <PlusCircle className="size-4" aria-hidden /> Add transaction
            </Link>
          </Button>
        }
      />

      {isPending ? (
        <DashboardSkeleton />
      ) : isError ? (
        <ErrorState
          title="We couldn't load your transactions"
          description={(error as Error).message}
          onRetry={() => void refetch()}
        />
      ) : (
        <div className="space-y-6 lg:space-y-8">
          <SummaryCards totals={totals} count={transactions.length} />
          <div className="grid gap-6 lg:grid-cols-2">
            <TrendChart transactions={transactions} />
            <CategoryBreakdown transactions={transactions} />
          </div>
          <RecentTransactions transactions={transactions} />
        </div>
      )}
    </>
  );
}