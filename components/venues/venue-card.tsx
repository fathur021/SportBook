import Image from "next/image";
import Link from "next/link";
import {
  AirVent,
  Lock,
  MapPin,
  Package,
  ParkingCircle,
  ShowerHead,
  Speaker,
  Star,
  Store,
  Timer,
  Utensils,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatRupiah } from "@/lib/format-rupiah";
import type { FacilityKey, Venue } from "@/lib/listings";

const facilityMap: Record<FacilityKey, { label: string; icon: LucideIcon }> = {
  "ac-lounge": { label: "AC Lounge", icon: AirVent },
  showers: { label: "Showers", icon: ShowerHead },
  "pro-shop": { label: "Pro Shop", icon: Store },
  "free-parking": { label: "Free Parking", icon: ParkingCircle },
  scoreboard: { label: "Scoreboard", icon: Timer },
  canteen: { label: "Canteen", icon: Utensils },
  "racket-stringing": { label: "Racket Stringing", icon: Wrench },
  lockers: { label: "Lockers", icon: Lock },
  "ball-rental": { label: "Ball Rental", icon: Package },
  "sound-system": { label: "Sound System", icon: Speaker },
};

export function VenueCard({ venue }: { venue: Venue }) {
  return (
    <Card className="h-full gap-0 overflow-hidden py-0 transition hover:shadow-md">
      {/* Gambar + chip */}
      <div className="relative h-44 w-full">
        <Image
          src={venue.image}
          alt={venue.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />
        <span className="absolute left-2 top-2 rounded bg-white/90 px-2 py-0.5 text-[10px] font-semibold shadow-sm backdrop-blur-sm">
          {venue.tag}
        </span>
        <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded bg-white/90 px-2 py-0.5 text-[10px] font-semibold shadow-sm backdrop-blur-sm">
          <Star className="size-3 fill-amber-400 text-amber-400" />
          {venue.rating.toFixed(1)}
          <span className="font-normal text-muted-foreground">
            ({venue.reviewCount})
          </span>
        </span>
      </div>

      <CardContent className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-1">
          <h3 className="text-base font-semibold">{venue.name}</h3>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3.5" />
            {venue.location}
          </p>
        </div>

        {/* Fasilitas */}
        <div className="flex flex-wrap gap-1.5">
          {venue.facilities.map((key) => {
            const { label, icon: Icon } = facilityMap[key];
            return (
              <Badge
                key={key}
                variant="secondary"
                className="gap-1 text-[10px] font-normal"
              >
                <Icon className="size-3" />
                {label}
              </Badge>
            );
          })}
        </div>

        {/* Harga + tombol, mt-auto supaya selalu menempel di dasar kartu */}
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <p className="text-[10px] text-muted-foreground">Starts from</p>
            <p className="text-base font-bold">
              {formatRupiah(venue.pricePerHour)}
              <span className="text-xs font-normal text-muted-foreground">
                /hr
              </span>
            </p>
          </div>
          <Button
            nativeButton={false}
            render={<Link href={`/venues/${venue.slug}`}>Book Now</Link>}
            size="sm"
            className="bg-emerald-700 hover:bg-emerald-800"
          />
        </div>
      </CardContent>
    </Card>
  );
}
