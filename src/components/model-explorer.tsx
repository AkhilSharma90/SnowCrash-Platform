"use client";

import type { Dispatch, SetStateAction } from "react";
import { useMemo, useState } from "react";
import { ALL_TAGS, MODEL_DATA, ModelRecord } from "@/data/models";
import { ModelCard } from "./model-card";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { RiskBadge } from "./risk-badge";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

type SortKey = "score-desc" | "score-asc" | "name";

const SORT_OPTIONS: Array<{ id: SortKey; label: string }> = [
  { id: "score-desc", label: "Security score (high → low)" },
  { id: "score-asc", label: "Security score (low → high)" },
  { id: "name", label: "Name (A → Z)" },
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

  return (
    <section className="space-y-10">
      <Card className="border-slate-200/70 bg-white/95 shadow-[0_42px_80px_rgba(15,23,42,0.08)] dark:border-slate-800/70 dark:bg-slate-950/60">
        <CardHeader className="gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-3xl tracking-tight">LLM security posture board</CardTitle>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300/80">
                Search and filter the Snowcrash catalogue to understand which foundation models meet your bar, where
                the red flags are, and how vendors are remediating critical advisories.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-center text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200">
              {filteredModels.length} models &middot;{" "}
              {activeFilters ? `${activeFilters} active filter${activeFilters > 1 ? "s" : ""}` : "no filters applied"}
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

      <Tabs defaultValue="catalogue" className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
          <TabsList>
            <TabsTrigger value="catalogue">Catalogue</TabsTrigger>
            <TabsTrigger value="benchmark">Benchmarks</TabsTrigger>
            <TabsTrigger value="signals">Signals</TabsTrigger>
          </TabsList>
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

        <TabsContent value="catalogue" className="border-none bg-transparent p-0">
          {filteredModels.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white/60 p-12 text-center text-sm text-slate-500 dark:border-slate-800/70 dark:bg-slate-950/40 dark:text-slate-400">
              No models match your current filters. Try adjusting search terms or clearing filters.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredModels.map((model) => (
                <ModelCard key={model.slug} model={model} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="benchmark" className="border-none bg-transparent p-0">
          <Card className="overflow-hidden border-slate-200/80 bg-white/95 dark:border-slate-800/70 dark:bg-slate-950/60">
            <CardHeader>
              <CardTitle className="text-xl">Security benchmarks</CardTitle>
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
        </TabsContent>

        <TabsContent value="signals" className="border-none bg-transparent p-0">
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
                      {issue.vector} &middot; {issue.discovered}
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
                  value={`${Math.round(
                    filteredModels.reduce((sum, model) => sum + model.securityScore, 0) /
                      Math.max(filteredModels.length, 1),
                  )}`}
                  hint="Weighted by mitigation status and last audit date."
                />
                <Insight
                  title="Unique attack vectors"
                  value={`${new Set(advisoryFeed.map((issue) => issue.vector)).size}`}
                  hint="Distinct exploitation paths observed across tracked models."
                />
                <Insight
                  title="Vendors monitored"
                  value={`${new Set(filteredModels.map((model) => model.provider)).size}`}
                  hint="Unique platform operators with live advisories."
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
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
