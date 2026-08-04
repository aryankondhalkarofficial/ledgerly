import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL_CATEGORIES } from "@/constants";

export type TransactionFilters = {
  search: string;
  type: "all" | "income" | "expense";
  category: string;
  from: string;
  to: string;
  sort: "date-desc" | "date-asc" | "amount-desc" | "amount-asc";
};

export const defaultFilters: TransactionFilters = {
  search: "",
  type: "all",
  category: "all",
  from: "",
  to: "",
  sort: "date-desc",
};

export function TransactionsToolbar({
  filters,
  onChange,
  onReset,
  resultCount,
}: {
  filters: TransactionFilters;
  onChange: (next: Partial<TransactionFilters>) => void;
  onReset: () => void;
  resultCount: number;
}) {
  const isFiltered =
    filters.search !== "" ||
    filters.type !== "all" ||
    filters.category !== "all" ||
    filters.from !== "" ||
    filters.to !== "";

  return (
    <div className="card-surface mb-5 space-y-4 p-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))]">
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={filters.search}
            onChange={(event) => onChange({ search: event.target.value })}
            placeholder="Search title, note or category"
            aria-label="Search transactions"
            className="pl-9"
          />
        </div>

        <Select value={filters.type} onValueChange={(value) => onChange({ type: value as TransactionFilters["type"] })}>
          <SelectTrigger aria-label="Filter by type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.category} onValueChange={(value) => onChange({ category: value })}>
          <SelectTrigger aria-label="Filter by category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {ALL_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.sort}
          onValueChange={(value) => onChange({ sort: value as TransactionFilters["sort"] })}
        >
          <SelectTrigger aria-label="Sort transactions">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Newest first</SelectItem>
            <SelectItem value="date-asc">Oldest first</SelectItem>
            <SelectItem value="amount-desc">Highest amount</SelectItem>
            <SelectItem value="amount-asc">Lowest amount</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1.5 text-sm">
            <span className="text-muted-foreground">From</span>
            <Input
              type="date"
              value={filters.from}
              onChange={(event) => onChange({ from: event.target.value })}
            />
          </label>
          <label className="space-y-1.5 text-sm">
            <span className="text-muted-foreground">To</span>
            <Input
              type="date"
              value={filters.to}
              onChange={(event) => onChange({ to: event.target.value })}
            />
          </label>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {resultCount} result{resultCount === 1 ? "" : "s"}
          </p>
          {isFiltered && (
            <Button variant="ghost" size="sm" onClick={onReset}>
              <X className="size-4" aria-hidden /> Clear filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}