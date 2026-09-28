import { VenueCard } from "@/components/venue-card";
import { popularVenues } from "@/lib/venues";

export function PopularVenues() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Venues
          </p>
          <h2 className="text-3xl font-bold tracking-tight">
            Popular Venues Near You
          </h2>
        </div>
        <p className="max-w-xs text-xs text-muted-foreground">
          Handpicked facilities with live availability and instant booking
          confirmation.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {popularVenues.map((venue) => (
          <VenueCard key={venue.slug} venue={venue} />
        ))}
      </div>
    </section>
  );
}
