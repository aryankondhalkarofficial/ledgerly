import { useCurrency } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format";

export function TransactionAmount({
  amount,
  type,
  className,
}: {
  amount: number;
  type: "income" | "expense";
  className?: string;
}) {
  const currency = useCurrency();
  const signed = type === "income" ? amount : -amount;

  return (
    <span
      className={cn(
        "font-semibold tabular-nums",
        type === "income" ? "text-success" : "text-destructive",
        className,
      )}
    >
      {formatCurrency(signed, currency, { signed: true })}
    </span>
  );
}