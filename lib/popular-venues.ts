import type { FacilityKey, Venue } from "./listings";
import type { listPopularVenues } from "@/modules/venues/venue.service";

type PopularVenueRow = Awaited<ReturnType<typeof listPopularVenues>>[number];

const ALLOWED_FACILITIES: FacilityKey[] = [
  "ac-lounge",
  "showers",
  "pro-shop",
  "free-parking",
  "scoreboard",
  "canteen",
  "racket-stringing",
  "lockers",
  "ball-rental",
  "sound-system",
];

const allowedFacilities = new Set<string>(ALLOWED_FACILITIES);

export function toPopularVenues(venue: PopularVenueRow): Venue {
  const prices = venue.courts.map((court) => court.pricePerHour);
  const sports = [...new Set(venue.courts.map((court) => court.sport))];
  return {
    slug: venue.slug,
    name: venue.name,
    location: `${venue.address}, ${venue.city}`,
    image: venue.coverImage ?? "/hero.webp",
    tag: sports.length > 0 ? sports.join(" • ") : "Sports",
    rating: 0,
    reviewCount: 0,
    facilities: venue.facilities.filter(
      (facility): facility is FacilityKey => allowedFacilities.has(facility),
    ),
    pricePerHour: prices.length > 0 ? Math.min(...prices) : 0,
  };
}
