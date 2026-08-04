import { createFileRoute } from "@tanstack/react-router";

import { PlaceholderPage } from "@/components/common/PlaceholderPage";
import { PublicLayout } from "@/components/layout/PublicLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Ledgerly" },
      {
        name: "description",
        content:
          "About placeholder page for Ledgerly, a personal finance portfolio project. Intentionally not implemented.",
      },
      { property: "og:title", content: "About — Ledgerly" },
      {
        property: "og:description",
        content: "Placeholder page created for the Ledgerly portfolio project.",
      },
    ],
  }),
  component: () => (
    <PublicLayout>
      <PlaceholderPage title="About Ledgerly" />
    </PublicLayout>
  ),
});
