import type { Metadata } from "next";
import { ModelExplorer } from "@/components/model-explorer";

export const metadata: Metadata = {
  title: "Signals · Snowcrash Trust Center",
  description: "Review the live advisory feed and programme insights curated by Snowcrash monitoring.",
};

export default function SignalsPage() {
  return (
    <main className="space-y-12 py-12">
      <ModelExplorer sections={["signals"] as const} showOverview={false} />
    </main>
  );
}
