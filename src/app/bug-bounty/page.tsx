import type { Metadata } from "next";
import { ModelExplorer } from "@/components/model-explorer";

export const metadata: Metadata = {
  title: "Bug Bounty · Snowcrash Trust Center",
  description: "Review Snowcrash bug bounty scope, reward tiers, and response expectations for disclosures.",
};

export default function BugBountyPage() {
  return (
    <main className="space-y-12 py-12">
      <ModelExplorer sections={["bug-bounty"] as const} showOverview={false} />
    </main>
  );
}
