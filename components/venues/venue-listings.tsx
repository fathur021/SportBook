import { VenueListingCard } from "@/components/venues/venue-listing-card";
import type { VenueListing } from "@/lib/listings";

export function VenueListings({ venues }: { venues: VenueListing[] }) {
  return (
    <div className="flex flex-col gap-4">
      {venues.map((venue) => (
        <VenueListingCard key={venue.slug} venue={venue} />
      ))}
    </div>
  );
}