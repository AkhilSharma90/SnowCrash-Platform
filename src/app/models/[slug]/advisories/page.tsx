import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SEVERITY_COLORS, getModelDerivedData } from "../model-helpers";

interface ModelAdvisoriesPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ModelAdvisoriesPage({ params }: ModelAdvisoriesPageProps) {
  const { slug } = await params;
  const data = getModelDerivedData(slug);

  if (!data) {
    notFound();
  }

  const { sortedIssues } = data;

  return (
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
                  <li
                    key={action}
                    className="rounded-full border border-slate-200/70 bg-white px-3 py-1.5 text-[11px] text-slate-600 dark:border-slate-900 dark:bg-slate-950/60 dark:text-slate-300"
                  >
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
                      <a
                        href={reference.url}
                        className="text-slate-900 underline-offset-4 hover:underline dark:text-slate-100"
                      >
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
  );
}
