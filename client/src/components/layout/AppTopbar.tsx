import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, User as UserIcon } from "lucide-react";

import { CurrencySelect } from "@/components/common/CurrencySelect";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context";
import { useUpdateCurrency } from "@/hooks/use-currency-preference";
import { initials } from "@/utils/format";

export function AppTopbar() {
  const { user, currency, logout, isSubmitting } = useAuth();
  const updateCurrency = useUpdateCurrency();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    await navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-border bg-background/85 px-3 backdrop-blur sm:px-6">
      <SidebarTrigger aria-label="Toggle navigation" />
      <div className="ml-auto flex items-center gap-2">
        <CurrencySelect
          value={currency}
          onChange={(next) => updateCurrency.mutate(next)}
          disabled={updateCurrency.isPending}
          className="hidden w-[190px] sm:flex"
          ariaLabel="Change preferred currency"
        />
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2" aria-label="Account menu">
              <Avatar className="size-8">
                <AvatarFallback className="bg-accent text-accent-foreground text-xs font-semibold">
                  {initials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden max-w-28 truncate text-sm font-medium sm:inline">
                {user?.name ?? "Account"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="truncate">{user?.email ?? "Signed in"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings">
                <UserIcon className="size-4" aria-hidden /> Profile & settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                void handleLogout();
              }}
              disabled={isSubmitting}
            >
              <LogOut className="size-4" aria-hidden /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}