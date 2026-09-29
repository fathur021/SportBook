import Link from "next/link";
import {
  Activity,
  CircleDot,
  Goal,
  PersonStanding,
  Trophy,
  Volleyball,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/layout/container";
import type { SportCategory } from "@/lib/sports";
import { cn } from "@/lib/utils";

// Ikon dipetakan lewat slug, karena komponen ikon tidak bisa disimpan di database
const sportIcons: Record<string, LucideIcon> = {
  futsal: Goal,
  padel: CircleDot,
  badminton: PersonStanding,
  basketball: Trophy,
  volleyball: Volleyball,
  tennis: Activity,
};

type Props = {
  categories: SportCategory[];
};

export function SportCategories({ categories }: Props) {
  return (
    <section className="py-10">
      <Container>
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Disciplines
            </p>
            <h2 className="text-3xl font-bold tracking-tight">
              Popular Sports Categories
            </h2>
          </div>
          <p className="max-w-xs text-xs text-muted-foreground">
            Curated indoor &amp; outdoor facilities maintained to national
            competition standards.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => {
            const Icon = sportIcons[c.slug] ?? Trophy;

            return (
              <Link key={c.slug} href={`/courts?sport=${c.slug}`}>
                <Card className="h-full gap-0 py-0 transition hover:-translate-y-0.5 hover:shadow-md">
                  <CardContent className="flex flex-col gap-5 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-sky-100 text-emerald-700">
                        <Icon className="size-5" />
                      </div>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[10px]",
                          c.highlight && "bg-emerald-100 text-emerald-700"
                        )}
                      >
                        {c.tag}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-base font-semibold">{c.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {c.description}
                      </p>
                      <p className="pt-1 text-xs font-semibold text-emerald-700">
                        {c.venueCount} Venues available
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
