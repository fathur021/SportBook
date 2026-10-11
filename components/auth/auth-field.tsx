import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const authInputClass =
  "h-11 rounded-lg bg-slate-50 px-3.5 shadow-none transition hover:bg-slate-100 focus-visible:border-emerald-600 focus-visible:ring-3 focus-visible:ring-emerald-600/20 dark:bg-input/20 dark:hover:bg-input/30";

export const authCheckboxClass =
  "data-checked:border-emerald-600 data-checked:bg-emerald-600";

type AuthFieldProps = {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
};

export function AuthField({
  label,
  htmlFor,
  hint,
  error,
  className,
  children,
}: AuthFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p className="text-xs font-medium text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
