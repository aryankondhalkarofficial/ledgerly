import { createFileRoute } from "@tanstack/react-router";

import { PlaceholderPage } from "@/components/common/PlaceholderPage";
import { PublicLayout } from "@/components/layout/PublicLayout";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — Ledgerly" },
      {
        name: "description",
        content:
          "Careers placeholder page for Ledgerly, a personal finance portfolio project. Intentionally not implemented.",
      },
      { property: "og:title", content: "Careers — Ledgerly" },
      {
        property: "og:description",
        content: "Placeholder page created for the Ledgerly portfolio project.",
      },
    ],
  }),
  component: () => (
    <PublicLayout>
      <PlaceholderPage title="Careers at Ledgerly" />
    </PublicLayout>
  ),
});
