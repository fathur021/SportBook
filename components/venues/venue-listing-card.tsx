import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, ShieldCheck, Star, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { VenueListing } from "@/lib/listings";
import { formatRupiah } from "@/lib/format-rupiah";

export function VenueListingCard({ venue }: { venue: VenueListing }) {
  return (
    <Card className="flex flex-col gap-0 overflow-hidden py-0 md:flex-row">
      {/* Gambar */}
      <div className="relative h-56 w-full shrink-0 md:h-auto md:w-72">
        <Image
          src={venue.image}
          alt={venue.name}
          fill
          sizes="(max-width: 768px) 100vw, 288px"
          className="object-cover"
        />

        {/* Tag di pojok kiri atas gambar */}
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge className="bg-slate-900 text-white hover:bg-slate-900">
            {venue.sportTag}
          </Badge>
          <Badge className="gap-1 bg-emerald-700 text-white hover:bg-emerald-700">
            <ShieldCheck className="size-3" />
            {venue.verifiedTag}
          </Badge>
        </div>

        {/* Rating di pojok kiri bawah gambar */}
        <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-md bg-white/90 px-2 py-1 text-xs font-semibold backdrop-blur-sm">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          {venue.rating.toFixed(1)}
          <span className="font-normal text-muted-foreground">
            ({venue.reviewCount} reviews)
          </span>
        </div>
      </div>

      {/* Detail */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">{venue.name}</h3>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />
              {venue.address} • {venue.distanceKm} km
            </p>
          </div>
          <button
            type="button"
            aria-label="Save venue"
            className="shrink-0 text-slate-400 hover:text-rose-500"
          >
            <Heart className="size-5" />
          </button>
        </div>

        {/* Specs, dipisah titik seperti di desain */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-md bg-slate-50 px-3 py-2 text-xs">
          {venue.specs.map((spec, i) => (
            <span key={spec} className="flex items-center gap-2">
              {i > 0 && <span className="text-slate-300">•</span>}
              <span
                className={
                  i === venue.specs.length - 1
                    ? "font-medium text-emerald-700"
                    : "text-slate-600"
                }
              >
                {spec}
              </span>
            </span>
          ))}
        </div>

        {/* Fasilitas */}
        <div className="flex flex-wrap gap-1.5">
          {venue.facilities.map((f) => (
            <Badge key={f} variant="secondary" className="text-[10px] font-normal">
              {f}
            </Badge>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-3 border-t pt-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="flex items-center gap-1 text-xs font-medium text-emerald-700">
              <span className="size-1.5 rounded-full bg-emerald-600" />
              Next Available: {venue.nextAvailable}
            </p>
            <p className="text-sm">
              Starts at{" "}
              <span className="text-base font-bold">
                {formatRupiah(venue.pricePerHour)}
              </span>
              <span className="text-xs text-muted-foreground">/hr</span>
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              nativeButton={false}
              variant="outline"
              render={<Link href={`/venues/${venue.slug}`}>View Courts</Link>}
            />
            <Button
              nativeButton={false}
              className="bg-emerald-700 hover:bg-emerald-800"
              render={
                <Link href={`/venues/${venue.slug}/book`}>
                  <Zap className="size-4" />
                  Instant Book
                </Link>
              }
            />
          </div>
        </div>
      </div>
    </Card>
  );
}