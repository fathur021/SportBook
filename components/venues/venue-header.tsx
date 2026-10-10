import { Clock, MapPin, Navigation, Share2 as Share, Heart, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VenueBreadcrumb } from "@/components/venues/venue-breadcrumb";
import type { VenueDetail } from "@/lib/venue-detail";

export function VenueHeader({ venue }: { venue: VenueDetail }) {
  //                          └───┬───┘
  //                    menerima kiriman dari page.tsx
  return (
    <div className="flex flex-col gap-3 py-4">
      <VenueBreadcrumb
        items={venue.breadcrumb.map((label, i) => ({
          label,
          href: i === 0 ? "/venues" : undefined,
        }))}
      />
      {/* venue.breadcrumb di sini diteruskan lagi ke komponen anak */}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{venue.name}</h1>
            <Badge className="gap-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
              <span className="size-1.5 rounded-full bg-emerald-600" />
              {venue.verifiedTag}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 font-medium text-foreground">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              {venue.rating.toFixed(1)}
              <span className="font-normal text-muted-foreground">
                ({venue.reviewCount} verified reviews)
              </span>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="size-4" />
              {venue.address}
            </span>
            <span className="flex items-center gap-1 text-emerald-700">
              <Clock className="size-4" />
              {venue.openingHoursToday}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <Button variant="outline" className="gap-1.5 bg-slate-50">
            <Share className="size-4" />
            Share
          </Button>
          <Button variant="outline" className="gap-1.5 bg-slate-50">
            <Heart className="size-4" />
            Save
          </Button>
          <Button className="gap-1.5 bg-emerald-700 hover:bg-emerald-800">
            <Navigation className="size-4" />
            Get Directions
          </Button>
        </div>
      </div>
    </div>
  );
}