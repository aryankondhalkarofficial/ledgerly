import { createFileRoute } from "@tanstack/react-router";

import { PlaceholderPage } from "@/components/common/PlaceholderPage";
import { PublicLayout } from "@/components/layout/PublicLayout";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Ledgerly" },
      {
        name: "description",
        content:
          "Blog placeholder page for Ledgerly, a personal finance portfolio project. Intentionally not implemented.",
      },
      { property: "og:title", content: "Blog — Ledgerly" },
      {
        property: "og:description",
        content: "Placeholder page created for the Ledgerly portfolio project.",
      },
    ],
  }),
  component: () => (
    <PublicLayout>
      <PlaceholderPage title="Ledgerly Blog" />
    </PublicLayout>
  ),
});
