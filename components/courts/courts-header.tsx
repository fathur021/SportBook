import Link from "next/link";
import { ChevronRight, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/layout/container";

export function CourtsHeader() {
  return (
    <section className="border-b">
      <Container className="py-5">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>

          <ChevronRight className="size-3" />

          <span className="text-foreground">
            Explore Sports Venues
          </span>
        </div>

        {/* Judul + Sort */}
        <div className="mt-4 flex items-start justify-between gap-4">

          {/* Judul dan deskripsi */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Courts & Venues
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Showing 42 verified venues ready for reservation in{" "}
              <span className="font-medium text-emerald-700">
                South Jakarta
              </span>
            </p>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Sort by:
            </span>

            <select className="h-9 rounded-md border bg-background px-3 text-xs font-medium outline-none">
              <option>Highest Rated (≥ 4.8)</option>
              <option>Lowest Price</option>
              <option>Highest Price</option>
              <option>Nearest</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        <div className="mt-5 flex flex-wrap items-center gap-2">

          <span className="mr-1 text-xs font-medium">
            ACTIVE:
          </span>

          <Badge
            variant="secondary"
            className="gap-1 rounded-full bg-blue-50 text-blue-700"
          >
            Padel
            <X className="size-3" />
          </Badge>

          <Badge
            variant="secondary"
            className="gap-1 rounded-full bg-blue-50 text-blue-700"
          >
            Today • Evening (17:00+)
            <X className="size-3" />
          </Badge>

          <Badge
            variant="secondary"
            className="gap-1 rounded-full bg-blue-50 text-blue-700"
          >
            South Jakarta
            <X className="size-3" />
          </Badge>

          <button
            type="button"
            className="ml-1 text-xs font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
          >
            Reset all filters
          </button>
        </div>

      </Container>
    </section>
  );
}