import { Link } from "@tanstack/react-router";
import { Construction } from "lucide-react";

import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/constants";

export function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <section className="animate-rise mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-4 py-20 text-center sm:py-28">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
        <Construction className="size-7" aria-hidden />
      </span>
      <div className="space-y-3">
        <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          Placeholder page
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>
      </div>
      <p className="text-base leading-relaxed text-muted-foreground">
        {description ??
          `This is a placeholder page created for a personal portfolio project. There is no backend behind it — the content here is intentionally not implemented.`}
      </p>
      <p className="rounded-xl border border-dashed border-border bg-muted/50 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
        {APP_NAME} is a portfolio build. Only authentication, transactions and currency preferences
        are backed by a real API.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link to="/dashboard">Go to dashboard</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/login">Back to sign in</Link>
        </Button>
      </div>
    </section>
  );
}