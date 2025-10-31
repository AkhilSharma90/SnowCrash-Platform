import type { Metadata } from "next";
import { ModelExplorer } from "@/components/model-explorer";

export const metadata: Metadata = {
  title: "Benchmarks · Snowcrash Trust Center",
  description: "Compare security posture benchmarks, audit cadence, and advisory counts across tracked models.",
};

export default function BenchmarksPage() {
  return (
    <main className="space-y-12 py-12">
      <ModelExplorer sections={["benchmark"] as const} showOverview={false} />
    </main>
  );
}
