import { cloneElement, forwardRef, isValidElement } from "react";
import type { ButtonHTMLAttributes, ReactElement } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "secondary" | "outline" | "ghost" | "destructive";
type ButtonSize = "default" | "sm" | "lg" | "icon";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  default:
    "border border-slate-900 bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-900/60 dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200 dark:focus-visible:ring-slate-100/40",
  secondary:
    "border border-slate-200 bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-300/70 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-slate-700/60",
  outline:
    "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 focus-visible:ring-slate-300/60 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-200 dark:hover:bg-slate-900 dark:focus-visible:ring-slate-600/50",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-200/50 dark:text-slate-300 dark:hover:bg-slate-900/60 dark:focus-visible:ring-slate-700/50",
  destructive:
    "border border-rose-500 bg-rose-500 text-white hover:bg-rose-600 focus-visible:ring-rose-500/60 dark:border-rose-400 dark:bg-rose-500 dark:hover:bg-rose-600 dark:focus-visible:ring-rose-400/50",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  default: "h-10 px-4 py-2 text-sm",
  sm: "h-9 px-3 text-xs",
  lg: "h-11 px-6 text-base",
  icon: "h-10 w-10 px-0",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "default", size = "default", type = "button", asChild = false, children, ...restProps },
  ref,
) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-slate-950",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className,
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<Record<string, unknown>>;
    return cloneElement<Record<string, unknown>>(child, {
      ...(restProps as Record<string, unknown>),
      className: cn(classes, child.props.className as string | undefined),
    });
  }

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      {...restProps}
    >
      {children}
    </button>
  );
});
