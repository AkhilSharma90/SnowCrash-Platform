import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getAllModelParams,
  getModelDerivedData,
} from "../model-helpers";
import {
  getModelSignalGrades,
  type ModelSignalGrade,
  type SignalGradeLetter,
} from "@/data/model-signals";

interface ModelSignalsPageProps {
  params: Promise<{ slug: string }>;
}

const GRADE_ORDER: SignalGradeLetter[] = ["A", "B", "C", "D", "E"];

const GRADE_STYLES: Record<SignalGradeLetter, string> = {
  A: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100",
  B: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-100",
  C: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-100",
  D: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-100",
  E: "bg-rose-200 text-rose-800 dark:bg-rose-500/30 dark:text-rose-50",
};

export function generateStaticParams() {
  return getAllModelParams();
}

export default async function ModelSignalsPage({ params }: ModelSignalsPageProps) {
  const { slug } = await params;
  const data = getModelDerivedData(slug);

  if (!data) {
    notFound();
  }

  const { model } = data;
  const signalGrades = getModelSignalGrades(model);
  const gradeDistribution = GRADE_ORDER.map((grade) => ({
    grade,
    count: signalGrades.filter((signal) => signal.grade === grade).length,
  }));
  const hotspots = [...signalGrades].sort((a, b) => a.score - b.score).slice(0, 4);
  const categories = groupByCategory(signalGrades);

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/70 bg-white/95 dark:border-slate-900/70 dark:bg-slate-950/60">
        <CardHeader>
          <CardTitle className="text-xl">Signal grading radar</CardTitle>
          <CardDescription>
            Behavioural grading for deception, selective censorship, asymmetric moral judgements, and emergent malicious intent for {model.name}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-5">
            {gradeDistribution.map(({ grade, count }) => (
              <div
                key={grade}
                className="rounded-2xl border border-slate-200/70 bg-slate-50/60 px-4 py-3 text-center shadow-sm dark:border-slate-900/60 dark:bg-slate-950/50"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
                  Grade {grade}
                </p>
                <p className="text-2xl font-semibold text-slate-900 dark:text-white">{count}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-900/70 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">
                Priority watchpoints
              </p>
              <Badge variant="soft" className="bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-100">
                {hotspots.length} elevated
              </Badge>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {hotspots.map((signal) => (
                <div
                  key={signal.id}
                  className="rounded-2xl border border-rose-100/70 bg-rose-50/60 p-4 text-sm text-rose-700 shadow-sm dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{signal.title}</p>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] ${GRADE_STYLES[signal.grade]}`}>
                      {signal.grade}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-rose-600 dark:text-rose-100/70">{signal.description}</p>
                  <p className="mt-2 text-xs font-medium text-rose-600 dark:text-rose-100/80">
                    Score {signal.score}/100 · Trend {signal.trend}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {Object.entries(categories).map(([category, signals]) => (
        <Card
          key={category}
          className="border-slate-200/70 bg-white/95 dark:border-slate-900/70 dark:bg-slate-950/60"
        >
          <CardHeader>
            <CardTitle className="text-lg">{category}</CardTitle>
            <CardDescription>
              {category === "Malicious Emergent Behaviour"
                ? "Focus on hidden intent leakage, sleeper-agent cues, and retaliatory planning."
                : `Detailed scoring for ${category.toLowerCase()}.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-56 text-left">Signal</TableHead>
                  <TableHead className="text-left">Dimension</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Grade</TableHead>
                  <TableHead className="text-left">Reliability</TableHead>
                  <TableHead className="text-left">Trend</TableHead>
                  <TableHead className="text-left">Observation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {signals.map((signal) => (
                  <TableRow key={signal.id}>
                    <TableCell className="align-top">
                      <p className="font-semibold text-slate-900 dark:text-white">{signal.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{signal.description}</p>
                    </TableCell>
                    <TableCell className="align-top text-slate-500 dark:text-slate-400">{signal.dimension}</TableCell>
                    <TableCell className="align-top text-right font-semibold text-slate-900 dark:text-white">
                      {signal.score}/100
                    </TableCell>
                    <TableCell className="align-top text-right">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] ${GRADE_STYLES[signal.grade]}`}
                      >
                        {signal.grade}
                      </span>
                    </TableCell>
                    <TableCell className="align-top text-xs text-slate-500 dark:text-slate-400">
                      {signal.reliability}
                    </TableCell>
                    <TableCell className="align-top text-xs capitalize text-slate-500 dark:text-slate-400">
                      {signal.trend}
                    </TableCell>
                    <TableCell className="align-top text-xs text-slate-500 dark:text-slate-400">{signal.note}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function groupByCategory(signals: ModelSignalGrade[]) {
  return signals.reduce<Record<string, ModelSignalGrade[]>>((acc, signal) => {
    if (!acc[signal.category]) {
      acc[signal.category] = [];
    }

    acc[signal.category].push(signal);
    return acc;
  }, {});
}
