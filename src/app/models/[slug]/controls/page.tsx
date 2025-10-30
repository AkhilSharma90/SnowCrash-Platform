import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getModelDerivedData } from "../model-helpers";

interface ModelControlsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ModelControlsPage({ params }: ModelControlsPageProps) {
  const { slug } = await params;
  const data = getModelDerivedData(slug);

  if (!data) {
    notFound();
  }

  const { model } = data;

  return (
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
  );
}
