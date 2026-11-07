// ---------------------------------------------------------------------------
// Penghubung antara data venue dari database dan bentuk VenueDetail
// yang dipakai halaman /venues/[slug] dan halaman booking.
// ---------------------------------------------------------------------------

import type {
  SportDiscipline,
  VenueAmenity,
  VenueDetail,
} from "@/lib/venue-detail";
import type { getPublicVenueBySlug } from "@/modules/venues/venue.service";

// Tipe satu venue hasil query getPublicVenueBySlug()
type PublicVenue = NonNullable<
  Awaited<ReturnType<typeof getPublicVenueBySlug>>
>;

// Jam operasional sementara, disamakan dengan aturan booking di server.
const OPEN_HOUR = 7;
const CLOSE_HOUR = 23;
const openHoursToday = `Open Today: ${String(OPEN_HOUR).padStart(2, "0")}:00 - ${String(CLOSE_HOUR).padStart(2, "0")}:00`;

// Pilih ikon kartu fasilitas berdasarkan nama fasilitasnya.
function facilityIcon(name: string): VenueAmenity["icon"] {
  const n = name.toLowerCase();
  if (n.includes("shower")) return "shower";
  if (n.includes("ac") || n.includes("lounge")) return "ac";
  if (n.includes("park")) return "parking";
  if (n.includes("cafe") || n.includes("canteen") || n.includes("bar"))
    return "cafe";
  if (n.includes("shop") || n.includes("rental")) return "shop";
  if (n.includes("video")) return "video";
  return "court";
}

export function toVenueDetail(venue: PublicVenue): VenueDetail {
  // 1. Harga termurah sebagai "mulai dari"
  const prices = venue.courts.map((court) => court.pricePerHour);
  const pricePerHour = prices.length > 0 ? Math.min(...prices) : 0;

  // 2. Kelompokkan lapangan per cabang olahraga -> disciplines
  const groups = new Map<string, PublicVenue["courts"]>();
  for (const court of venue.courts) {
    const existing = groups.get(court.sport);
    if (existing) existing.push(court);
    else groups.set(court.sport, [court]);
  }

  const disciplines: SportDiscipline[] = [...groups.entries()].map(
    ([sport, courts]) => ({
      slug: sport.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      label: `${sport} (${courts.length} Court${courts.length > 1 ? "s" : ""})`,
      courts: courts.map((court) => ({
        id: court.id, // id asli database, dipakai halaman booking
        label: court.name,
        image: court.image ?? undefined,
        badge: court.isIndoor ? "Indoor" : "Outdoor",
        specs: [court.surface, court.isIndoor ? "Indoor" : "Outdoor"].filter(
          (spec): spec is string => Boolean(spec),
        ),
        features: court.maxPlayers
          ? [`Maks. ${court.maxPlayers} pemain`]
          : [],
        maxPlayers: court.maxPlayers ?? undefined,
        pricePerHour: court.pricePerHour,
        isOperational: true, // query publik hanya mengambil lapangan aktif
      })),
    }),
  );

  // 3. Gambar: pakai coverImage, atau gambar cadangan kalau kosong
  const cover = venue.coverImage ?? "/hero.webp";

  // 4. Spesifikasi ringkas di bagian atas
  const surfaces = [
    ...new Set(
      venue.courts
        .map((court) => court.surface)
        .filter((surface): surface is string => surface !== null),
    ),
  ];
  const specs = [
    `${venue.courts.length} Courts`,
    ...surfaces,
    venue.courts.some((court) => court.isIndoor) ? "Indoor" : "Outdoor",
  ];

  // 5. Fasilitas menjadi kartu amenities
  const amenities: VenueAmenity[] = venue.facilities.map((name, index) => ({
    id: `facility-${index}`,
    title: name,
    description: "Fasilitas yang tersedia di venue ini",
    icon: facilityIcon(name),
  }));

  return {
    slug: venue.slug,
    name: venue.name,
    verifiedTag: venue.isVerified ? "Verified Venue" : "Partner Venue",
    breadcrumb: ["Venues", venue.city, venue.name],
    address: `${venue.address}, ${venue.city}`,

    // Belum ada di database, diisi sementara.
    rating: 0,
    reviewCount: 0,
    popularSlots: [],

    openingHoursToday: openHoursToday,
    totalPhotos: 1,
    images: [{ src: cover, title: venue.name }],
    description: venue.description ?? "",
    specs,
    stats: [
      { value: String(venue.courts.length), label: "Courts Total" },
      { value: String(disciplines.length), label: "Sports" },
      { value: pricePerHour.toLocaleString("id-ID"), label: "IDR / Hour" },
    ],
    facilities: venue.facilities,
    pricePerHour,
    disciplines,
    sessionDurations: ["1 Hour", "2 Hours"],
    facilityFeeNote: "FREE",
    conciergeName: `${venue.name} concierge`,
    amenities,
    operatingHoursBadge: undefined,
    operatingSchedules: [
      { days: "Mon - Thu", hours: "07:00 - 23:00", note: "Jam operasional" },
      { days: "Friday", hours: "07:00 - 23:00", note: "Jam operasional" },
      {
        days: "Saturday",
        hours: "07:00 - 23:00",
        note: "Jam operasional",
        isHighlighted: true,
      },
      { days: "Sunday", hours: "07:00 - 23:00", note: "Jam operasional" },
    ],
  };
}
