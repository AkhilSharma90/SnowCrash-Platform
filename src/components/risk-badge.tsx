import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

type RiskLevel = "guarded" | "elevated" | "critical";

interface RiskBadgeProps {
  level: RiskLevel;
}

const RISK_STYLES: Record<RiskLevel, { className: string; label: string }> = {
  guarded: {
    className:
      "border border-transparent bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200",
    label: "Guarded",
  },
  elevated: {
    className:
      "border border-transparent bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-100",
    label: "Elevated",
  },
  critical: {
    className:
      "border border-transparent bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-100",
    label: "Critical",
  },
};

export function RiskBadge({ level }: RiskBadgeProps) {
  const styles = RISK_STYLES[level];

  return (
    <Badge variant="soft" className={cn("flex items-center gap-1 border-none text-[10px] uppercase", styles.className)}>
      <span
        className={cn(
          "inline-block h-2 w-2 rounded-full",
          level === "guarded" && "bg-emerald-500",
          level === "elevated" && "bg-amber-500",
          level === "critical" && "bg-rose-500",
        )}
      />
      {styles.label}
    </Badge>
  );
}
