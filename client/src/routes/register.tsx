import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthShell } from "@/components/auth/AuthShell";
import { RedirectIfAuthenticated } from "@/components/auth/RedirectIfAuthenticated";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { useAuth } from "@/contexts/auth-context";
import { registerSchema, type RegisterFormValues } from "@/utils/validation";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your account — Ledgerly" },
      {
        name: "description",
        content: "Create a free Ledgerly account and start tracking income and expenses today.",
      },
      { property: "og:title", content: "Create your account — Ledgerly" },
      { property: "og:description", content: "Start tracking your money in minutes." },
    ],
  }),
  component: () => (
    <RedirectIfAuthenticated>
      <RegisterPage />
    </RedirectIfAuthenticated>
  ),
});

function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    try {
      await registerUser(values);
      toast.success("Account created");
      await navigate({ to: "/dashboard", replace: true });
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "We couldn't create your account. Try again.",
      );
    }
  });

  return (
    <AuthShell
      title="Create your account"
      subtitle="Track income, expenses and habits in one place."
      footer={
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign in
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input autoComplete="name" placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    autoComplete="new-password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Use at least 8 characters.</FormDescription>
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
            Create account
          </Button>
        </form>
      </Form>
    </AuthShell>
  );
}