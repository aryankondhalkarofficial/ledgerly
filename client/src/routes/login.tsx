import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { RedirectIfAuthenticated } from "@/components/auth/RedirectIfAuthenticated";
import { AuthShell } from "@/components/auth/AuthShell";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { loginSchema, type LoginFormValues } from "@/utils/validation";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Ledgerly" },
      { name: "description", content: "Sign in to your Ledgerly personal finance dashboard." },
      { property: "og:title", content: "Sign in — Ledgerly" },
      { property: "og:description", content: "Access your Ledgerly finance workspace." },
    ],
  }),
  component: () => (
    <RedirectIfAuthenticated>
      <LoginPage />
    </RedirectIfAuthenticated>
  ),
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    try {
      await login(values);
      toast.success("Welcome back");
      await navigate({ to: "/dashboard", replace: true });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Sign in failed. Please try again.";
      setFormError(message);
    }
  });

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to pick up where you left off."
      footer={
        <p className="text-sm text-muted-foreground">
          New to Ledgerly?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </p>
      }
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          {formError && (
            <Alert variant="destructive" className="animate-soft-fade">
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="press-effect w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden />}
            Sign in
          </Button>
        </form>
      </Form>
    </AuthShell>
  );
}