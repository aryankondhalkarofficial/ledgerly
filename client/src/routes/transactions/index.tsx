import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/common/StateBlocks";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { CategoryBadge, TypeBadge } from "@/components/transactions/CategoryBadge";
import { DeleteTransactionDialog } from "@/components/transactions/DeleteTransactionDialog";
import { TransactionAmount } from "@/components/transactions/TransactionAmount";
import {
  defaultFilters,
  TransactionsToolbar,
  type TransactionFilters,
} from "@/components/transactions/TransactionsToolbar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteTransaction, useTransactions } from "@/hooks/use-transactions";
import { transactionId, type Transaction } from "@/services/types";
import { formatDate } from "@/utils/format";
import { sortTransactions } from "@/utils/transactions";

const PAGE_SIZE = 8;

export const Route = createFileRoute("/transactions/")({
  head: () => ({
    meta: [
      { title: "Transactions — Ledgerly" },
      {
        name: "description",
        content: "Search, filter, sort and manage every income and expense record.",
      },
      { property: "og:title", content: "Transactions — Ledgerly" },
      { property: "og:description", content: "Every income and expense in one searchable list." },
    ],
  }),
  component: () => (
    <RequireAuth>
      <AppLayout>
        <TransactionsPage />
      </AppLayout>
    </RequireAuth>
  ),
});

function TransactionsPage() {
  const { data, isPending, isError, error, refetch } = useTransactions();
  const deleteMutation = useDeleteTransaction();
  const [filters, setFilters] = useState<TransactionFilters>(defaultFilters);
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<Transaction | null>(null);

  const filtered = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    const from = filters.from ? new Date(`${filters.from}T00:00:00`).getTime() : null;
    const to = filters.to ? new Date(`${filters.to}T23:59:59`).getTime() : null;

    const result = (data ?? []).filter((transaction) => {
      if (filters.type !== "all" && transaction.type !== filters.type) return false;
      if (filters.category !== "all" && transaction.category !== filters.category) return false;
      const time = new Date(transaction.date).getTime();
      if (from !== null && Number.isFinite(time) && time < from) return false;
      if (to !== null && Number.isFinite(time) && time > to) return false;
      if (search) {
        const haystack = `${transaction.title} ${transaction.note ?? ""} ${transaction.category}`.toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      return true;
    });

    return sortTransactions(result, filters.sort);
  }, [data, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const updateFilters = (next: Partial<TransactionFilters>) => {
    setFilters((current) => ({ ...current, ...next }));
    setPage(1);
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    deleteMutation.mutate(transactionId(pendingDelete));
    setPendingDelete(null);
  };

  return (
    <>
      <PageHeader
        title="Transactions"
        description="Search, filter and manage everything you've recorded."
        actions={
          <Button asChild>
            <Link to="/transactions/new">
              <PlusCircle className="size-4" aria-hidden /> Add transaction
            </Link>
          </Button>
        }
      />

      {isPending ? (
        <TableSkeleton />
      ) : isError ? (
        <ErrorState description={(error as Error).message} onRetry={() => void refetch()} />
      ) : (
        <>
          <TransactionsToolbar
            filters={filters}
            onChange={updateFilters}
            onReset={() => {
              setFilters(defaultFilters);
              setPage(1);
            }}
            resultCount={filtered.length}
          />

          {filtered.length === 0 ? (
            <div className="card-surface">
              <EmptyState
                title={(data ?? []).length === 0 ? "No transactions yet" : "No matches"}
                description={
                  (data ?? []).length === 0
                    ? "Add your first income or expense to get started."
                    : "Try adjusting your search or filters."
                }
                action={
                  (data ?? []).length === 0 ? (
                    <Button asChild>
                      <Link to="/transactions/new">Add transaction</Link>
                    </Button>
                  ) : undefined
                }
              />
            </div>
          ) : (
            <>
              {/* Desktop / tablet table */}
              <div className="card-surface hidden overflow-hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visible.map((transaction) => {
                      const id = transactionId(transaction);
                      return (
                        <TableRow key={id}>
                          <TableCell className="max-w-56">
                            <Link
                              to="/transactions/$id"
                              params={{ id }}
                              className="block truncate font-medium hover:underline"
                            >
                              {transaction.title}
                            </Link>
                            {transaction.note && (
                              <span className="block truncate text-xs text-muted-foreground">
                                {transaction.note}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <CategoryBadge category={transaction.category} />
                          </TableCell>
                          <TableCell>
                            <TypeBadge type={transaction.type} />
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(transaction.date)}
                          </TableCell>
                          <TableCell className="text-right">
                            <TransactionAmount
                              amount={Number(transaction.amount) || 0}
                              type={transaction.type}
                            />
                          </TableCell>
                          <TableCell className="text-right whitespace-nowrap">
                            <Button asChild variant="ghost" size="icon" aria-label={`View ${transaction.title}`}>
                              <Link to="/transactions/$id" params={{ id }}>
                                <Eye className="size-4" aria-hidden />
                              </Link>
                            </Button>
                            <Button asChild variant="ghost" size="icon" aria-label={`Edit ${transaction.title}`}>
                              <Link to="/transactions/$id/edit" params={{ id }}>
                                <Pencil className="size-4" aria-hidden />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Delete ${transaction.title}`}
                              onClick={() => setPendingDelete(transaction)}
                            >
                              <Trash2 className="size-4 text-destructive" aria-hidden />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile cards */}
              <ul className="space-y-3 md:hidden">
                {visible.map((transaction) => {
                  const id = transactionId(transaction);
                  return (
                    <li key={id} className="card-surface p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 space-y-1.5">
                          <Link
                            to="/transactions/$id"
                            params={{ id }}
                            className="block truncate font-semibold"
                          >
                            {transaction.title}
                          </Link>
                          <div className="flex flex-wrap items-center gap-2">
                            <CategoryBadge category={transaction.category} />
                            <TypeBadge type={transaction.type} />
                          </div>
                          <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                        </div>
                        <TransactionAmount
                          amount={Number(transaction.amount) || 0}
                          type={transaction.type}
                        />
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button asChild variant="outline" size="sm" className="flex-1">
                          <Link to="/transactions/$id" params={{ id }}>
                            <Eye className="size-4" aria-hidden /> View
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm" className="flex-1">
                          <Link to="/transactions/$id/edit" params={{ id }}>
                            <Pencil className="size-4" aria-hidden /> Edit
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPendingDelete(transaction)}
                          aria-label={`Delete ${transaction.title}`}
                        >
                          <Trash2 className="size-4 text-destructive" aria-hidden />
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {totalPages > 1 && (
                <nav
                  className="mt-5 flex items-center justify-between gap-3"
                  aria-label="Transactions pagination"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <p className="text-sm text-muted-foreground" aria-live="polite">
                    Page {currentPage} of {totalPages}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </nav>
              )}
            </>
          )}
        </>
      )}

      <DeleteTransactionDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        onConfirm={confirmDelete}
        {...(pendingDelete ? { title: pendingDelete.title } : {})}
      />
    </>
  );
}