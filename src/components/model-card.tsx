import Link from "next/link";
import type { ReactNode } from "react";
import { ModelRecord } from "@/data/models";
import { deriveSecurityGrade, getIssueMetadata, summarizeIssues } from "@/lib/security-insights";
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
  const { grade, descriptor } = deriveSecurityGrade(model.securityScore);
  const issueInsights = summarizeIssues(model.issues);
  const hasIssues = model.issues.length > 0;
  const highlightedIssues = issues.map((issue) => ({
    issue,
    metadata: issueInsights.metadataById[issue.id] ?? getIssueMetadata(issue),
  }));
  const complianceHighlight = model.compliance.length ? model.compliance.slice(0, 2).join(", ") : "—";
  const stageLabel = formatStage(model.releaseStage);
  const worstCvssDisplay = hasIssues ? `${issueInsights.highestCvss.toFixed(1)} / 10` : "—";
  const averageCvssDisplay = hasIssues ? issueInsights.averageCvss.toFixed(1) : "—";
  const topCwesDisplay = issueInsights.topCwes.length ? issueInsights.topCwes.join(", ") : "Not yet catalogued";

  return (
    <Card className="group flex h-full flex-col border-slate-200/70 bg-white/95 shadow-[0_35px_60px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_45px_75px_rgba(15,23,42,0.12)] dark:border-slate-800/60 dark:bg-slate-950/60">
      <CardHeader className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <CardTitle className="text-xl leading-tight">
              <Link
                href={`/models/${model.slug}`}
                className="transition hover:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950"
              >
                {model.name}
              </Link>
            </CardTitle>
            <p className="text-sm text-slate-500 dark:text-slate-400">Operated by {model.provider}</p>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="border-slate-200 bg-white normal-case tracking-[0.12em] text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300"
              >
                Stage · {stageLabel}
              </Badge>
            </div>
          </div>
          <RiskBadge level={model.riskLevel} />
        </div>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300/90">{model.summary}</p>
        <dl className="grid gap-4 text-xs text-slate-600 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 dark:text-slate-400">
          <Metric
            label="Security grade"
            value={
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold text-slate-900 dark:text-white">{grade}</span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{descriptor}</span>
              </div>
            }
          />
          <Metric label="Security score" value={`${model.securityScore}/100`} />
          <Metric label="Worst CVSS" value={worstCvssDisplay} />
          <Metric label="Open CVEs" value={`${issueInsights.openCveCount}`} />
          <Metric label="Last audit" value={model.lastAudit} />
          <Metric label="Compliance" value={complianceHighlight} />
        </dl>
      </CardHeader>
      <CardContent className="space-y-5">
        {issues.length > 0 && (
          <div className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">
              Critical intelligence
            </p>
            <div className="space-y-2">
              {highlightedIssues.map(({ issue, metadata }) => (
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
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <span
                      className="font-medium text-slate-600 dark:text-slate-200"
                      title={metadata.cvss.vector}
                    >
                      CVSS {metadata.cvss.score.toFixed(1)} ({metadata.cvss.version})
                    </span>
                    <span className="font-medium text-slate-600 dark:text-slate-200">
                      {metadata.cve ?? "CVE pending"}
                    </span>
                    <span className="text-slate-500 dark:text-slate-300">
                      CWEs: {metadata.cwes.length ? metadata.cwes.slice(0, 2).join(", ") : "n/a"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="rounded-2xl border border-slate-200/70 bg-white px-4 py-3 text-xs text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-300">
          <div className="flex flex-wrap items-center justify-between gap-2 font-semibold text-slate-700 dark:text-slate-200">
            <span>{model.issues.length} advisories tracked</span>
            <span>{openIssueCount} open</span>
          </div>
          <div className="mt-1 flex flex-wrap gap-3 text-[11px] text-slate-500 dark:text-slate-400">
            <span>High priority alerts: {severeIssueCount}</span>
            <span>Open CVEs: {issueInsights.openCveCount}</span>
          </div>
          <div className="mt-1 flex flex-wrap gap-3 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Highest CVSS: {hasIssues ? issueInsights.highestCvss.toFixed(1) : "—"}</span>
            <span>Average CVSS: {averageCvssDisplay}</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Common CWEs: {topCwesDisplay}
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
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/models/${model.slug}/signals`}
            className="inline-flex h-9 items-center justify-center rounded-full border border-indigo-200 bg-indigo-50 px-4 text-xs font-semibold text-indigo-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-indigo-500/50 dark:bg-indigo-500/10 dark:text-indigo-100 dark:hover:bg-indigo-500/20"
          >
            Signal grading
          </Link>
          <Link
            href={`/models/${model.slug}`}
            className="inline-flex h-9 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200 dark:hover:bg-slate-900 dark:focus-visible:ring-indigo-500/40"
          >
            Open profile
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

function formatStage(stage: ModelRecord["releaseStage"]) {
  switch (stage) {
    case "general":
      return "General availability";
    case "limited":
      return "Limited release";
    case "beta":
      return "Beta";
    case "research":
      return "Research preview";
    default:
      return stage;
  }
}

function Metric({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="space-y-1">
      <dt className="text-[10px] uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">{label}</dt>
      <dd className="text-sm font-semibold text-slate-900 dark:text-white">{value}</dd>
    </div>
  );
}
