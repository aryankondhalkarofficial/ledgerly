import { useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { LoadingState } from "@/components/common/StateBlocks";
import { useAuth } from "@/contexts/auth-context";

/** Keeps signed-in users away from Login / Register. */
export function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) void navigate({ to: "/dashboard", replace: true });
  }, [isAuthenticated, navigate]);

  if (isLoading) return <LoadingState label="Loading…" />;
  if (isAuthenticated) return <LoadingState label="Taking you to your dashboard…" />;

  return <>{children}</>;
}