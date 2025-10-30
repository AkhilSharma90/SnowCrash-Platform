"use client";

import type { Dispatch, SetStateAction } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ALL_TAGS, MODEL_DATA, type ModelRecord, type SeverityLevel } from "@/data/models";
import { ModelCard } from "./model-card";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { RiskBadge } from "./risk-badge";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

type SortKey = "score-desc" | "score-asc" | "name";

const SORT_OPTIONS: Array<{ id: SortKey; label: string }> = [
  { id: "score-desc", label: "Security score (high → low)" },
  { id: "score-asc", label: "Security score (low → high)" },
  { id: "name", label: "Name (A → Z)" },
];

const SEVERITY_STYLES: Record<SeverityLevel, string> = {
  critical: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-100",
  high: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-100",
  medium: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-100",
  low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100",
  informational: "bg-slate-200 text-slate-700 dark:bg-slate-700/40 dark:text-slate-200",
};

const DATASET_PORTFOLIO = [
  {
    name: "Frontier Model Attack Surface",
    coverage: "28 frontier and specialised releases",
    format: "JSON, CSV",
    updated: "2024-06-03",
    description:
      "High-frequency crawl of model metadata, guardrail coverage and deployment options curated for vendor management teams.",
    link: "#",
    tags: ["guardrails", "vendor management"],
  },
  {
    name: "Incident & Advisory Feed",
    coverage: "451 historical advisories",
    format: "NDJSON, Parquet",
    updated: "2024-06-02",
    description:
      "Normalised incident timelines, severity, and mitigation objects aligned to the Snowcrash advisory taxonomy.",
    link: "#",
    tags: ["advisories", "timeline"],
  },
  {
    name: "Compliance Evidence Matrix",
    coverage: "17 control frameworks",
    format: "Google Sheet, CSV",
    updated: "2024-05-29",
    description:
      "Crosswalk between model attestations, evidence packages, and gaps across global assurance frameworks.",
    link: "#",
    tags: ["compliance", "governance"],
  },
];

const SUPPLY_CHAIN_ISSUES: Array<{
  library: string;
  severity: SeverityLevel;
  issue: string;
  status: string;
  updated: string;
  reference: string;
}> = [
  {
    library: "PyTorch",
    severity: "critical",
    issue: "TorchServe deserialisation chain leads to remote code execution on GPU nodes.",
    status: "Mitigation issued · upgrade to 0.9.1",
    updated: "2024-05-30",
    reference: "https://pytorch.org/serve/security/bulletins",
  },
  {
    library: "LangChain",
    severity: "high",
    issue: "Prompt template sandbox bypass when using experimental Python REPL tools.",
    status: "Patch pending · disable `PythonREPLTool` in production",
    updated: "2024-05-18",
    reference: "https://github.com/langchain-ai/langchain/security",
  },
  {
    library: "Hugging Face Transformers",
    severity: "medium",
    issue: "Unsafe model card metadata execution in `Pipeline.from_pretrained` helper.",
    status: "Workaround available · pin `safetensors>=0.4.2`",
    updated: "2024-05-12",
    reference: "https://huggingface.co/security",
  },
  {
    library: "Ray Serve",
    severity: "high",
    issue: "Tenant boundary regression when scaling deployments across multi-namespace clusters.",
    status: "Hotfix released · apply patch RAY-2024-144",
    updated: "2024-04-28",
    reference: "https://docs.ray.io/en/latest/ray-air/security",
  },
];

const BUG_BOUNTY_TIERS = [
  {
    tier: "Critical",
    reward: "$3,000 – $10,000",
    focus: "Breakouts impacting tenant isolation, guardrail bypass with PII leakage, supply-chain compromise.",
    sla: "24 hour triage | 48 hour fix commitment.",
  },
  {
    tier: "High",
    reward: "$1,000 – $3,000",
    focus: "Model jailbreak with persistent escalation, plugin scope abuse, data exfiltration vectors.",
    sla: "48 hour triage | 5 business day mitigation.",
  },
  {
    tier: "Medium",
    reward: "$250 – $1,000",
    focus: "Inference abuse requiring complex chaining, prompt filter bypasses with manual guardrails.",
    sla: "5 business day triage | 15 business day fix.",
  },
  {
    tier: "Low",
    reward: "Hall of fame credit",
    focus: "Informational issues, documentation gaps, resilience hardening opportunities.",
    sla: "7 business day triage.",
  },
];

