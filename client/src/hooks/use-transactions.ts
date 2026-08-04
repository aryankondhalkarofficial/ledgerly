import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import * as service from "@/services/transactions.service";
import type { Transaction, TransactionPayload } from "@/services/types";
import { transactionId } from "@/services/types";

export const transactionsKey = ["transactions"] as const;
export const transactionKey = (id: string) => ["transactions", id] as const;

export function useTransactions(enabled = true) {
  return useQuery({
    queryKey: transactionsKey,
    queryFn: service.listTransactions,
    enabled,
    staleTime: 15_000,
  });
}

export function useTransaction(id: string, enabled = true) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: transactionKey(id),
    queryFn: () => service.getTransaction(id),
    enabled: enabled && Boolean(id),
    initialData: () => {
      const list = queryClient.getQueryData<Transaction[]>(transactionsKey);
      return list?.find((t) => transactionId(t) === id);
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TransactionPayload) => service.createTransaction(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: transactionsKey });
      toast.success("Transaction added");
    },
    onError: (error: Error) => toast.error("Couldn't add transaction", { description: error.message }),
  });
}

export function useUpdateTransaction(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<TransactionPayload>) => service.updateTransaction(id, input),
    onSuccess: (updated) => {
      queryClient.setQueryData(transactionKey(id), updated);
      void queryClient.invalidateQueries({ queryKey: transactionsKey });
      toast.success("Transaction updated");
    },
    onError: (error: Error) =>
      toast.error("Couldn't update transaction", { description: error.message }),
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => service.deleteTransaction(id),
    // Optimistic removal from the cached list for instant feedback.
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: transactionsKey });
      const previous = queryClient.getQueryData<Transaction[]>(transactionsKey);
      if (previous) {
        queryClient.setQueryData(
          transactionsKey,
          previous.filter((t) => transactionId(t) !== id),
        );
      }
      return { previous };
    },
    onError: (error: Error, _id, context) => {
      if (context?.previous) queryClient.setQueryData(transactionsKey, context.previous);
      toast.error("Couldn't delete transaction", { description: error.message });
    },
    onSuccess: () => toast.success("Transaction deleted"),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: transactionsKey });
    },
  });
}