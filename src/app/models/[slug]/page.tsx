import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RiskBadge } from "@/components/risk-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MODEL_DATA, getModelBySlug } from "@/data/models";
import type { ModelRecord, SeverityLevel } from "@/data/models";

interface ModelPageProps {
  params: { slug: string };
}

const SEVERITY_COLORS: Record<SeverityLevel, string> = {
  critical: "bg-rose-500/15 text-rose-700 dark:bg-rose-500/20 dark:text-rose-100",
  high: "bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-100",
  medium: "bg-sky-500/15 text-sky-700 dark:bg-sky-500/20 dark:text-sky-100",
  low: "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100",
  informational: "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-200",
};

export function generateStaticParams() {
  return MODEL_DATA.map((model) => ({ slug: model.slug }));
}

export function generateMetadata({ params }: ModelPageProps): Metadata {
  const model = getModelBySlug(params.slug);

  if (!model) {
    return {
      title: "Model not found",
    };
  }

  return {
    title: `${model.name} security profile`,
    description: `Security posture, advisories, and control coverage for ${model.name} by ${model.provider}.`,
  };
}

export default function ModelPage({ params }: ModelPageProps) {
  const model = getModelBySlug(params.slug);

  if (!model) {
    notFound();
  }

  const criticalIssues = model.issues.filter((issue) => issue.severity === "critical").length;
  const openIssues = model.issues.filter((issue) => issue.status !== "mitigated").length;
  const severityCounts = countBySeverity(model);
  const statusCounts = model.issues.reduce<Record<"open" | "mitigated" | "monitoring", number>>(
    (acc, issue) => {
      acc[issue.status] += 1;
      return acc;
    },
    { open: 0, mitigated: 0, monitoring: 0 },
  );
  const sortedIssues = [...model.issues].sort(
    (a, b) => new Date(b.discovered).getTime() - new Date(a.discovered).getTime(),
  );
  const uniqueVectors = Array.from(new Set(model.issues.map((issue) => issue.vector)));
  const tags = model.tags;

  return (
    <main className="space-y-12 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <span aria-hidden>←</span> Back to catalogue
        </Link>
        <Button variant="outline" size="sm" asChild className="rounded-full border-slate-200 px-4 text-xs dark:border-slate-800">
          <Link href={`mailto:trust@snowcrash.ai?subject=Briefing request · ${model?.name ?? ""}`}>
            Request assurance briefing
          </Link>
        </Button>
      </div>

      <Card className="border-slate-200/70 bg-white/95 shadow-[0_45px_80px_rgba(15,23,42,0.08)] dark:border-slate-900/70 dark:bg-slate-950/60">
        <CardHeader className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <RiskBadge level={model.riskLevel} />
              <Badge variant="soft" className="bg-slate-100 text-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
                {model.releaseStage}
              </Badge>
              <Badge variant="soft" className="bg-slate-100 text-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
                {model.license} license
              </Badge>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                {model.name}
              </CardTitle>
              <CardDescription className="text-base text-slate-500 dark:text-slate-400">
                Operated by {model.provider}
              </CardDescription>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300/80">{model.summary}</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="soft"
                  className="rounded-full bg-slate-900/5 px-3 py-1 text-[11px] font-medium text-slate-600 dark:bg-white/10 dark:text-slate-200"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="grid gap-4 rounded-3xl border border-slate-200/80 bg-white/90 p-6 text-sm shadow-[0_28px_56px_rgba(15,23,42,0.1)] dark:border-slate-900/70 dark:bg-slate-950/60">
            <MetricBlock label="Security score" value={`${model.securityScore}/100`} />
            <MetricBlock label="Last audit" value={model.lastAudit} />
            <MetricBlock label="Critical advisories" value={`${criticalIssues}`} />
            <MetricBlock label="Open advisories" value={`${openIssues}`} />
          </div>
        </CardHeader>
        <CardFooter className="flex flex-wrap gap-6 border-t border-slate-100/80 pt-6 text-xs text-slate-500 dark:border-slate-900/60 dark:text-slate-400">
          <span>Model size: {model.modelSize}</span>
          <span>Deployment: {model.deploymentOptions.join(", ")}</span>
          <span>Coverage: {uniqueVectors.length} attack vectors tracked</span>
          <span>Compliance: {model.compliance.join(" · ")}</span>
        </CardFooter>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="advisories">Advisories ({model.issues.length})</TabsTrigger>
            <TabsTrigger value="controls">Controls ({model.controls.length})</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="changelog">Changelog</TabsTrigger>
          </TabsList>
          <Badge variant="soft" className="bg-slate-900/5 text-slate-600 dark:bg-white/10 dark:text-slate-200">
            {statusCounts.open} open · {statusCounts.monitoring} monitoring · {statusCounts.mitigated} mitigated
          </Badge>
        </div>

        <TabsContent value="overview" className="border-none bg-transparent p-0">
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
                  <InsightLine label="Attack vectors monitored" value={uniqueVectors.length.toString()} hint={uniqueVectors.join(" · ")} />
                  <InsightLine label="High severity open" value={`${severityCounts.critical + severityCounts.high}`} hint={`${severityCounts.critical} critical · ${severityCounts.high} high`} />
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
                  <div key={severity} className="flex items-center justify-between rounded-2xl border border-slate-200/60 bg-white px-4 py-3 text-sm shadow-sm dark:border-slate-900/60 dark:bg-slate-950/50">
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
        </TabsContent>

        <TabsContent value="advisories" className="border-none bg-transparent p-0">
          <div className="space-y-5">
            {sortedIssues.map((issue) => (
              <Card
                key={issue.id}
                className="border-slate-200/70 bg-white/95 shadow-[0_35px_60px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-[0_45px_80px_rgba(79,70,229,0.16)] dark:border-slate-900/70 dark:bg-slate-950/60 dark:hover:border-indigo-500/40"
              >
                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <Badge
                      variant="soft"
                      className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] ${SEVERITY_COLORS[issue.severity]}`}
                    >
                      {issue.severity}
                    </Badge>
                    <CardTitle className="mt-3 text-lg text-slate-900 dark:text-white">{issue.title}</CardTitle>
                    <CardDescription className="text-xs uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
                      {issue.vector} &middot; {issue.discovered}
                    </CardDescription>
                  </div>
                  <Badge variant="soft" className="bg-slate-900/10 text-slate-700 dark:bg-white/10 dark:text-slate-200">
                    Status: {issue.status}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-6 text-slate-600 dark:text-slate-300/80">
                  <p>{issue.description}</p>
                  {issue.evidence && (
                    <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/70 p-4 text-xs text-slate-600 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-slate-200">
                      <p className="font-semibold uppercase tracking-[0.28em] text-indigo-500 dark:text-indigo-200">
                        Evidence
                      </p>
                      <p className="mt-2 leading-relaxed">{issue.evidence}</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
                      Recommended actions
                    </p>
                    <ul className="space-y-1 text-xs">
                      {issue.recommendedActions.map((action) => (
                        <li key={action} className="rounded-full border border-slate-200/70 bg-white px-3 py-1.5 text-[11px] text-slate-600 dark:border-slate-900 dark:bg-slate-950/60 dark:text-slate-300">
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {issue.references && issue.references.length > 0 && (
                    <div className="space-y-2 text-xs">
                      <p className="font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
                        References
                      </p>
                      <ul className="space-y-1">
                        {issue.references.map((reference) => (
                          <li key={reference.url}>
                            <a href={reference.url} className="text-slate-900 underline-offset-4 hover:underline dark:text-slate-100">
                              {reference.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="controls" className="border-none bg-transparent p-0">
          <Card className="border-slate-200/70 bg-white/95 dark:border-slate-900/70 dark:bg-slate-950/60">
            <CardHeader>
              <CardTitle className="text-xl">Control coverage</CardTitle>
              <CardDescription>
                Coverage map of security, governance, and monitoring controls implemented for {model.name}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {model.controls.map((control) => (
                <div
                  key={control.id}
                  className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-slate-900/70 dark:bg-slate-950/60"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">{control.title}</h3>
                    <Badge variant="soft" className="bg-slate-900/10 text-slate-700 dark:bg-white/10 dark:text-slate-200">
                      {control.maturity}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300/80">{control.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {control.coverage.map((area) => (
                      <Badge
                        key={area}
                        variant="soft"
                        className="rounded-full bg-slate-900/5 px-3 py-1 text-[11px] font-medium text-slate-600 dark:bg-white/10 dark:text-slate-200"
                      >
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roadmap" className="border-none bg-transparent p-0">
          <Card className="border-slate-200/70 bg-white/95 dark:border-slate-900/70 dark:bg-slate-950/60">
            <CardHeader>
              <CardTitle className="text-xl">Remediation roadmap</CardTitle>
              <CardDescription>Forward-looking initiatives supplied by the vendor and Snowcrash analysts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {model.roadmap.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200/70 bg-white px-4 py-3 shadow-sm dark:border-slate-900/70 dark:bg-slate-950/60">
                  <p className="font-semibold text-slate-900 dark:text-white">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evidence" className="border-none bg-transparent p-0">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-slate-200/70 bg-white/95 dark:border-slate-900/70 dark:bg-slate-950/60">
              <CardHeader>
                <CardTitle className="text-xl">Compliance attestations</CardTitle>
                <CardDescription>Vendor-provided certifications and Snowcrash verification notes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {model.compliance.map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200/70 bg-white px-4 py-3 shadow-sm dark:border-slate-900/70 dark:bg-slate-950/60">
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
                  <div key={reference.url} className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white px-4 py-3 shadow-sm dark:border-slate-900/70 dark:bg-slate-950/60">
                    <span>{reference.label}</span>
                    <a href={reference.url} className="text-xs font-semibold text-slate-900 underline-offset-4 hover:underline dark:text-slate-100">
                      Open →
                    </a>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="changelog" className="border-none bg-transparent p-0">
          <Card className="border-slate-200/70 bg-white/95 dark:border-slate-900/70 dark:bg-slate-950/60">
            <CardHeader>
              <CardTitle className="text-xl">Security changelog</CardTitle>
              <CardDescription>
                Change log of vendor updates and Snowcrash analyst notes related to {model.name}.
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table className="min-w-[520px]">
                <TableHeader>
                  <TableRow className="border-b border-slate-200/80 dark:border-slate-900/70">
                    <TableHead>Date</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Summary</TableHead>
                    <TableHead>Impact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {model.changelog.map((entry) => (
                    <TableRow key={`${entry.date}-${entry.title}`} className="border-b border-slate-100/70 last:border-0 dark:border-slate-900/60">
                      <TableCell className="whitespace-nowrap font-semibold text-slate-900 dark:text-white">
                        {entry.date}
                      </TableCell>
                      <TableCell className="font-semibold text-slate-700 dark:text-slate-200">{entry.title}</TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-300/80">{entry.summary}</TableCell>
                      <TableCell>
                        <Badge
                          variant="soft"
                          className={
                            entry.impact === "positive"
                              ? "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100"
                              : entry.impact === "negative"
                                ? "bg-rose-500/15 text-rose-700 dark:bg-rose-500/20 dark:text-rose-100"
                                : "bg-slate-900/10 text-slate-700 dark:bg-white/10 dark:text-slate-200"
                          }
                        >
                          {entry.impact}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}

function MetricBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <p className="text-lg font-semibold text-slate-900 dark:text-white">{value}</p>
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

function countBySeverity(model: ModelRecord) {
  return model.issues.reduce<Record<SeverityLevel, number>>(
    (acc, issue) => {
      acc[issue.severity] += 1;
      return acc;
    },
    { critical: 0, high: 0, medium: 0, low: 0, informational: 0 },
  );
}
