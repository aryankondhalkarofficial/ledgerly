import { Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/constants";

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="surface-brand flex size-9 items-center justify-center rounded-xl shadow-sm">
        <Wallet className="size-5" aria-hidden />
      </span>
      {!compact && (
        <span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
          {APP_NAME}
        </span>
      )}
    </span>
  );
}