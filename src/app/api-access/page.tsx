import type { Metadata } from "next";
import { ModelExplorer } from "@/components/model-explorer";

export const metadata: Metadata = {
  title: "API Access · Snowcrash Trust Center",
  description: "Discover Snowcrash API endpoints and integration options for automated posture monitoring.",
};

export default function ApiAccessPage() {
  return (
    <main className="space-y-12 py-12">
      <ModelExplorer sections={["api-access"] as const} showOverview={false} />
    </main>
  );
}
