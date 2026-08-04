import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { LoadingState } from "@/components/common/StateBlocks";
import { useAuth } from "@/contexts/auth-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ledgerly — Sign in to your finance workspace" },
      {
        name: "description",
        content:
          "Sign in to Ledgerly to track income, expenses, categories and spending trends in your preferred currency.",
      },
      { property: "og:title", content: "Ledgerly — Personal finance workspace" },
      {
        property: "og:description",
        content: "Balance, income, expenses and category insights in one place.",
      },
    ],
  }),
  component: Index,
});

/**
 * Session bootstrap: GET /api/users/me decides where the app opens.
 * Authenticated -> /dashboard, otherwise -> /login. Never the dashboard by default.
 */
function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    void navigate({ to: isAuthenticated ? "/dashboard" : "/login", replace: true });
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <LoadingState label="Preparing your workspace…" />
    </div>
  );
}
