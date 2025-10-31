import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About · Snowcrash Trust Center",
  description: "Learn about Snowcrash Security Research and how we support responsible AI adoption.",
};

export default function AboutPage() {
  return (
    <main className="space-y-12 py-12">
      <section className="space-y-5 rounded-[36px] border border-slate-200/70 bg-white px-8 py-10 shadow-[0_50px_110px_rgba(15,23,42,0.08)] dark:border-slate-900/70 dark:bg-slate-950/60">
        <Badge variant="soft" className="bg-slate-900/5 text-slate-700 dark:bg-white/10 dark:text-white">
          Snowcrash Security Research
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Shared intelligence for safer AI integration
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300/80">
          Snowcrash monitors frontier model ecosystems so that procurement, security, and risk teams can unlock AI
          without relaxing governance. The Trust Center curates live posture analytics, advisories, and compliance
          signals to accelerate due diligence and keep stakeholders briefed with evidence-backed insights.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="border-slate-200/70 bg-white/95 dark:border-slate-900/70 dark:bg-slate-950/60">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900 dark:text-white">What we do</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300/80">
            <p>
              We benchmark security controls, record advisories, and maintain remediation dossiers for leading foundation
              models. Teams rely on Snowcrash to understand vendor roadmaps, watch high-velocity incidents, and brief
              leadership before governance gaps turn into incidents.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Continuous catalogue scoring across frontier and specialised releases</li>
              <li>Independent verification of mitigations and control attestations</li>
              <li>Executive-ready narratives, benchmarking, and assurance evidence</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="border-slate-200/70 bg-white/95 dark:border-slate-900/70 dark:bg-slate-950/60">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900 dark:text-white">Talk with us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300/80">
            <p>
              Need deeper intelligence, coordinated disclosure support, or an executive briefing? Reach out and the
              Snowcrash team will connect you with the right researcher.
            </p>
            <div className="space-y-2">
              <Link href="mailto:trust@snowcrash.ai" className="block font-semibold text-slate-900 underline-offset-4 hover:underline dark:text-white">
                trust@snowcrash.ai
              </Link>
              <Link href="mailto:security@snowcrash.ai" className="block text-slate-500 underline-offset-4 hover:underline dark:text-slate-300">
                security@snowcrash.ai
              </Link>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              For bug bounty or urgent security matters, signal the triage desk within the Trust Center or email{" "}
              <Link href="mailto:security@snowcrash.ai" className="font-semibold underline-offset-4 hover:underline">
                security@snowcrash.ai
              </Link>
              {" "}directly.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