const API_ENDPOINTS = [
  {
    name: "Model catalogue",
    method: "GET",
    path: "/api/v1/models",
    description: "Fetch normalised records with posture metadata, release state, and control coverage.",
  },
  {
    name: "Advisory feed",
    method: "GET",
    path: "/api/v1/advisories?since=2024-05-01",
    description: "Stream advisories with severity, vectors, and mitigation plans.",
  },
  {
    name: "Evidence uploads",
    method: "POST",
    path: "/api/v1/evidence",
    description: "Submit audit packages or attestations attached to vendor profiles.",
  },
  {
    name: "Signal subscriptions",
    method: "POST",
    path: "/api/v1/subscriptions",
    description: "Define webhook destinations for high severity supply-chain events.",
  },
];

export function ModelExplorer() {
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [riskFilters, setRiskFilters] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>("score-desc");

  const filteredModels = useMemo(() => {
    return MODEL_DATA.filter((model) => {
      const matchesQuery =
        query.length === 0 ||
        [model.name, model.provider, ...model.tags].some((value) =>
          value.toLowerCase().includes(query.toLowerCase()),
        );

      const matchesTags =
        selectedTags.length === 0 || selectedTags.every((tag) => model.tags.includes(tag));

      const matchesRisk = riskFilters.length === 0 || riskFilters.includes(model.riskLevel);

      return matchesQuery && matchesTags && matchesRisk;
    }).sort((a, b) => sortModels(a, b, sort));
  }, [query, riskFilters, selectedTags, sort]);

  const activeFilters = selectedTags.length + riskFilters.length;

  const riskDistribution = useMemo(() => {
    return filteredModels.reduce(
      (acc, model) => {
        acc[model.riskLevel] += 1;
        return acc;
      },
      { guarded: 0, elevated: 0, critical: 0 },
    );
  }, [filteredModels]);

  const advisoryFeed = useMemo(() => {
    return MODEL_DATA.flatMap((model) =>
      model.issues.map((issue) => ({
        ...issue,
        model: model.name,
        provider: model.provider,
        slug: model.slug,
      })),
    )
      .sort((a, b) => new Date(b.discovered).getTime() - new Date(a.discovered).getTime())
      .slice(0, 8);
  }, []);

  const leaderboard = useMemo(() => {
    return [...filteredModels].sort((a, b) => b.securityScore - a.securityScore).slice(0, 5);
  }, [filteredModels]);

  const vendorCount = useMemo(() => new Set(filteredModels.map((model) => model.provider)).size, [filteredModels]);

  const totalIssues = useMemo(
    () => filteredModels.reduce((sum, model) => sum + model.issues.length, 0),
    [filteredModels],
  );

  const openIssues = useMemo(
    () =>
      filteredModels.reduce(
        (sum, model) => sum + model.issues.filter((issue) => issue.status !== "mitigated").length,
        0,
      ),
    [filteredModels],
  );

  const mitigationRate = totalIssues ? Math.round(((totalIssues - openIssues) / totalIssues) * 100) : 0;

  const averageScore = useMemo(() => {
    if (filteredModels.length === 0) {
      return Math.round(
        MODEL_DATA.reduce((sum, model) => sum + model.securityScore, 0) / Math.max(MODEL_DATA.length, 1),
      );
    }

    return Math.round(
      filteredModels.reduce((sum, model) => sum + model.securityScore, 0) / Math.max(filteredModels.length, 1),
    );
  }, [filteredModels]);

  const frameworksTracked = useMemo(() => {
    if (filteredModels.length === 0) {
      return new Set(MODEL_DATA.flatMap((model) => model.compliance)).size;
    }

    return new Set(filteredModels.flatMap((model) => model.compliance)).size;
  }, [filteredModels]);

  const highestRiskModel = useMemo(() => {
    if (filteredModels.length === 0) {
      return MODEL_DATA.find((model) => model.riskLevel === "critical") ?? MODEL_DATA[0];
    }

    return filteredModels.find((model) => model.riskLevel === "critical") ?? filteredModels[0];
  }, [filteredModels]);

  const topIssue = advisoryFeed[0];

  const severityBreakdown = useMemo(() => {
    return filteredModels.reduce(
      (acc, model) => {
        model.issues.forEach((issue) => {
          acc[issue.severity] += 1;
        });
        return acc;
      },
      {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        informational: 0,
      } as Record<SeverityLevel, number>,
    );
  }, [filteredModels]);

  return (
    <section className="space-y-10">
      <div className="relative overflow-hidden rounded-[36px] border border-slate-200/70 bg-white px-8 py-10 shadow-[0_50px_120px_rgba(15,23,42,0.12)] sm:px-12 dark:border-slate-900/60 dark:bg-slate-950/70">
        <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-indigo-100/60 blur-3xl dark:bg-indigo-500/20" aria-hidden />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-sky-100/60 blur-3xl dark:bg-sky-500/20" aria-hidden />
        <div className="relative grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            <Badge variant="soft" className="bg-indigo-500/10 text-indigo-700 shadow-sm dark:bg-indigo-500/20 dark:text-indigo-100">
              Live trust cockpit
            </Badge>
            <div className="space-y-3">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Curate the intelligence slice that matches your risk appetite
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300/80">
                Blend catalogue filters, benchmark comparisons, signal feeds, and supply-chain telemetry without leaving the Snowcrash command centre.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Insight
                title="Models in scope"
                value={`${filteredModels.length || MODEL_DATA.length}`}
                hint="Driven by your active filters and ready for deep-dive review."
              />
              <Insight
                title="Average score"
                value={`${averageScore}`}
                hint="Weighted security score across the current catalogue slice."
              />
              <Insight
                title="Framework coverage"
                value={`${frameworksTracked}`}
                hint="Unique assurance frameworks represented in this view."
              />
            </div>
          </div>
          <div className="space-y-5">
            <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-5 text-sm shadow-lg backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-950/50">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">
                Signal ticker
              </p>
              <div className="mt-3 space-y-3">
                {advisoryFeed.slice(0, 4).map((issue) => (
                  <div
                    key={`${issue.model}-${issue.id}`}
                    className="rounded-2xl border border-slate-200/60 bg-white/70 p-3 shadow-sm transition hover:border-indigo-200 hover:shadow-[0_16px_30px_rgba(79,70,229,0.12)] dark:border-slate-800/60 dark:bg-slate-950/60 dark:hover:border-indigo-500/40"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">{issue.model}</p>
                      <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.32em] ${SEVERITY_STYLES[issue.severity]}`}>
                        {issue.severity}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{issue.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {issue.vector} · {issue.discovered}
                    </p>
                  </div>
                ))}
              </div>
              {topIssue && (
                <Link
                  href={`/models/${topIssue.slug}`}
                  className="mt-4 inline-flex items-center text-xs font-semibold uppercase tracking-[0.28em] text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-300"
                >
                  Dive into latest signal →
                </Link>
              )}
            </div>
            {highestRiskModel && (
              <div className="rounded-3xl border border-rose-200/60 bg-rose-50/70 p-5 text-sm text-rose-700 shadow-sm dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.32em]">Critical watch</p>
                  <Badge variant="soft" className="bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-100">
                    {highestRiskModel.riskLevel}
                  </Badge>
                </div>
                <p className="mt-2 text-base font-semibold text-rose-800 dark:text-rose-50">
                  {highestRiskModel.name} · {highestRiskModel.provider}
                </p>
                <p className="mt-1 text-xs leading-5 text-rose-600 dark:text-rose-100/80">
                  {highestRiskModel.summary.slice(0, 150)}
                  {highestRiskModel.summary.length > 150 ? "…" : ""}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/models/${highestRiskModel.slug}`}
                    className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-700 underline-offset-4 hover:underline dark:text-rose-100"
                  >
                    View mitigation matrix →
                  </Link>
                  <span className="text-xs text-rose-500/80 dark:text-rose-200/60">
                    {highestRiskModel.issues.filter((issue) => issue.severity === "critical").length} critical advisories open
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <section id="catalogue" className="scroll-mt-32 space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">Catalogue</p>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">LLM security posture board</h3>
          </div>
          <div className="flex flex-wrap gap-3 text-xs">
            <Badge variant="soft" className="bg-slate-900/5 text-slate-600 dark:bg-white/5 dark:text-slate-200">
              Guarded {riskDistribution.guarded}
            </Badge>
            <Badge variant="soft" className="bg-slate-900/5 text-slate-600 dark:bg-white/5 dark:text-slate-200">
              Elevated {riskDistribution.elevated}
            </Badge>
            <Badge variant="soft" className="bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-100">
              Critical {riskDistribution.critical}
            </Badge>
          </div>
        </div>

        <Card className="border-slate-200/70 bg-white/95 shadow-[0_42px_80px_rgba(15,23,42,0.08)] dark:border-slate-800/70 dark:bg-slate-950/60">
          <CardHeader className="gap-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle className="text-3xl tracking-tight">Dynamic intelligence board</CardTitle>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300/80">
                  Search the Snowcrash catalogue to understand which foundation models meet your bar, where the red flags sit, and how vendors are remediating critical advisories.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-center text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200">
                {filteredModels.length} models · {activeFilters ? `${activeFilters} active filter${activeFilters > 1 ? "s" : ""}` : "no filters applied"}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">
                  Search
                </p>
                <Input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by model, provider, capability, compliance..."
                />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">
                  Sort
                </p>
                <Select value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <FilterGroup
                label="Risk posture"
                options={[
                  { id: "guarded", label: "Guarded" },
                  { id: "elevated", label: "Elevated" },
                  { id: "critical", label: "Critical" },
                ]}
                selected={riskFilters}
                onToggle={(value) => toggleValue(value, setRiskFilters)}
              />
              <FilterGroup
                label="Capabilities & characteristics"
                options={ALL_TAGS.map((tag) => ({ id: tag, label: tag }))}
                selected={selectedTags}
                onToggle={(value) => toggleValue(value, setSelectedTags)}
                scrollable
              />
            </div>
          </CardContent>
        </Card>

        {filteredModels.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white/60 p-12 text-center text-sm text-slate-500 dark:border-slate-800/70 dark:bg-slate-950/40 dark:text-slate-400">
            No models match your current filters. Try adjusting search terms or clearing filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredModels.map((model) => (
              <ModelCard key={model.slug} model={model} />
            ))}
          </div>
        )}
      </section>

      <section id="benchmark" className="scroll-mt-32 space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">Benchmarks</p>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Comparative posture benchmarks</h3>
          </div>
          <Badge variant="soft" className="self-start bg-slate-900/5 text-slate-600 dark:bg-white/10 dark:text-slate-200">
            Normalised view
          </Badge>
        </div>
        <Card className="overflow-hidden border-slate-200/80 bg-white/95 dark:border-slate-800/70 dark:bg-slate-950/60">
          <CardHeader>
            <CardTitle className="text-lg">Security benchmarks</CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-300/80">
              Compare posture, audit cadence, and open advisories at a glance across tracked foundation models.
            </p>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table className="min-w-[640px]">
              <TableHeader>
                <TableRow className="border-b border-slate-200/80 dark:border-slate-800">
                  <TableHead>Model</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Open advisories</TableHead>
                  <TableHead>Last audit</TableHead>
                  <TableHead>Deployment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredModels.map((model) => {
                  const openAdvisories = model.issues.filter((issue) => issue.status !== "mitigated").length;
                  return (
                    <TableRow key={model.slug} className="border-b border-slate-100/80 last:border-0 dark:border-slate-900/70">
                      <TableCell className="font-semibold text-slate-900 dark:text-white">{model.name}</TableCell>
                      <TableCell>
                        <RiskBadge level={model.riskLevel} />
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900 dark:text-white">
                        {model.securityScore}
                      </TableCell>
                      <TableCell>{openAdvisories}</TableCell>
                      <TableCell>{model.lastAudit}</TableCell>
                      <TableCell>{model.deploymentOptions.join(", ")}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <section id="signals" className="scroll-mt-32 space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">Signals</p>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Live advisories and programme pulse</h3>
          </div>
          <Badge variant="soft" className="self-start bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100">
            Streaming feed
          </Badge>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          <Card className="border-slate-200/80 bg-white/95 dark:border-slate-800/70 dark:bg-slate-950/60">
            <CardHeader>
              <CardTitle className="text-xl">Latest advisories</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-300/80">
                Fresh intelligence from Snowcrash monitoring. Track high-velocity advisories before they impact your
                workloads.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {advisoryFeed.map((issue) => (
                <div
                  key={`${issue.model}-${issue.id}`}
                  className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-[0_16px_32px_rgba(79,70,229,0.12)] dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-indigo-500/40"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">
                        {issue.model}
                      </p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{issue.title}</p>
                    </div>
                    <Badge
                      variant="soft"
                      className="bg-slate-900/10 px-3 py-1 text-[10px] uppercase tracking-[0.32em] text-slate-700 dark:bg-white/10 dark:text-slate-200"
                    >
                      {issue.severity}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {issue.vector} · {issue.discovered}
                  </p>
                  <Separator className="my-3" />
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span>Status: {issue.status}</span>
                    <a
                      href={`/models/${issue.slug}`}
                      className="font-semibold text-slate-900 underline-offset-4 hover:underline dark:text-slate-100"
                    >
                      View profile →
                    </a>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white/95 dark:border-slate-800/70 dark:bg-slate-950/60">
            <CardHeader>
              <CardTitle className="text-xl">Programme insights</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-300/80">
                Signal density across the portfolio to help you prioritise assurance reviews.
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              <Insight
                title="High-risk advisories"
                value={`${advisoryFeed.filter((issue) => issue.severity === "critical" || issue.severity === "high").length}`}
                hint="Active critical or high severity advisories discovered in the past quarter."
              />
              <Insight
                title="Average security score"
                value={`${averageScore}`}
                hint="Weighted by mitigation status and last audit date."
              />
              <Insight
                title="Unique attack vectors"
                value={`${new Set(advisoryFeed.map((issue) => issue.vector)).size}`}
                hint="Distinct exploitation paths observed across tracked models."
              />
              <Insight
                title="Vendors monitored"
                value={`${vendorCount}`}
                hint="Unique platform operators with live advisories."
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="datasets" className="scroll-mt-32 space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">Datasets</p>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Research-grade exports for assurance teams</h3>
          </div>
          <Badge variant="soft" className="self-start bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-100">
            Curated drops
          </Badge>
        </div>
        <Card className="border-slate-200/80 bg-white/95 dark:border-slate-800/70 dark:bg-slate-950/60">
          <CardHeader>
            <CardTitle className="text-xl">Datasets for trust & assurance teams</CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-300/80">
              Curated exports maintained by Snowcrash Research to accelerate vendor reviews, posture tracking, and reporting workflows.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {DATASET_PORTFOLIO.map((dataset) => (
              <div
                key={dataset.name}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-[0_16px_32px_rgba(79,70,229,0.12)] dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-indigo-500/40"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
                      {dataset.updated}
                    </p>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{dataset.name}</h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300/80">{dataset.description}</p>
                  </div>
                  <Button variant="outline" size="sm" className="self-start rounded-full px-4 text-xs" asChild>
                    <Link href={dataset.link}>Request access</Link>
                  </Button>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span>Coverage: {dataset.coverage}</span>
                  <span>Format: {dataset.format}</span>
                  <div className="flex flex-wrap gap-2">
                    {dataset.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="soft"
                        className="bg-slate-900/5 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-slate-600 dark:bg-white/10 dark:text-slate-200"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section id="supply-chain" className="scroll-mt-32 space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">Supply chain</p>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Library advisories demanding hotfixes</h3>
          </div>
          <Badge variant="soft" className="self-start bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-100">
            Watchlist
          </Badge>
        </div>
        <Card className="overflow-hidden border-slate-200/80 bg-white/95 dark:border-slate-800/70 dark:bg-slate-950/60">
          <CardHeader>
            <CardTitle className="text-xl">Supply chain issues</CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-300/80">
              Active issues across model hosting, inference, and tooling libraries that warrant immediate attention.
            </p>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow className="border-b border-slate-200/80 dark:border-slate-800">
                  <TableHead>Library</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {SUPPLY_CHAIN_ISSUES.map((issue) => (
                  <TableRow key={issue.library} className="border-b border-slate-100/80 last:border-0 dark:border-slate-900/70">
                    <TableCell className="font-semibold text-slate-900 dark:text-white">{issue.library}</TableCell>
                    <TableCell>
                      <Badge
                        variant="soft"
                        className={`${SEVERITY_STYLES[issue.severity]} px-3 py-1 text-[10px] uppercase tracking-[0.28em]`}
                      >
                        {issue.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600 dark:text-slate-300/80">{issue.issue}</TableCell>
                    <TableCell className="text-sm text-slate-600 dark:text-slate-300/80">{issue.status}</TableCell>
                    <TableCell className="text-sm text-slate-600 dark:text-slate-300/80">
                      <div className="flex flex-col gap-1">
                        <span>{issue.updated}</span>
                        <Link
                          href={issue.reference}
                          className="text-xs font-semibold text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-300"
                        >
                          Advisory →
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

        <section id="leaderboard" className="scroll-mt-32 space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">Leaderboard</p>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Scorecard for your filtered catalogue</h3>
            </div>
            <Badge variant="soft" className="self-start bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100">
              Filter aware
            </Badge>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <Card className="overflow-hidden border-slate-200/80 bg-white/95 dark:border-slate-800/70 dark:bg-slate-950/60">
              <CardHeader>
                <CardTitle className="text-xl">Security score leaderboard</CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-300/80">
                  Top performing models by Snowcrash security score after applying your current filters.
                </p>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table className="min-w-[640px]">
                  <TableHeader>
                    <TableRow className="border-b border-slate-200/80 dark:border-slate-800">
                      <TableHead>#</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead>Open advisories</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboard.map((model, index) => {
                      const openAdvisories = model.issues.filter((issue) => issue.status !== "mitigated").length;
                      return (
                        <TableRow key={model.slug} className="border-b border-slate-100/80 last:border-0 dark:border-slate-900/70">
                          <TableCell className="font-semibold text-slate-500 dark:text-slate-400">#{index + 1}</TableCell>
                          <TableCell className="font-semibold text-slate-900 dark:text-white">{model.name}</TableCell>
                          <TableCell className="text-sm text-slate-600 dark:text-slate-300/80">{model.provider}</TableCell>
                          <TableCell className="font-semibold text-slate-900 dark:text-white">{model.securityScore}</TableCell>
                          <TableCell>
                            <RiskBadge level={model.riskLevel} />
                          </TableCell>
                          <TableCell className="text-sm text-slate-600 dark:text-slate-300/80">{openAdvisories}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card className="border-slate-200/80 bg-white/95 dark:border-slate-800/70 dark:bg-slate-950/60">
              <CardHeader>
                <CardTitle className="text-xl">Portfolio highlights</CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-300/80">
                  Rapid snapshot of programme health with the filters you&apos;ve applied.
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                <Insight
                  title="Average security score"
                  value={`${Math.round(
                    leaderboard.reduce((sum, model) => sum + model.securityScore, 0) / Math.max(leaderboard.length, 1),
                  )}`}
                  hint="Mean score across top performing models."
                />
                <Insight
                  title="Open advisories"
                  value={`${openIssues}`}
                  hint="Issues still requiring mitigation across filtered models."
                />
                <Insight
                  title="Mitigation coverage"
                  value={`${mitigationRate}%`}
                  hint="Share of advisories with fixes validated."
                />
                <Insight
                  title="Vendors represented"
                  value={`${vendorCount}`}
                  hint="Unique providers present in the current leaderboard."
                />
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="issue-submission" className="scroll-mt-32 space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">Issue submission</p>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Escalate new findings to Snowcrash</h3>
            </div>
            <Badge variant="soft" className="self-start bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-100">
              24h triage SLA
            </Badge>
          </div>
          <Card className="border-slate-200/80 bg-white/95 dark:border-slate-800/70 dark:bg-slate-950/60">
            <CardHeader>
              <CardTitle className="text-xl">Submit a new issue</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-300/80">
                Share red-team findings, production incidents, or remediation updates. Snowcrash triage responds within
                one business day for critical disclosures.
              </p>
            </CardHeader>
            <CardContent>
              <form className="grid gap-5 max-w-2xl">
                <div className="grid gap-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500" htmlFor="issue-title">
                    Title
                  </label>
                  <Input id="issue-title" placeholder="e.g. Plugin sandbox bypass in GPT-4o custom tool" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500" htmlFor="issue-severity">
                      Severity
                    </label>
                    <Select id="issue-severity" defaultValue="critical">
                      {["critical", "high", "medium", "low", "informational"].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500" htmlFor="issue-category">
                      Category
                    </label>
                    <Select id="issue-category" defaultValue="guardrails">
                      {["guardrails", "data governance", "supply chain", "model behaviour", "infrastructure"].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500" htmlFor="issue-components">
                    Affected components
                  </label>
                  <Input id="issue-components" placeholder="List impacted models, libraries, or environments" />
                </div>
                <div className="grid gap-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500" htmlFor="issue-description">
                    Technical summary
                  </label>
                  <textarea
                    id="issue-description"
                    className="min-h-[140px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200 dark:focus-visible:ring-offset-slate-950"
                    placeholder="Outline exploit path, reproduction steps, observed impact, and any mitigation attempts."
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500" htmlFor="issue-artifacts">
                    Evidence links
                  </label>
                  <Input id="issue-artifacts" placeholder="Attach URLs to logs, proof-of-concept repos, or screenshots" />
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <Button type="submit" className="rounded-full px-6">
                    Submit to Snowcrash
                  </Button>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Encrypted submissions supported via <a href="mailto:security@snowcrash.ai" className="font-semibold underline-offset-4 hover:underline">security@snowcrash.ai</a>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>

        <section id="bug-bounty" className="scroll-mt-32 space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">Bug bounty</p>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Reward tiers for impactful disclosures</h3>
            </div>
            <Badge variant="soft" className="self-start bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-100">
              Active programme
            </Badge>
          </div>
          <Card className="border-slate-200/80 bg-white/95 dark:border-slate-800/70 dark:bg-slate-950/60">
            <CardHeader>
              <CardTitle className="text-xl">Bug bounty programme</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-300/80">
                Snowcrash rewards meaningful improvements to the security posture of foundation models and supporting
                infrastructure across our ecosystem.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300/80">
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">
                    Scope highlights
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-4">
                    <li>Prompt guardrails, policy enforcement, and content filters</li>
                    <li>Plugin, tool, and agent supply chain</li>
                    <li>Inference infrastructure isolation and secrets handling</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300/80">
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">
                    Out of scope
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-4">
                    <li>Third-party SaaS unrelated to Snowcrash production</li>
                    <li>Denial of service without data exposure</li>
                    <li>Phishing or social engineering of Snowcrash staff</li>
                  </ul>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table className="min-w-[640px]">
                  <TableHeader>
                    <TableRow className="border-b border-slate-200/80 dark:border-slate-800">
                      <TableHead>Tier</TableHead>
                      <TableHead>Reward</TableHead>
                      <TableHead>Focus areas</TableHead>
                      <TableHead>Response SLAs</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {BUG_BOUNTY_TIERS.map((tier) => (
                      <TableRow key={tier.tier} className="border-b border-slate-100/80 last:border-0 dark:border-slate-900/70">
                        <TableCell className="font-semibold text-slate-900 dark:text-white">{tier.tier}</TableCell>
                        <TableCell className="text-sm text-slate-600 dark:text-slate-300/80">{tier.reward}</TableCell>
                        <TableCell className="text-sm text-slate-600 dark:text-slate-300/80">{tier.focus}</TableCell>
                        <TableCell className="text-sm text-slate-600 dark:text-slate-300/80">{tier.sla}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300/80">
                <p>
                  Need encrypted drop-off? Fetch our PGP key or schedule a coordinated disclosure with{" "}
                  <a href="mailto:security@snowcrash.ai" className="font-semibold underline-offset-4 hover:underline">
                    security@snowcrash.ai
                  </a>
                  .
                </p>
                <Button variant="outline" size="sm" className="rounded-full px-4 text-xs" asChild>
                  <Link href="mailto:security@snowcrash.ai?subject=Snowcrash%20Bug%20Bounty">
                    Contact triage
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="analytics" className="scroll-mt-32 space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">Analytics</p>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Operational metrics from your current slice</h3>
            </div>
            <Badge variant="soft" className="self-start bg-slate-900/5 text-slate-600 dark:bg-white/10 dark:text-slate-200">
              Auto-updated
            </Badge>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Card className="border-slate-200/80 bg-white/95 dark:border-slate-800/70 dark:bg-slate-950/60">
              <CardHeader>
                <CardTitle className="text-xl">Live analytics</CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-300/80">
                  Macro view of risk posture and programme coverage calculated from current filters.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Insight
                    title="Total advisories"
                    value={`${totalIssues}`}
                    hint="Cumulative issues discovered across filtered models."
                  />
                  <Insight
                    title="Open advisories"
                    value={`${openIssues}`}
                    hint="Issues awaiting remediation."
                  />
                  <Insight
                    title="Mitigation rate"
                    value={`${mitigationRate}%`}
                    hint="Portion of advisories closed with validated fixes."
                  />
                  <Insight
                    title="Vendors monitored"
                    value={`${vendorCount}`}
                    hint="Unique providers impacted by your current filter set."
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200/80 bg-white/95 dark:border-slate-800/70 dark:bg-slate-950/60">
              <CardHeader>
                <CardTitle className="text-xl">Severity distribution</CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-300/80">
                  Track where investigation bandwidth should focus based on active severities.
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {(Object.keys(severityBreakdown) as SeverityLevel[]).map((level) => (
                  <div key={level} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          level === "critical"
                            ? "bg-rose-500"
                            : level === "high"
                              ? "bg-amber-500"
                              : level === "medium"
                                ? "bg-sky-500"
                                : level === "low"
                                  ? "bg-emerald-500"
                                  : "bg-slate-400"
                        }`}
                      />
                      <span className="text-sm font-semibold capitalize text-slate-700 dark:text-slate-200">
                        {level}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                      <span>{severityBreakdown[level]}</span>
                      <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                        <div
                          className={`h-full rounded-full ${
                            level === "critical"
                              ? "bg-rose-500"
                              : level === "high"
                                ? "bg-amber-500"
                                : level === "medium"
                                  ? "bg-sky-500"
                                  : level === "low"
                                    ? "bg-emerald-500"
                                    : "bg-slate-500"
                          }`}
                          style={{
                            width: `${totalIssues ? Math.min(100, (severityBreakdown[level] / totalIssues) * 100) : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Separator />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Severity counts include mitigated issues to retain historical signal. Toggle filters above to refine
                  the data slice.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="api-access" className="scroll-mt-32 space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">API access</p>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Automate posture monitoring via API</h3>
            </div>
            <Badge variant="soft" className="self-start bg-slate-900/5 text-slate-600 dark:bg-white/10 dark:text-slate-200">
              Enterprise ready
            </Badge>
          </div>
          <Card className="border-slate-200/80 bg-white/95 dark:border-slate-800/70 dark:bg-slate-950/60">
            <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle className="text-xl">API access</CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-300/80">
                  Integrate Snowcrash intelligence directly into your pipelines, SIEM, or governance tooling.
                </p>
              </div>
              <Button variant="outline" size="sm" className="rounded-full px-4 text-xs" asChild>
                <Link href="mailto:trust@snowcrash.ai?subject=Snowcrash%20API%20Access">Request API key</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-3">
                {API_ENDPOINTS.map((endpoint) => (
                  <div
                    key={endpoint.path}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-4 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300/80 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">
                        {endpoint.name}
                      </p>
                      <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                        {endpoint.method} {endpoint.path}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{endpoint.description}</p>
                    </div>
                    <Badge
                      variant="soft"
                      className="self-start bg-slate-900/5 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-slate-600 dark:bg-white/10 dark:text-slate-200 sm:self-auto"
                    >
                      OAuth2 · Webhooks · REST
                    </Badge>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">
                  Quick start
                </p>
                <pre className="mt-3 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-950/90 p-4 text-xs text-slate-100 dark:border-slate-800">
{`curl https://api.snowcrash.ai/v1/advisories \\
  -H "Authorization: Bearer $SNOWCRASH_TOKEN" \\
  -H "Accept: application/json"`}
                </pre>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Need streaming updates? Configure a webhook subscription or connect to the managed Snowcrash Kafka feed.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
    </section>
  );
}

function sortModels(a: ModelRecord, b: ModelRecord, sort: SortKey) {
  if (sort === "score-desc") {
    return b.securityScore - a.securityScore;
  }

  if (sort === "score-asc") {
    return a.securityScore - b.securityScore;
  }

  return a.name.localeCompare(b.name);
}

interface FilterGroupProps {
  label: string;
  options: Array<{ id: string; label: string }>;
  selected: string[];
  onToggle: (id: string) => void;
  scrollable?: boolean;
}

function FilterGroup({ label, options, selected, onToggle, scrollable = false }: FilterGroupProps) {
  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-[0_20px_40px_rgba(15,23,42,0.06)] dark:border-slate-800/70 dark:bg-slate-950/60">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">{label}</p>
        {selected.length > 0 && (
          <span className="text-xs text-slate-400 dark:text-slate-500">{selected.length} selected</span>
        )}
      </div>
      <div
        className={`flex flex-wrap gap-2 ${scrollable ? "max-h-40 overflow-y-auto pr-1" : ""}`}
        role="group"
        aria-label={label}
      >
        {options.map((option) => {
          const isSelected = selected.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onToggle(option.id)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 ${
                isSelected
                  ? "border-indigo-300 bg-indigo-500/10 text-indigo-600 dark:border-indigo-500/60 dark:bg-indigo-500/20 dark:text-indigo-200"
                  : "border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function toggleValue<T extends string>(value: T, setter: Dispatch<SetStateAction<T[]>>) {
  setter((prev) => {
    if (prev.includes(value)) {
      return prev.filter((item) => item !== value);
    }
    return [...prev, value];
  });
}

function Insight({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <div className="space-y-1 rounded-2xl border border-slate-200/70 bg-white px-4 py-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">{title}</p>
      <p className="text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
    </div>
  );
}
