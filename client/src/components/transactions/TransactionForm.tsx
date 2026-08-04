import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { categoriesForType } from "@/constants";
import { useCurrency } from "@/contexts/auth-context";
import type { TransactionPayload } from "@/services/types";
import { currencySymbol, toDateInputValue } from "@/utils/format";
import { transactionSchema, type TransactionFormValues } from "@/utils/validation";

export type TransactionFormProps = {
  defaultValues?: Partial<TransactionFormValues>;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (payload: TransactionPayload) => void | Promise<void>;
  cancelTo: string;
};

export function TransactionForm({
  defaultValues,
  submitLabel,
  isSubmitting,
  onSubmit,
  cancelTo,
}: TransactionFormProps) {
  const currency = useCurrency();

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      note: "",
      amount: "",
      type: "expense",
      date: toDateInputValue(),
      category: "Food",
      ...defaultValues,
    },
  });

  const type = form.watch("type");
  const categories = categoriesForType(type);

  // Keep category valid when the type changes.
  useEffect(() => {
    const current = form.getValues("category");
    if (!categories.includes(current)) {
      form.setValue("category", categories[0]!, { shouldValidate: true });
    }
  }, [type, categories, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit({
      title: values.title.trim(),
      amount: Number(values.amount),
      type: values.type,
      date: new Date(`${values.date}T12:00:00`).toISOString(),
      category: values.category,
      ...(values.note && values.note.trim() ? { note: values.note.trim() } : {}),
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <ToggleGroup
                  type="single"
                  value={field.value}
                  onValueChange={(value) => value && field.onChange(value)}
                  className="grid w-full max-w-sm grid-cols-2 gap-2"
                >
                  <ToggleGroupItem value="expense" className="rounded-lg border border-border">
                    Expense
                  </ToggleGroupItem>
                  <ToggleGroupItem value="income" className="rounded-lg border border-border">
                    Income
                  </ToggleGroupItem>
                </ToggleGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Grocery run" autoComplete="off" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                      {currencySymbol(currency)}
                    </span>
                    <Input
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="pl-8"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormDescription>Recorded in your preferred currency ({currency}).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note (optional)</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="Any details worth remembering…"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {submitLabel}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link to={cancelTo}>Cancel</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}