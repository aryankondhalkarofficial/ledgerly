import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { ErrorState, LoadingState } from "@/components/common/StateBlocks";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { CategoryBadge, TypeBadge } from "@/components/transactions/CategoryBadge";
import { DeleteTransactionDialog } from "@/components/transactions/DeleteTransactionDialog";
import { TransactionAmount } from "@/components/transactions/TransactionAmount";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCurrency } from "@/contexts/auth-context";
import { useDeleteTransaction, useTransaction } from "@/hooks/use-transactions";
import { formatCurrency, formatDate } from "@/utils/format";

export const Route = createFileRoute("/transactions/$id/")({
  head: () => ({
    meta: [
      { title: "Transaction details — Ledgerly" },
      { name: "description", content: "Review the full details of a single transaction." },
      { property: "og:title", content: "Transaction details — Ledgerly" },
      { property: "og:description", content: "Full details for one income or expense record." },
    ],
  }),
  component: () => (
    <RequireAuth>
      <AppLayout>
        <TransactionDetailPage />
      </AppLayout>
    </RequireAuth>
  ),
});

function TransactionDetailPage() {
  const { id } = Route.useParams();
  const currency = useCurrency();
  const navigate = useNavigate();
  const { data, isPending, isError, error, refetch } = useTransaction(id);
  const deleteMutation = useDeleteTransaction();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isPending) return <LoadingState label="Loading transaction…" />;
  if (isError || !data) {
    return (
      <ErrorState
        title="Transaction unavailable"
        description={(error as Error | null)?.message ?? "We couldn't find that transaction."}
        onRetry={() => void refetch()}
      />
    );
  }

  const amount = Number(data.amount) || 0;

  return (
    <>
      <PageHeader
        title={data.title}
        description={`Recorded on ${formatDate(data.date, "long")}`}
        actions={
          <>
            <Button asChild variant="outline">
              <Link to="/transactions">
                <ArrowLeft className="size-4" aria-hidden /> Back
              </Link>
            </Button>
            <Button asChild>
              <Link to="/transactions/$id/edit" params={{ id }}>
                <Pencil className="size-4" aria-hidden /> Edit
              </Link>
            </Button>
            <Button variant="outline" onClick={() => setConfirmOpen(true)}>
              <Trash2 className="size-4 text-destructive" aria-hidden /> Delete
            </Button>
          </>
        }
      />

      <Card className="card-surface">
        <CardContent className="space-y-6 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-[family-name:var(--font-display)] text-3xl font-bold">
                <TransactionAmount amount={amount} type={data.type} className="text-3xl" />
              </p>
              <p className="text-xs text-muted-foreground">
                Displayed in {currency} · {formatCurrency(amount, currency)}
              </p>
            </div>
            <TypeBadge type={data.type} />
          </div>

          <Separator />

          <dl className="grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Category</dt>
              <dd className="mt-1">
                <CategoryBadge category={data.category} />
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Date</dt>
              <dd className="mt-1 text-sm font-medium">{formatDate(data.date, "long")}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm text-muted-foreground">Note</dt>
              <dd className="mt-1 text-sm leading-relaxed">
                {data.note?.trim() ? data.note : <span className="text-muted-foreground">No note added.</span>}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <DeleteTransactionDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={data.title}
        onConfirm={async () => {
          setConfirmOpen(false);
          await deleteMutation.mutateAsync(id);
          await navigate({ to: "/transactions" });
        }}
      />
    </>
  );
}