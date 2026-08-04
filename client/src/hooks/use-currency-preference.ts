import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { CurrencyCode } from "@/constants";
import { meQueryKey } from "@/contexts/auth-context";
import { updateCurrency } from "@/services/currency.service";
import type { User } from "@/services/types";

export function useUpdateCurrency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (currency: CurrencyCode) => updateCurrency(currency),
    // Optimistic: every amount in the UI reformats immediately.
    onMutate: async (currency) => {
      await queryClient.cancelQueries({ queryKey: meQueryKey });
      const previous = queryClient.getQueryData<User | null>(meQueryKey);
      if (previous) queryClient.setQueryData(meQueryKey, { ...previous, currency });
      return { previous };
    },
    onError: (error: Error, _currency, context) => {
      if (context) queryClient.setQueryData(meQueryKey, context.previous ?? null);
      toast.error("Couldn't update currency", { description: error.message });
    },
    onSuccess: (user, currency) => {
      if (user) queryClient.setQueryData(meQueryKey, user);
      toast.success(`Currency set to ${currency}`);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: meQueryKey });
      void queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}