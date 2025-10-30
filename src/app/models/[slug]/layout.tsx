import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ModelTabsNav } from "./model-tabs-nav";
import { getModelDerivedData, type ModelDerivedData } from "./model-helpers";
import { RiskBadge } from "@/components/risk-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface LayoutParams {
  params: Promise<{ slug: string }>;
}

interface ModelLayoutProps extends LayoutParams {
  children: ReactNode;
}

export async function generateMetadata({ params }: LayoutParams): Promise<Metadata> {
  const { slug } = await params;
  const data = getModelDerivedData(slug);

  if (!data) {
    return {
      title: "Model not found",
    };
  }

  return {
    title: `${data.model.name} security profile`,
    description: `Security posture, advisories, and control coverage for ${data.model.name} by ${data.model.provider}.`,
  };
}

export default async function ModelLayout({ children, params }: ModelLayoutProps) {
  const { slug } = await params;
  const data = getModelDerivedData(slug);

  if (!data) {
    notFound();
  }

  return <LayoutContent data={data}>{children}</LayoutContent>;
}

function LayoutContent({ data, children }: { data: ModelDerivedData; children: ReactNode }) {
  const { model, criticalIssues, openIssues, statusCounts, uniqueVectors } = data;

  return (
    <main className="space-y-12 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <span aria-hidden>←</span> Back to catalogue
        </Link>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="rounded-full border-slate-200 px-4 text-xs dark:border-slate-800"
        >
          <Link href={`mailto:trust@snowcrash.ai?subject=Briefing request · ${model.name}`}>
            Request assurance briefing
          </Link>
        </Button>
      </div>

      <Card className="border-slate-200/70 bg-white/95 shadow-[0_45px_80px_rgba(15,23,42,0.08)] dark:border-slate-900/70 dark:bg-slate-950/60">
        <CardHeader className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <RiskBadge level={model.riskLevel} />
              <Badge
                variant="soft"
                className="bg-slate-100 text-slate-700 dark:bg-slate-900/70 dark:text-slate-300"
              >
                {model.releaseStage}
              </Badge>
              <Badge
                variant="soft"
                className="bg-slate-100 text-slate-700 dark:bg-slate-900/70 dark:text-slate-300"
              >
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
            <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300/80">
              {model.summary}
            </p>
            <div className="flex flex-wrap gap-2">
              {model.tags.map((tag) => (
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

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <ModelTabsNav
            slug={model.slug}
            issueCount={model.issues.length}
            controlCount={model.controls.length}
          />
          <Badge
            variant="soft"
            className="bg-slate-900/5 text-slate-600 dark:bg-white/10 dark:text-slate-200"
          >
            {statusCounts.open} open · {statusCounts.monitoring} monitoring · {statusCounts.mitigated} mitigated
          </Badge>
        </div>
        {children}
      </div>
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
