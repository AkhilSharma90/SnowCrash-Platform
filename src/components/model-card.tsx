import Link from "next/link";
import { ModelRecord } from "@/data/models";
import { RiskBadge } from "./risk-badge";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";

interface ModelCardProps {
  model: ModelRecord;
}

const MAX_ISSUES_IN_CARD = 3;

export function ModelCard({ model }: ModelCardProps) {
  const issues = model.issues.slice(0, MAX_ISSUES_IN_CARD);
  const openIssueCount = model.issues.filter((issue) => issue.status !== "mitigated").length;
  const severeIssueCount = model.issues.filter(
    (issue) => issue.severity === "critical" || issue.severity === "high",
  ).length;

  return (
    <Card className="group flex h-full flex-col border-slate-200/70 bg-white/95 shadow-[0_35px_60px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_45px_75px_rgba(15,23,42,0.12)] dark:border-slate-800/60 dark:bg-slate-950/60">
      <CardHeader className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl leading-tight">
              <Link
                href={`/models/${model.slug}`}
                className="transition hover:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950"
              >
                {model.name}
              </Link>
            </CardTitle>
            <p className="text-sm text-slate-500 dark:text-slate-400">Operated by {model.provider}</p>
          </div>
          <RiskBadge level={model.riskLevel} />
        </div>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300/90">{model.summary}</p>
        <dl className="grid gap-4 text-xs text-slate-600 sm:grid-cols-4 dark:text-slate-400">
          <Metric label="Security score" value={`${model.securityScore}/100`} />
          <Metric label="Last audit" value={model.lastAudit} />
          <Metric label="Stage" value={model.releaseStage} />
          <Metric label="Compliance" value={model.compliance.slice(0, 2).join(", ")} />
        </dl>
      </CardHeader>
      <CardContent className="space-y-5">
        {issues.length > 0 && (
          <div className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">
              Critical intelligence
            </p>
            <div className="space-y-2">
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-xs text-slate-600 transition group-hover:border-indigo-200 group-hover:bg-indigo-50 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300 dark:group-hover:border-indigo-500/40 dark:group-hover:bg-indigo-950/40"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="soft" className="border-none bg-slate-900/10 px-2 py-0 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-600 dark:bg-white/10 dark:text-slate-200">
                      {issue.severity}
                    </Badge>
                    <span className="font-medium text-slate-700 dark:text-slate-100">{issue.title}</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">{issue.vector}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="rounded-2xl border border-slate-200/70 bg-white px-4 py-3 text-xs text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-300">
          <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-200">
            <span>{model.issues.length} advisories tracked</span>
            <span>{openIssueCount} open</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            High priority alerts: {severeIssueCount}
          </p>
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-slate-100/80 pt-4 dark:border-slate-800/80">
        <div className="flex flex-wrap gap-2">
          {model.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="soft" className="bg-slate-100 text-slate-600 dark:bg-slate-900/60 dark:text-slate-300">
              {tag}
            </Badge>
          ))}
        </div>
        <Link
          href={`/models/${model.slug}`}
          className="inline-flex h-9 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200 dark:hover:bg-slate-900 dark:focus-visible:ring-indigo-500/40"
        >
          Open profile
        </Link>
      </CardFooter>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <dt className="text-[10px] uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">{label}</dt>
      <dd className="text-sm font-semibold capitalize text-slate-900 dark:text-white">{value}</dd>
    </div>
  );
}
