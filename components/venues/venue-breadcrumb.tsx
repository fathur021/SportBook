import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function VenueBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  //                               └───┬───┘
  //                         menerima kiriman dari VenueHeader
  return (
    <nav className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="flex items-center gap-1.5">
          {item.href ? (
            <Link href={item.href} className="text-emerald-700 hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className={i === items.length - 1 ? "text-slate-500" : "text-emerald-700"}>
              {item.label}
            </span>
          )}
          {i < items.length - 1 && <ChevronRight className="size-3" />}
        </span>
      ))}
    </nav>
  );
}
