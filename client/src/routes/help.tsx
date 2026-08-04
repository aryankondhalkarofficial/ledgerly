import { createFileRoute } from "@tanstack/react-router";

import { PlaceholderPage } from "@/components/common/PlaceholderPage";
import { PublicLayout } from "@/components/layout/PublicLayout";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help — Ledgerly" },
      {
        name: "description",
        content:
          "Help placeholder page for Ledgerly, a personal finance portfolio project. Intentionally not implemented.",
      },
      { property: "og:title", content: "Help — Ledgerly" },
      {
        property: "og:description",
        content: "Placeholder page created for the Ledgerly portfolio project.",
      },
    ],
  }),
  component: () => (
    <PublicLayout>
      <PlaceholderPage title="Help Center" />
    </PublicLayout>
  ),
});
