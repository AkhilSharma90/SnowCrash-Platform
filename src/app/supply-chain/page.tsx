import type { Metadata } from "next";
import { ModelExplorer } from "@/components/model-explorer";

export const metadata: Metadata = {
  title: "Supply Chain · Snowcrash Trust Center",
  description: "Track urgent supply-chain advisories across model hosting, tooling, and inference libraries.",
};

export default function SupplyChainPage() {
  return (
    <main className="space-y-12 py-12">
      <ModelExplorer sections={["supply-chain"] as const} showOverview={false} />
    </main>
  );
}
