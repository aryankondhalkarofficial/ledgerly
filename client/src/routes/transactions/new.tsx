import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateTransaction } from "@/hooks/use-transactions";

export const Route = createFileRoute("/transactions/new")({
  head: () => ({
    meta: [
      { title: "Add transaction — Ledgerly" },
      { name: "description", content: "Record a new income or expense in Ledgerly." },
      { property: "og:title", content: "Add transaction — Ledgerly" },
      { property: "og:description", content: "Record a new income or expense." },
    ],
  }),
  component: () => (
    <RequireAuth>
      <AppLayout>
        <NewTransactionPage />
      </AppLayout>
    </RequireAuth>
  ),
});

function NewTransactionPage() {
  const createMutation = useCreateTransaction();
  const navigate = useNavigate();

  return (
    <>
      <PageHeader title="Add transaction" description="Log an income or expense record." />
      <Card className="card-surface">
        <CardContent className="p-5 sm:p-6">
          <TransactionForm
            submitLabel="Save transaction"
            isSubmitting={createMutation.isPending}
            cancelTo="/transactions"
            onSubmit={async (payload) => {
              await createMutation.mutateAsync(payload);
              await navigate({ to: "/transactions" });
            }}
          />
        </CardContent>
      </Card>
    </>
  );
}