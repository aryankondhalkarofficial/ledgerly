import { createFileRoute } from "@tanstack/react-router";

import { PlaceholderPage } from "@/components/common/PlaceholderPage";
import { PublicLayout } from "@/components/layout/PublicLayout";

export const Route = createFileRoute("/documentation")({
  head: () => ({
    meta: [
      { title: "Documentation — Ledgerly" },
      {
        name: "description",
        content:
          "Documentation placeholder page for Ledgerly, a personal finance portfolio project. Intentionally not implemented.",
      },
      { property: "og:title", content: "Documentation — Ledgerly" },
      {
        property: "og:description",
        content: "Placeholder page created for the Ledgerly portfolio project.",
      },
    ],
  }),
  component: () => (
    <PublicLayout>
      <PlaceholderPage title="Documentation" />
    </PublicLayout>
  ),
});
