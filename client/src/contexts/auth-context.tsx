import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { toast } from "sonner";

import { CURRENCIES, type CurrencyCode } from "@/constants";
import { UNAUTHORIZED_EVENT } from "@/services/api-client";
import * as authService from "@/services/auth.service";
import type { User } from "@/services/types";

export const meQueryKey = ["auth", "me"] as const;

type AuthContextValue = {
  user: User | null;
  currency: CurrencyCode;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  refetchUser: () => Promise<unknown>;
  login: (input: authService.LoginInput) => Promise<void>;
  register: (input: authService.RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  isSubmitting: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeCurrency(value: unknown): CurrencyCode {
  return (CURRENCIES as readonly string[]).includes(String(value))
    ? (value as CurrencyCode)
    : "INR";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const meQuery = useQuery({
    queryKey: meQueryKey,
    queryFn: authService.getCurrentUser,
    retry: false,
    staleTime: 30_000,
  });

  useEffect(() => {
    function handleUnauthorized() {
      if (queryClient.getQueryData(meQueryKey)) {
        toast.error("Session expired", { description: "Please sign in again to continue." });
      }
      queryClient.setQueryData(meQueryKey, null);
      queryClient.removeQueries({ queryKey: ["transactions"] });
      void router.navigate({ to: "/login" });
    }
    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, [queryClient, router]);

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async (user) => {
      if (user) queryClient.setQueryData(meQueryKey, user);
      await queryClient.invalidateQueries({ queryKey: meQueryKey });
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: async (user) => {
      if (user) queryClient.setQueryData(meQueryKey, user);
      await queryClient.invalidateQueries({ queryKey: meQueryKey });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.setQueryData(meQueryKey, null);
      queryClient.removeQueries({ queryKey: ["transactions"] });
    },
  });

  const user = meQuery.data ?? null;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      currency: normalizeCurrency(user?.currency),
      isLoading: meQuery.isPending,
      isAuthenticated: Boolean(user),
      error: (meQuery.error as Error) ?? null,
      refetchUser: () => meQuery.refetch(),
      login: async (input) => {
        await loginMutation.mutateAsync(input);
      },
      register: async (input) => {
        await registerMutation.mutateAsync(input);
      },
      logout: async () => {
        await logoutMutation.mutateAsync();
      },
      isSubmitting:
        loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
    }),
    [user, meQuery, loginMutation, registerMutation, logoutMutation],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

/** Currency of the signed-in user — single source of truth for all money formatting. */
export function useCurrency() {
  return useAuth().currency;
}