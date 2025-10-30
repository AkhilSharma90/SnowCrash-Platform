import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "outline" | "soft";

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: "bg-slate-900 text-white hover:bg-slate-800",
  outline: "border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900",
  soft: "bg-slate-100 text-slate-700 hover:bg-slate-200",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] transition",
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    />
  );
}

