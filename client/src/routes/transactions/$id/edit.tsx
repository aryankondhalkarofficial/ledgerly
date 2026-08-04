import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { ErrorState, LoadingState } from "@/components/common/StateBlocks";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { Card, CardContent } from "@/components/ui/card";
import { useTransaction, useUpdateTransaction } from "@/hooks/use-transactions";
import { toDateInputValue } from "@/utils/format";

export const Route = createFileRoute("/transactions/$id/edit")({
  head: () => ({
    meta: [
      { title: "Edit transaction — Ledgerly" },
      { name: "description", content: "Update the details of an existing transaction." },
      { property: "og:title", content: "Edit transaction — Ledgerly" },
      { property: "og:description", content: "Update an existing income or expense record." },
    ],
  }),
  component: () => (
    <RequireAuth>
      <AppLayout>
        <EditTransactionPage />
      </AppLayout>
    </RequireAuth>
  ),
});

function EditTransactionPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data, isPending, isError, error, refetch } = useTransaction(id);
  const updateMutation = useUpdateTransaction(id);

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

  return (
    <>
      <PageHeader title="Edit transaction" description={data.title} />
      <Card className="card-surface">
        <CardContent className="p-5 sm:p-6">
          <TransactionForm
            submitLabel="Save changes"
            isSubmitting={updateMutation.isPending}
            cancelTo="/transactions"
            defaultValues={{
              title: data.title,
              note: data.note ?? "",
              amount: String(data.amount ?? ""),
              type: data.type,
              date: toDateInputValue(data.date),
              category: data.category,
            }}
            onSubmit={async (payload) => {
              await updateMutation.mutateAsync(payload);
              await navigate({ to: "/transactions/$id", params: { id } });
            }}
          />
        </CardContent>
      </Card>
    </>
  );
}