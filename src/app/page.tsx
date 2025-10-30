import type { Metadata } from "next";
import { ModelExplorer } from "@/components/model-explorer";
import { MODEL_DATA } from "@/data/models";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Snowcrash Trust Center · LLM Security Intelligence",
  description:
    "Explore live security posture, advisories, and compliance signals for leading foundation models in the Snowcrash Trust Center.",
};

export default function Home() {
  const totalModels = MODEL_DATA.length;
  const criticalIssues = MODEL_DATA.reduce(
    (count, model) => count + model.issues.filter((issue) => issue.severity === "critical").length,
    0,
  );
  const averageScore = Math.round(
    MODEL_DATA.reduce((sum, model) => sum + model.securityScore, 0) / Math.max(totalModels, 1),
  );
  const totalIssues = MODEL_DATA.reduce((sum, model) => sum + model.issues.length, 0);
  const portfolioCoverage = new Set(MODEL_DATA.flatMap((model) => model.compliance)).size;
  const topCriticalModel =
    MODEL_DATA.find((model) => model.riskLevel === "critical") ?? MODEL_DATA[0];
  const latestChange = MODEL_DATA.flatMap((model) =>
    model.changelog.map((entry) => ({
      ...entry,
      model: model.name,
      slug: model.slug,
    })),
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  return (
    <main className="space-y-16 py-12">
      <section className="relative overflow-hidden rounded-[40px] border border-slate-200 bg-white px-10 py-16 shadow-[0_60px_120px_rgba(15,23,42,0.12)] sm:px-16 dark:border-slate-900 dark:bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.14),transparent_65%)]" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/60 to-slate-100/80 dark:via-slate-950/30 dark:to-slate-950/60" aria-hidden />
        <div className="pointer-events-none absolute -right-28 top-10 h-56 w-56 rounded-full bg-indigo-100/60 blur-3xl dark:bg-indigo-500/20" aria-hidden />
        <div className="pointer-events-none absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-sky-100/50 blur-3xl dark:bg-sky-500/20" aria-hidden />
        <div className="relative grid gap-12 lg:grid-cols-[1.7fr_1fr]">
          <div className="space-y-8">
            <Badge variant="soft" className="bg-indigo-500/10 text-indigo-700 shadow-sm dark:bg-indigo-500/20 dark:text-indigo-200">
              Snowcrash Intelligence Brief
            </Badge>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                Security intelligence for frontier foundation models
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300/80">
                A single control room for live posture analytics, red-team notes, compliance signals, and vendor
                roadmaps. Compare providers, prioritise assurance, and brief stakeholders with evidence-backed insights.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" className="rounded-full px-6" asChild>
                <Link href="#models">Explore catalogue</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-slate-200 bg-white px-6 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200"
                asChild
              >
                <Link href="/models/gpt-4o" className="inline-flex items-center gap-2">
                  Latest advisory <span aria-hidden>→</span>
                </Link>
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              <HeroMetric label="Models tracked" value={totalModels.toString()} hint="Foundation and specialised releases under active monitoring." />
              <HeroMetric label="Active criticals" value={criticalIssues.toString()} hint="Open critical advisories across the catalogue." />
              <HeroMetric label="Average security score" value={`${averageScore}`} hint="Weighted across vendor audit recency and mitigations." />
            </div>
          </div>
          <Card className="border-slate-100/60 bg-white/70 backdrop-blur dark:border-slate-900/70 dark:bg-slate-950/60">
            <CardHeader className="space-y-4">
              <CardTitle className="text-xl text-slate-900 dark:text-white">Live portfolio highlights</CardTitle>
              <div className="space-y-2 rounded-2xl border border-rose-100/80 bg-rose-50/80 p-4 text-xs text-rose-700 shadow-sm dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-100">
                <p className="font-semibold uppercase tracking-[0.32em]">Highest risk</p>
                <p className="text-sm font-semibold">
                  {topCriticalModel.name} &middot; {topCriticalModel.provider}
                </p>
                <p>
                  {topCriticalModel.summary.slice(0, 140)}
                  {topCriticalModel.summary.length > 140 ? "…" : ""}
                </p>
                <Link href={`/models/${topCriticalModel.slug}`} className="mt-2 inline-flex items-center text-xs font-semibold text-rose-700 underline-offset-4 hover:underline dark:text-rose-100">
                  View mitigation plan →
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">
                  Assurance coverage
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{totalIssues}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Advisories tracked with remediation status.</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">
                  Compliance signals
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{portfolioCoverage}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Unique control frameworks with vendor attestations on file.
                </p>
              </div>
              {latestChange && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">
                      Latest movement
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{latestChange.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {latestChange.model} · {latestChange.date}
                    </p>
                    <Link href={`/models/${latestChange.slug}`} className="mt-2 inline-flex items-center text-xs font-semibold text-slate-900 underline-offset-4 hover:underline dark:text-slate-100">
                      Read update →
                    </Link>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <div id="models">
        <ModelExplorer />
      </div>
    </main>
  );
}

function HeroMetric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-[0_20px_45px_rgba(15,23,42,0.08)] dark:border-slate-900/70 dark:bg-slate-950/60">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{value}</p>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
    </div>
  );
}
