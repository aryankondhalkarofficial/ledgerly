import { useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { LoadingState, ErrorState } from "@/components/common/StateBlocks";
import { useAuth } from "@/contexts/auth-context";

/** Client-side route guard for every authenticated page. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, error, refetchUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !error) {
      void navigate({ to: "/login", replace: true });
    }
  }, [isAuthenticated, isLoading, error, navigate]);

  if (isLoading) return <LoadingState label="Checking your session…" />;

  if (error) {
    return (
      <ErrorState
        title="We couldn't verify your session"
        description={error.message}
        onRetry={() => void refetchUser()}
      />
    );
  }

  if (!isAuthenticated) return <LoadingState label="Redirecting to sign in…" />;

  return <>{children}</>;
}