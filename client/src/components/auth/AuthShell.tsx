import type { ReactNode } from "react";
import { ShieldCheck, TrendingUp, Wallet } from "lucide-react";

import { PublicLayout } from "@/components/layout/PublicLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const highlights = [
  { icon: TrendingUp, title: "Clear trends", body: "Six-month income and expense curves." },
  { icon: Wallet, title: "Multi-currency", body: "Switch between INR, USD and EUR instantly." },
  { icon: ShieldCheck, title: "Secure sessions", body: "HTTP-only cookie authentication." },
];

// Static classes so Tailwind's scanner picks them up.
const highlightStagger = ["stagger-2", "stagger-3", "stagger-4"] as const;

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <PublicLayout>
      <div className="mx-auto grid w-full max-w-6xl flex-1 gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-20">
        <section className="animate-rise hidden flex-col gap-10 lg:flex">
          <div className="space-y-5">
            <p className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">
              Personal finance, organised
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl leading-tight font-bold tracking-tight">
              Know exactly where your <span className="text-gradient-brand">money</span> goes.
            </h2>
            <p className="max-w-md text-base text-muted-foreground">
              Ledgerly turns everyday transactions into a clear picture of your balance, spending
              categories and monthly momentum.
            </p>
          </div>
          <ul className="grid gap-5 sm:grid-cols-3">
            {highlights.map((item, index) => (
              <li
                key={item.title}
              className={`card-surface card-interactive animate-rise ${highlightStagger[index]} p-5`}
              >
                <item.icon className="mb-3 size-5 text-primary" aria-hidden />
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <Card className="card-surface animate-rise stagger-1 mx-auto w-full max-w-md">
          <CardHeader className="pb-2">
            <CardTitle className="font-[family-name:var(--font-display)] text-3xl font-bold">
              {title}
            </CardTitle>
            <CardDescription>{subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-7 pt-4">
            {children}
            {footer}
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}