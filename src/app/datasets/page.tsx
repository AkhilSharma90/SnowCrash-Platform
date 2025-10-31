import type { Metadata } from "next";
import { ModelExplorer } from "@/components/model-explorer";

export const metadata: Metadata = {
  title: "Datasets · Snowcrash Trust Center",
  description: "Access Snowcrash research datasets that support assurance, vendor reviews, and governance workflows.",
};

export default function DatasetsPage() {
  return (
    <main className="space-y-12 py-12">
      <ModelExplorer sections={["datasets"] as const} showOverview={false} />
    </main>
  );
}
