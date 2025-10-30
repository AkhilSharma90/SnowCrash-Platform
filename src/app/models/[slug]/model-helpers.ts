import { MODEL_DATA, getModelBySlug, type ModelRecord, type SeverityLevel } from "@/data/models";

export const SEVERITY_COLORS: Record<SeverityLevel, string> = {
  critical: "bg-rose-500/15 text-rose-700 dark:bg-rose-500/20 dark:text-rose-100",
  high: "bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-100",
  medium: "bg-sky-500/15 text-sky-700 dark:bg-sky-500/20 dark:text-sky-100",
  low: "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100",
  informational: "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-200",
};

export interface ModelDerivedData {
  model: ModelRecord;
  criticalIssues: number;
  openIssues: number;
  severityCounts: Record<SeverityLevel, number>;
  statusCounts: Record<"open" | "mitigated" | "monitoring", number>;
  sortedIssues: ModelRecord["issues"];
  uniqueVectors: string[];
}

export function getAllModelParams() {
  return MODEL_DATA.map((model) => ({ slug: model.slug }));
}

export function getModelDerivedData(slug: string): ModelDerivedData | null {
  const model = getModelBySlug(slug);

  if (!model) {
    return null;
  }

  const criticalIssues = model.issues.filter((issue) => issue.severity === "critical").length;
  const openIssues = model.issues.filter((issue) => issue.status !== "mitigated").length;
  const severityCounts = countBySeverity(model);
  const statusCounts = countByStatus(model);
  const sortedIssues = getSortedIssues(model);
  const uniqueVectors = getUniqueVectors(model);

  return {
    model,
    criticalIssues,
    openIssues,
    severityCounts,
    statusCounts,
    sortedIssues,
    uniqueVectors,
  };
}

export function countBySeverity(model: ModelRecord) {
  return model.issues.reduce<Record<SeverityLevel, number>>(
    (acc, issue) => {
      acc[issue.severity] += 1;
      return acc;
    },
    { critical: 0, high: 0, medium: 0, low: 0, informational: 0 },
  );
}

export function countByStatus(model: ModelRecord) {
  return model.issues.reduce<Record<"open" | "mitigated" | "monitoring", number>>(
    (acc, issue) => {
      acc[issue.status] += 1;
      return acc;
    },
    { open: 0, mitigated: 0, monitoring: 0 },
  );
}

export function getSortedIssues(model: ModelRecord) {
  return [...model.issues].sort((a, b) => new Date(b.discovered).getTime() - new Date(a.discovered).getTime());
}

export function getUniqueVectors(model: ModelRecord) {
  return Array.from(new Set(model.issues.map((issue) => issue.vector)));
}
