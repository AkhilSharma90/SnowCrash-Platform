import type { Metadata } from "next";
import { ModelExplorer } from "@/components/model-explorer";

export const metadata: Metadata = {
  title: "Catalogue · Snowcrash Trust Center",
  description: "Explore the Snowcrash LLM security posture board and filter frontier models by risk posture.",
};

export default function CataloguePage() {
  return (
    <main className="space-y-12 py-12">
      <ModelExplorer sections={["catalogue"] as const} />
    </main>
  );
}
