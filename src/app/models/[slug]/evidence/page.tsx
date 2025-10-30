import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getModelDerivedData } from "../model-helpers";

interface ModelEvidencePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ModelEvidencePage({ params }: ModelEvidencePageProps) {
  const { slug } = await params;
  const data = getModelDerivedData(slug);

  if (!data) {
    notFound();
  }

  const { model } = data;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-slate-200/70 bg-white/95 dark:border-slate-900/70 dark:bg-slate-950/60">
        <CardHeader>
          <CardTitle className="text-xl">Compliance attestations</CardTitle>
          <CardDescription>Vendor-provided certifications and Snowcrash verification notes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {model.compliance.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200/70 bg-white px-4 py-3 shadow-sm dark:border-slate-900/70 dark:bg-slate-950/60"
            >
              {item}
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="border-slate-200/70 bg-white/95 dark:border-slate-900/70 dark:bg-slate-950/60">
        <CardHeader>
          <CardTitle className="text-xl">Reference material</CardTitle>
          <CardDescription>Source documents and deeper reading for security reviewers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {model.references.map((reference) => (
            <div
              key={reference.url}
              className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white px-4 py-3 shadow-sm dark:border-slate-900/70 dark:bg-slate-950/60"
            >
              <span>{reference.label}</span>
              <a
                href={reference.url}
                className="text-xs font-semibold text-slate-900 underline-offset-4 hover:underline dark:text-slate-100"
              >
                Open →
              </a>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
