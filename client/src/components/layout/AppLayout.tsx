import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppTopbar } from "@/components/layout/AppTopbar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export function AppLayout({ children }: { children: ReactNode }) {
  // Re-keying on pathname restarts the entrance animation on every navigation,
  // which reads as a page transition without any extra animation library.
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex min-w-0 flex-1 flex-col">
          <AppTopbar />
          <main className="flex-1 px-4 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <div key={pathname} className="animate-rise mx-auto w-full max-w-6xl">
              {children}
            </div>
          </main>
          <SiteFooter />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}