import type { Metadata } from "next";
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
  const referenceLogos = ["Northwind Capital", "Helios Airlines", "Vertex Health", "Arcadia Robotics", "Nimbus Bank"];

  return (
    <main className="space-y-16 py-12">
      <section className="relative overflow-hidden rounded-[44px] border border-slate-200 bg-white px-10 py-16 shadow-[0_70px_140px_rgba(15,23,42,0.16)] sm:px-16 dark:border-slate-900 dark:bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.2),transparent_65%)]" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-slate-100/70 to-slate-200/40 dark:from-slate-950/70 dark:via-slate-950/20 dark:to-slate-950/40" aria-hidden />
        <div className="pointer-events-none absolute -right-28 top-12 h-60 w-60 rounded-full bg-indigo-200/60 blur-3xl dark:bg-indigo-500/20" aria-hidden />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl dark:bg-sky-500/20" aria-hidden />
        <div className="relative grid gap-12 lg:grid-cols-[1.75fr_1fr]">
          <div className="space-y-8">
            <div className="inline-flex flex-wrap items-center gap-3 rounded-full border border-indigo-200/70 bg-indigo-50/60 px-4 py-2 text-xs font-semibold text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-200">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                Live telemetry sync in progress
              </span>
              <span className="hidden text-indigo-500 sm:inline dark:text-indigo-200/80">Next refresh in 12 minutes</span>
              <Link href="/signals" className="inline-flex items-center gap-1 text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-200">
                View signal feed →
              </Link>
            </div>
            <Badge variant="soft" className="bg-indigo-500/10 text-indigo-700 shadow-sm dark:bg-indigo-500/20 dark:text-indigo-200">
              Snowcrash Intelligence Brief
            </Badge>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                <span className="bg-gradient-to-r from-slate-900 via-indigo-700 to-sky-600 bg-clip-text text-transparent dark:from-indigo-200 dark:via-slate-100 dark:to-sky-300">
                  Security intelligence for frontier foundation models
                </span>
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300/80">
                Operate from a single control room for live posture analytics, red-team notes, compliance signals, and vendor roadmaps. Compare providers, prioritise assurance, and brief stakeholders with evidence-backed insights.
              </p>
            </div>
            <div className="grid gap-3 text-sm text-slate-600 dark:text-slate-300/80">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
                <span>Continuous scoring across {totalModels} frontier and specialised releases</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-sky-400" aria-hidden />
                <span>Advisory triage SLA inside 24 hours with verified mitigations</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-amber-400" aria-hidden />
                <span>Exec-ready board packs generated on-demand for critical movements</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                className="rounded-full border-transparent bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900 px-6 text-white shadow-[0_22px_55px_rgba(79,70,229,0.28)] transition hover:from-indigo-800 hover:via-slate-900 hover:to-indigo-700 dark:from-indigo-300 dark:via-slate-200 dark:to-sky-200 dark:text-slate-950"
                asChild
              >
                <Link href="/catalogue">Explore catalogue</Link>
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
              <Link
                href="/analytics"
                className="flex items-center gap-2 rounded-full border border-slate-200/70 px-4 py-2 text-sm font-semibold text-slate-600 underline-offset-4 hover:underline dark:border-slate-800/60 dark:text-slate-300"
              >
                Download board pack
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <HeroMetric label="Models tracked" value={totalModels.toString()} hint="Foundation and specialised releases under active monitoring." />
              <HeroMetric label="Active criticals" value={criticalIssues.toString()} hint="Open critical advisories across the catalogue." />
              <HeroMetric label="Average security score" value={`${averageScore}`} hint="Weighted across vendor audit recency and mitigations." />
              <HeroMetric label="Framework coverage" value={portfolioCoverage.toString()} hint="Unique assurance frameworks with live attestations." />
            </div>
          </div>
          <div className="space-y-5">
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
            <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-5 text-sm text-slate-600 shadow-[0_20px_40px_rgba(15,23,42,0.08)] dark:border-slate-900/70 dark:bg-slate-950/60 dark:text-slate-300/80">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">
                  Executive briefings
                </span>
                <Badge variant="soft" className="bg-indigo-500/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                  Concierge
                </Badge>
              </div>
              <p className="mt-3 text-sm">
                90-minute virtual briefing with Snowcrash research, tailored to your threat model, delivered within 48 hours.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                <Link href="mailto:briefings@snowcrash.ai" className="font-semibold text-slate-900 underline-offset-4 hover:underline dark:text-slate-100">
                  Book a session →
                </Link>
                <span className="text-slate-400 dark:text-slate-500">Includes curated posture dossier PDF</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="grid gap-6 rounded-[36px] border border-slate-200 bg-white/70 p-8 shadow-[0_40px_90px_rgba(15,23,42,0.08)] dark:border-slate-900/70 dark:bg-slate-950/60 md:grid-cols-3">
        <FeatureCard
          title="Assurance autopilot"
          description="Dynamic scoring engine that keeps procurement, security, and legal stakeholders aligned on current posture."
          bullets={[
            "Weighted security scoring refreshed on every telemetry sync",
            "Linked mitigations with evidence packages and owner assignments",
            "Shareable snapshots for procurement gates and go/no-go meetings",
          ]}
          accent="indigo"
        />
        <FeatureCard
          title="Incident playbooks"
          description="Codified workflow to triage new advisories, assign remediations, and document residual risk."
          bullets={[
            "Automated enrichment with exploit vector, blast radius, and SLA",
            "Task routing to engineering, governance, and vendor owners",
            "Lifecycle history retained for audit and model registry sign-off",
          ]}
          accent="emerald"
        />
        <FeatureCard
          title="Executive outputs"
          description="Ready-to-drop artefacts for boards, regulators, and customers without manual spreadsheet wrangling."
          bullets={[
            "Quarterly diligence packs with mitigation progress",
            "Custom benchmarking slideware for CISO and risk committees",
            "API hooks for GRC, SIEM, and vendor portals",
          ]}
          accent="rose"
        />
      </section>

      <section className="rounded-[36px] border border-slate-200 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 px-8 py-10 text-slate-100 shadow-[0_50px_110px_rgba(15,23,42,0.18)] dark:border-slate-800/70">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="soft" className="bg-white/10 text-slate-100">
            Trusted by risk-first teams
          </Badge>
          <span className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-300">Board-ready intelligence</span>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-200">
          High-assurance organisations across finance, aviation, healthcare, and robotics lean on Snowcrash to unlock frontier models while maintaining governance coverage.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {referenceLogos.map((name) => (
            <div
              key={name}
              className="flex h-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold uppercase tracking-[0.2em] text-slate-200"
            >
              {name}
            </div>
          ))}
        </div>
      </section>
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

function FeatureCard({
  title,
  description,
  bullets,
  accent,
}: {
  title: string;
  description: string;
  bullets: string[];
  accent: "indigo" | "emerald" | "rose";
}) {
  const accentClass =
    accent === "emerald" ? "bg-emerald-500" : accent === "rose" ? "bg-rose-500" : "bg-indigo-500";

  return (
    <Card className="h-full border-slate-200/70 bg-white/90 shadow-[0_28px_60px_rgba(15,23,42,0.08)] dark:border-slate-900/70 dark:bg-slate-950/60">
      <CardHeader className="space-y-3">
        <CardTitle className="text-lg text-slate-900 dark:text-white">{title}</CardTitle>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300/80">{description}</p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300/80">
          {bullets.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className={`mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full ${accentClass}`} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
