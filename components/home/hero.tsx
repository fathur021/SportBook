import Image from "next/image";
import { ArrowRight, BadgeCheck, EyeOff, MapPin, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CourtSearchForm } from "@/components/courts/court-search-form";

const trustItems = [
  { icon: BadgeCheck, label: "Verified Venues" },
  { icon: Zap, label: "Instant Confirmation" },
  { icon: EyeOff, label: "No Hidden Fees" },
];

export function Hero() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-col items-center gap-8 md:flex-row">
        <div className="flex flex-[3] flex-col items-start gap-6">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
            <span className="size-1.5 rounded-full bg-emerald-600" />
            Instant Court Confirmation Across 500+ Hubs
          </span>

          <h1 className="text-4xl font-bold tracking-tight">
            Find and book your favorite sports court in seconds
          </h1>
          <p className="text-sm tracking-tight text-muted-foreground">
            Instant access to 500+ premium futsal, padel, badminton, tennis, and
            basketball facilities across your city with live availability.
          </p>

          <div className="flex gap-2">
            <Button className="bg-emerald-700 hover:bg-emerald-800">
              Find a Court
              <ArrowRight className="size-4" />
            </Button>
            <Button variant="outline" className="bg-white">
              Explore Venues
            </Button>
          </div>

          {/* Trust items */}
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {trustItems.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 text-xs font-medium"
              >
                <Icon className="size-4 text-emerald-700" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Image card */}
        <div className="relative h-[220px] w-full flex-[2] md:h-[260px]">
          <Image
            src="/hero.webp"
            alt="Booking lapangan padel, badminton, futsal, tenis"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 40vw"
            className="rounded-2xl object-cover"
          />

          {/* Live chip */}
          <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold shadow-sm backdrop-blur-sm">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-600" />
            Live Facility Feed
          </span>

          {/* Venue card */}
          <div className="absolute inset-x-3 bottom-3 z-10 flex items-center justify-between gap-4 rounded-xl bg-white p-3 shadow-md">
            <div>
              <h3 className="text-sm font-semibold">Elite Padel & Sports Hub</h3>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" />
                Jakarta Selatan • 6 Courts Active
              </p>
            </div>
            <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800">
              Bookable
            </Button>
          </div>
        </div>
       
      </div>
      <div className="mt-10">
         <CourtSearchForm/>
      </div>
    </div>
  );
}