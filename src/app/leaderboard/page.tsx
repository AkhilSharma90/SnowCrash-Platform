import type { Metadata } from "next";
import { ModelExplorer } from "@/components/model-explorer";

export const metadata: Metadata = {
  title: "Leaderboard · Snowcrash Trust Center",
  description: "See the Snowcrash security score leaderboard and portfolio highlights for monitored models.",
};

export default function LeaderboardPage() {
  return (
    <main className="space-y-12 py-12">
      <ModelExplorer sections={["leaderboard"] as const} showOverview={false} />
    </main>
  );
}
