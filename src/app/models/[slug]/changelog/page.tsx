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
import { getModelDerivedData } from "../model-helpers";

interface ModelChangelogPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ModelChangelogPage({ params }: ModelChangelogPageProps) {
  const { slug } = await params;
  const data = getModelDerivedData(slug);

  if (!data) {
    notFound();
  }

  const { model } = data;

  return (
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
              <TableRow
                key={`${entry.date}-${entry.title}`}
                className="border-b border-slate-100/70 last:border-0 dark:border-slate-900/60"
              >
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
  );
}
