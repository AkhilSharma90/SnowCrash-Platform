import type { Metadata } from "next";
import { ModelExplorer } from "@/components/model-explorer";

export const metadata: Metadata = {
  title: "Analytics · Snowcrash Trust Center",
  description: "Monitor programme-level analytics, mitigation rates, and severity distribution for tracked models.",
};

export default function AnalyticsPage() {
  return (
    <main className="space-y-12 py-12">
      <ModelExplorer sections={["analytics"] as const} showOverview={false} />
    </main>
  );
}
