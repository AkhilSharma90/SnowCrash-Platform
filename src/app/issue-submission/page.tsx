import type { Metadata } from "next";
import { ModelExplorer } from "@/components/model-explorer";

export const metadata: Metadata = {
  title: "Issue Submission · Snowcrash Trust Center",
  description: "Escalate new findings, incidents, or remediation updates directly to the Snowcrash triage team.",
};

export default function IssueSubmissionPage() {
  return (
    <main className="space-y-12 py-12">
      <ModelExplorer sections={["issue-submission"] as const} showOverview={false} />
    </main>
  );
}
