import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { CurrencySelect } from "@/components/common/CurrencySelect";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { CURRENCY_META } from "@/constants";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/contexts/theme-context";
import { useUpdateCurrency } from "@/hooks/use-currency-preference";
import { useTransactions } from "@/hooks/use-transactions";
import { formatCurrency, initials } from "@/utils/format";
import { computeTotals } from "@/utils/transactions";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Profile & settings — Ledgerly" },
      {
        name: "description",
        content: "Manage your Ledgerly profile, preferred currency and appearance.",
      },
      { property: "og:title", content: "Profile & settings — Ledgerly" },
      { property: "og:description", content: "Profile, currency preference and theme." },
    ],
  }),
  component: () => (
    <RequireAuth>
      <AppLayout>
        <SettingsPage />
      </AppLayout>
    </RequireAuth>
  ),
});

function SettingsPage() {
  const { user, currency, logout, isSubmitting } = useAuth();
  const updateCurrency = useUpdateCurrency();
  const { theme } = useTheme();
  const { data } = useTransactions();
  const totals = computeTotals(data ?? []);
  const navigate = useNavigate();

  return (
    <>
      <PageHeader title="Profile & settings" description="Your account, currency and appearance." />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="card-surface">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Details from your Ledgerly account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar className="size-14">
                <AvatarFallback className="bg-accent text-accent-foreground text-base font-semibold">
                  {initials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold">{user?.name}</p>
                <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Separator />
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Net balance</dt>
                <dd className="font-semibold tabular-nums">
                  {formatCurrency(totals.balance, currency)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Records</dt>
                <dd className="font-semibold tabular-nums">{(data ?? []).length}</dd>
              </div>
            </dl>
            <Button
              variant="outline"
              disabled={isSubmitting}
              onClick={async () => {
                await logout();
                await navigate({ to: "/login" });
              }}
            >
              <LogOut className="size-4" aria-hidden /> Sign out
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="card-surface" id="currency">
            <CardHeader>
              <CardTitle>Currency</CardTitle>
              <CardDescription>
                Every amount, symbol and chart tooltip updates instantly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CurrencySelect
                value={currency}
                onChange={(next) => updateCurrency.mutate(next)}
                disabled={updateCurrency.isPending}
                className="w-full sm:w-[280px]"
              />
              <p className="text-sm text-muted-foreground">
                Preview: {CURRENCY_META[currency].symbol} —{" "}
                <span className="font-semibold text-foreground">
                  {formatCurrency(1234.56, currency)}
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="card-surface">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Currently using {theme} mode. Your choice is remembered on this device.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <ThemeToggle />
              <span className="text-sm text-muted-foreground">Toggle dark / light mode</span>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}