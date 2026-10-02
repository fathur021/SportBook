import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function VenueBreadcrumb({ items }: { items: string[] }) {
  //                               └───┬───┘
  //                         menerima kiriman dari VenueHeader
  return (
    <nav className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {items.map((item, i) => (
        <span key={item} className="flex items-center gap-1.5">
          {i === 0 ? (
            <Link href="/venues" className="text-emerald-700 hover:underline">
              {item}
            </Link>
          ) : (
            <span className={i === items.length - 1 ? "text-slate-500" : "text-emerald-700"}>
              {item}
            </span>
          )}
          {i < items.length - 1 && <ChevronRight className="size-3" />}
        </span>
      ))}
    </nav>
  );
}