import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllModelParams, getModelDerivedData } from "./model-helpers";

interface ModelOverviewPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllModelParams();
}

export default async function ModelOverviewPage({ params }: ModelOverviewPageProps) {
  const { slug } = await params;
  const data = getModelDerivedData(slug);

  if (!data) {
    notFound();
  }

  const { model, severityCounts, statusCounts, uniqueVectors } = data;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <Card className="border-slate-200/70 bg-white/95 dark:border-slate-900/70 dark:bg-slate-950/60">
        <CardHeader>
          <CardTitle className="text-xl">Posture overview</CardTitle>
          <CardDescription>
            Snapshot of assurance coverage, risk velocity, and live mitigation signals for {model.name}.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <InsightLine
              label="Attack vectors monitored"
              value={uniqueVectors.length.toString()}
              hint={uniqueVectors.join(" · ")}
            />
            <InsightLine
              label="High severity open"
              value={`${severityCounts.critical + severityCounts.high}`}
              hint={`${severityCounts.critical} critical · ${severityCounts.high} high`}
            />
            <InsightLine
              label="Status distribution"
              value={`${statusCounts.open} open`}
              hint={`${statusCounts.monitoring} monitoring · ${statusCounts.mitigated} mitigated`}
            />
          </div>
          <div className="space-y-4">
            <InsightLine
              label="Security highlights"
              value="Key capabilities"
              hint={model.highlights.slice(0, 3).join(" · ")}
            />
            <InsightLine
              label="Assurance coverage"
              value={`${model.compliance.length} frameworks`}
              hint={model.compliance.join(" · ")}
            />
            <InsightLine
              label="Data governance posture"
              value={model.issues.some((issue) => issue.vector.includes("Data")) ? "Monitoring" : "Guarded"}
              hint="Data retention, residency, and observability controls under watch."
            />
          </div>
        </CardContent>
      </Card>
      <Card className="border-slate-200/70 bg-white/95 dark:border-slate-900/70 dark:bg-slate-950/60">
        <CardHeader>
          <CardTitle className="text-xl">Risk breakdown</CardTitle>
          <CardDescription>Severity distribution for all advisories tracked on this model.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(severityCounts).map(([severity, count]) => (
            <div
              key={severity}
              className="flex items-center justify-between rounded-2xl border border-slate-200/60 bg-white px-4 py-3 text-sm shadow-sm dark:border-slate-900/60 dark:bg-slate-950/50"
            >
              <span className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <span className="font-semibold capitalize text-slate-700 dark:text-slate-200">{severity}</span>
              </span>
              <span className="text-base font-semibold text-slate-900 dark:text-white">{count}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function InsightLine({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="space-y-1.5 rounded-2xl border border-slate-200/60 bg-white px-4 py-3 text-sm shadow-sm dark:border-slate-900/70 dark:bg-slate-950/60">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <p className="text-base font-semibold text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
    </div>
  );
}
