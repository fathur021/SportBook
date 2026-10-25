import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SettingsSectionProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
  footer,
}: SettingsSectionProps) {
  return (
    <Card className="gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white py-0 shadow-sm ring-0">
      <CardHeader className="flex flex-row items-start gap-3 border-b border-slate-200 px-5 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
          <Icon className="h-4 w-4" />
        </div>
        <div className="space-y-0.5">
          <CardTitle className="text-sm font-semibold text-slate-900">
            {title}
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            {description}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-5 py-5">{children}</CardContent>

      {footer ? (
        <CardFooter className="border-t border-slate-200 bg-slate-50 px-5 py-3">
          {footer}
        </CardFooter>
      ) : null}
    </Card>
  );
}
