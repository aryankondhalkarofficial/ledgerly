import { Badge } from "@/components/ui/badge";

export function CategoryBadge({ category }: { category: string }) {
  return (
    <Badge variant="secondary" className="font-medium">
      {category}
    </Badge>
  );
}

export function TypeBadge({ type }: { type: "income" | "expense" }) {
  return (
    <span
      className={
        type === "income"
          ? "inline-flex items-center rounded-full bg-success/12 px-2.5 py-1 text-xs font-semibold text-success"
          : "inline-flex items-center rounded-full bg-destructive/12 px-2.5 py-1 text-xs font-semibold text-destructive"
      }
    >
      {type === "income" ? "Income" : "Expense"}
    </span>
  );
}