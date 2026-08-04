import { AlertTriangle, Inbox, Loader2 } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function LoadingState({ label = "Loading…", className }: { label?: string; className?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground", className)}
    >
      <Loader2 className="size-6 animate-spin" aria-hidden />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        {icon ?? <Inbox className="size-6" aria-hidden />}
      </span>
      <h3 className="text-base font-semibold">{title}</h3>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center"
    >
      <span className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="size-6" aria-hidden />
      </span>
      <h3 className="text-base font-semibold">{title}</h3>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
/** Skeleton mirroring the dashboard layout so the first paint doesn't jump. */
export function DashboardSkeleton() {
  return (
    <div className="animate-soft-fade space-y-6" role="status" aria-live="polite">
      <span className="sr-only">Loading your finances…</span>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {[0, 1, 2].map((index) => (
          <div key={index} className="card-surface space-y-3 p-6">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-3 w-40" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {[0, 1].map((index) => (
          <div key={index} className="card-surface space-y-4 p-6">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-[240px] w-full rounded-xl" />
          </div>
        ))}
      </div>
      <div className="card-surface space-y-4 p-6">
        <Skeleton className="h-5 w-44" />
        {[0, 1, 2, 3].map((index) => (
          <Skeleton key={index} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

/** Skeleton for list/table pages such as Transactions. */
export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="animate-soft-fade space-y-6" role="status" aria-live="polite">
      <span className="sr-only">Loading transactions…</span>
      <div className="card-surface flex flex-wrap gap-3 p-6">
        {[0, 1, 2, 3].map((index) => (
          <Skeleton key={index} className="h-11 flex-1 min-w-[10rem] rounded-lg" />
        ))}
      </div>
      <div className="card-surface space-y-3 p-6">
        <Skeleton className="h-5 w-36" />
        {Array.from({ length: rows }, (_, index) => (
          <Skeleton key={index} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
