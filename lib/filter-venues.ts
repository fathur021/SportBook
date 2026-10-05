import type { VenueListing } from "@/lib/listings";

export type SearchParams = {
  [key: string]: string | string[] | undefined;
};

const list = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v[0] : v)?.split(",").filter(Boolean) ?? [];

const one = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const includesAny = (value: string, keywords: string[]) => {
  const normalizedValue = normalize(value);
  return keywords.some((keyword) => normalizedValue.includes(normalize(keyword)));
};

const sportKeywords: Record<string, string[]> = {
  padel: ["padel"],
  badminton: ["badminton"],
  futsal: ["futsal"],
  tennis: ["tennis"],
  basketball: ["basketball"],
  volleyball: ["volleyball"],
};

const flooringKeywords: Record<string, string[]> = {
  "Taraflex / Vinyl": ["taraflex", "vinyl", "gerflor"],
  "Synthetic Turf": ["synthetic turf", "turf"],
  "Hard Court": ["hard court", "acrylic"],
  "Wood Parquet": ["wood", "wooden", "maple", "parquet"],
  "Interlock Polymer": ["interlock", "polymer"],
};

const amenityKeywords: Record<string, string[]> = {
  ac: ["ac", "air cooled", "air conditioned", "air circulation", "indoor"],
  showers: ["shower", "changing", "spa"],
  parking: ["parking", "valet"],
  rental: ["rental", "pro shop", "ball boy", "shoe rental"],
  canteen: ["cafe", "canteen", "hydration", "lounge", "kiosk", "bar", "beverage"],
};

const searchableVenueText = (venue: VenueListing) =>
  [
    venue.sportTag,
    venue.verifiedTag,
    venue.specs.join(" "),
    venue.facilities.join(" "),
  ].join(" ");

const timeSlotFromNextAvailable = (venue: VenueListing) => {
  const hour = Number(venue.nextAvailable.match(/\b(\d{1,2}):/)?.[1]);

  if (Number.isNaN(hour)) return [];
  if (hour < 12) return ["morning"];
  if (hour < 17) return ["afternoon"];
  return ["evening"];
};

export function filterVenues(venues: VenueListing[], sp: SearchParams) {
  const sports = list(sp.sport);
  const times = list(sp.time);
  const floors = list(sp.floor);
  const amenities = list(sp.amenity);
  const date = one(sp.date);
  const min = Number(one(sp.min) ?? 0);
  const max = Number(one(sp.max) ?? Infinity);
  const instant = one(sp.instant) === "1";

  return venues.filter((v) => {
    const venueText = searchableVenueText(v);

    if (instant && !v.nextAvailable) return false;
    if (sports.length && !sports.some((sport) => includesAny(v.sportTag, sportKeywords[sport] ?? [sport]))) {
      return false;
    }
    if (v.pricePerHour < min || v.pricePerHour > max) return false;
    if (date === "today" && !normalize(v.nextAvailable).startsWith("today")) {
      return false;
    }
    if (date === "tomorrow" && !normalize(v.nextAvailable).startsWith("tomorrow")) {
      return false;
    }
    if (floors.length && !floors.some((floor) => includesAny(venueText, flooringKeywords[floor] ?? [floor]))) {
      return false;
    }
    if (times.length && !times.some((time) => timeSlotFromNextAvailable(v).includes(time))) {
      return false;
    }
    if (amenities.length && !amenities.every((amenity) => includesAny(venueText, amenityKeywords[amenity] ?? [amenity])))
      return false;
    return true;
  });
}
