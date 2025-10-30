import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getModelDerivedData } from "../model-helpers";

interface ModelRoadmapPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ModelRoadmapPage({ params }: ModelRoadmapPageProps) {
  const { slug } = await params;
  const data = getModelDerivedData(slug);

  if (!data) {
    notFound();
  }

  const { model } = data;

  return (
    <Card className="border-slate-200/70 bg-white/95 dark:border-slate-900/70 dark:bg-slate-950/60">
      <CardHeader>
        <CardTitle className="text-xl">Remediation roadmap</CardTitle>
        <CardDescription>Forward-looking initiatives supplied by the vendor and Snowcrash analysts.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {model.roadmap.map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-slate-200/70 bg-white px-4 py-3 shadow-sm dark:border-slate-900/70 dark:bg-slate-950/60"
          >
            <p className="font-semibold text-slate-900 dark:text-white">{item}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
