export type GalleryImage = {
  src: string;
  tag?: string; // badge kecil di pojok kiri atas foto, misal "Center Court 1 • WPT Spec"
  title?: string; // judul di pojok kiri bawah foto
  caption?: string; // subjudul di bawah title
};

export type SportDiscipline = {
  slug: string;
  label: string;
  courts: { id: string; label: string }[];
};
export type TimeSlotPrice = { time: string; spotsLeft?: number };
export type VenueStat = { value: string; label: string };

export type CourtOption = {
  id: string;
  name: string; // "Court 1 - Panoramic Glass"
  pricePerHour: number;
  slots: { time: string; booked?: boolean }[];
};

export type VenueDetail = {
  slug: string;
  name: string;
  verifiedTag: string;
  breadcrumb: string[];
  address: string;
  rating: number;
  reviewCount: number;
  openingHoursToday: string;
  totalPhotos: number;
  images: GalleryImage[];
  description: string;
  specs: string[];
  stats: VenueStat[];
  facilities: string[]; // label siap tampil, misal "Hot Shower" atau "AC Lounge"
  pricePerHour: number; // angka mentah, format saat ditampilkan
  disciplines: SportDiscipline[];
  sessionDurations: string[];
  popularSlots: TimeSlotPrice[];
  facilityFeeNote: string;
  conciergeName: string;
};

export const venueDetails: VenueDetail[] = [
  // ---------------------------------------------------------------------
  // 4 slug dari popularVenues (lib/venues.ts) — tombol "Book Now" di homepage
  // ---------------------------------------------------------------------
  {
    slug: "gelora-padel-club",
    name: "Gelora Padel & Sports Club",
    verifiedTag: "Verified Facility",
    breadcrumb: ["Venues", "Jakarta Selatan", "Padel & Futsal Club"],
    address: "Jl. Gandaria Tengah III No. 8, Kebayoran Baru, Jakarta Selatan",
    rating: 4.9,
    reviewCount: 184,
    openingHoursToday: "Open Today: 06:00 - 23:00",
    totalPhotos: 18,
    images: [
      {
        src: "/hero.webp",
        tag: "Center Court 1 • WPT Spec",
        title: "Main Tournament Arena",
        caption: "Panoramic glass, supercourt shock absorption pad",
      },
      { src: "/hero.webp", title: "Pro Shop & Rental" },
      { src: "/hero.webp", title: "Lounge & Healthy Bar" },
      { src: "/hero.webp", title: "Hot Showers & Lockers" },
    ],
    description:
      "Gelora Padel & Sports Club menawarkan lapangan panoramic glass court dengan Mondo Supercourt XN turf, dilengkapi AC indoor dan pencahayaan LED standar turnamen.",
    specs: [
      "4 Panoramic Courts",
      "Mondo Supercourt XN Turf",
      "Indoor AC Available",
    ],
    stats: [
      { value: "3+1", label: "Courts Total" },
      { value: "800 Lux", label: "LED Match Lights" },
      { value: "12 mm", label: "Tempered Glass" },
      { value: "17 hrs", label: "Daily Schedule" },
    ],
    facilities: ["AC Lounge", "Hot Shower", "Pro Shop"],
    pricePerHour: 180000,
    disciplines: [
      {
        slug: "padel",
        label: "Padel (3 Courts)",
        courts: [
          { id: "court-1", label: "Court 1 - Championship Glass" },
          { id: "court-2", label: "Court 2 - Panoramic Glass" },
          { id: "court-3", label: "Court 3 - Standard Padel (Value Court)" },
        ],
      },
      {
        slug: "futsal",
        label: "Futsal (1 Court)",
        courts: [{ id: "futsal-1", label: "Futsal Court - Taraflex" }],
      },
    ],
    sessionDurations: ["1 Hour", "1.5 Hours", "2 Hours"],
    popularSlots: [
      { time: "18:30" },
      { time: "20:00", spotsLeft: 3 },
      { time: "21:30" },
    ],
    facilityFeeNote: "FREE",
    conciergeName: "Gelora concierge",
  },
  {
    slug: "champion-futsal-arena",
    name: "Champion Futsal Arena",
    verifiedTag: "FIFA Certified",
    breadcrumb: ["Venues", "Jakarta Selatan", "Futsal Club"],
    address: "Jl. Hang Lekir IX No. 3, Kebayoran Baru, Jakarta Selatan",
    rating: 4.8,
    reviewCount: 310,
    openingHoursToday: "Open Today: 07:00 - 24:00",
    totalPhotos: 12,
    images: [
      {
        src: "/hero.webp",
        tag: "Pitch A • Standard 5v5",
        title: "Main Futsal Pitch",
        caption: "Gerflor Taraflex Vinyl 7.5mm, full air circulation exhaust",
      },
      { src: "/hero.webp", title: "Digital Lockers" },
      { src: "/hero.webp", title: "Hydration Lounge" },
      { src: "/hero.webp", title: "VAR Video Recording Room" },
    ],
    description:
      "Champion Futsal Arena menyediakan 3 pitch standar 5v5 dengan permukaan Gerflor Taraflex Vinyl, serta sistem sirkulasi udara penuh untuk kenyamanan bermain.",
    specs: [
      "3 Standard 5v5 Pitches",
      "Gerflor Taraflex Vinyl 7.5mm",
      "Full Air Circulation Exhaust",
    ],
    stats: [
      { value: "3", label: "Pitches Total" },
      { value: "7.5 mm", label: "Taraflex Vinyl" },
      { value: "Full", label: "Air Circulation" },
      { value: "17 hrs", label: "Daily Schedule" },
    ],
    facilities: ["Free Parking", "Scoreboard", "Canteen"],
    pricePerHour: 150000,
    disciplines: [
      {
        slug: "futsal",
        label: "Futsal (3 Pitches)",
        courts: [
          { id: "pitch-a", label: "Pitch A - Standard 5v5" },
          { id: "pitch-b", label: "Pitch B - Standard 5v5" },
          { id: "pitch-c", label: "Pitch C - Standard 5v5" },
        ],
      },
    ],
    sessionDurations: ["1 Hour", "1.5 Hours", "2 Hours"],
    popularSlots: [
      { time: "18:00" },
      { time: "19:00", spotsLeft: 2 },
      { time: "21:00" },
    ],
    facilityFeeNote: "FREE",
    conciergeName: "Champion concierge",
  },
  {
    slug: "smashzone-badminton-hub",
    name: "SmashZone Badminton Hub",
    verifiedTag: "BWF Standard Turf",
    breadcrumb: ["Venues", "Tangerang", "Badminton Club"],
    address: "BSD City, Tangerang",
    rating: 4.9,
    reviewCount: 95,
    openingHoursToday: "Open Today: 06:00 - 22:00",
    totalPhotos: 10,
    images: [
      {
        src: "/hero.webp",
        tag: "Court 5 • Tournament Grade",
        title: "Main Badminton Hall",
        caption: "Anti-glare shadowless lighting, BWF standard flooring",
      },
      { src: "/hero.webp", title: "Racket Stringing Corner" },
      { src: "/hero.webp", title: "Digital Lockers" },
    ],
    description:
      "SmashZone Badminton Hub outlawed 8 lapangan badminton dengan lantai standar BWF dan lampu anti-silau, plus layanan stringing racket on-site.",
    specs: [
      "8 Championship Courts",
      "BWF Standard Flooring",
      "Anti-Glare Lighting",
    ],
    stats: [
      { value: "8", label: "Courts Total" },
      { value: "BWF", label: "Standard Flooring" },
      { value: "Anti-Glare", label: "Lighting System" },
      { value: "16 hrs", label: "Daily Schedule" },
    ],
    facilities: ["Racket Stringing", "Digital Lockers"],
    pricePerHour: 65000,
    disciplines: [
      {
        slug: "badminton",
        label: "Badminton (8 Courts)",
        courts: [
          { id: "court-1", label: "Court 1 - Tournament Grade" },
          { id: "court-5", label: "Court 5 - Tournament Grade" },
          { id: "court-8", label: "Court 8 - Standard" },
        ],
      },
    ],
    sessionDurations: ["1 Hour", "1.5 Hours", "2 Hours"],
    popularSlots: [
      { time: "17:00" },
      { time: "18:00", spotsLeft: 4 },
      { time: "19:00" },
    ],
    facilityFeeNote: "FREE",
    conciergeName: "SmashZone concierge",
  },
  {
    slug: "apex-basketball-center",
    name: "Apex Basketball Center",
    verifiedTag: "FIBA Standard Maple",
    breadcrumb: ["Venues", "Jakarta Pusat", "Basketball Arena"],
    address: "Senayan, Jakarta",
    rating: 4.7,
    reviewCount: 142,
    openingHoursToday: "Open Today: 08:00 - 23:00",
    totalPhotos: 9,
    images: [
      {
        src: "/hero.webp",
        tag: "Court 1 • FIBA Size",
        title: "Main Hardwood Court",
        caption: "Maple hardwood 28x15m, full LED scoreboard",
      },
      { src: "/hero.webp", title: "Player Lounge" },
      { src: "/hero.webp", title: "Ball Rental Counter" },
    ],
    description:
      "Apex Basketball Center punya 2 lapangan full-size dengan lantai maple 28x15 meter sesuai standar FIBA, dilengkapi sound system dan tribun penonton.",
    specs: [
      "2 Full-Size Courts",
      "FIBA 28x15 Maple Floor",
      "Pro LED Scoreboard",
    ],
    stats: [
      { value: "2", label: "Full-Size Courts" },
      { value: "28x15 m", label: "Maple Floor" },
      { value: "Pro LED", label: "Scoreboard" },
      { value: "15 hrs", label: "Daily Schedule" },
    ],
    facilities: ["Ball Rental", "Sound System"],
    pricePerHour: 250000,
    disciplines: [
      {
        slug: "basketball",
        label: "Basketball (2 Courts)",
        courts: [
          { id: "court-1", label: "Court 1 - Full-Size" },
          { id: "court-2", label: "Court 2 - Full-Size" },
        ],
      },
    ],
    sessionDurations: ["1 Hour", "1.5 Hours", "2 Hours"],
    popularSlots: [
      { time: "19:00" },
      { time: "20:00", spotsLeft: 1 },
      { time: "21:00" },
    ],
    facilityFeeNote: "Rp 25.000",
    conciergeName: "Apex concierge",
  },

  // ---------------------------------------------------------------------
  // 12 slug dari venueListings (lib/listings.ts) — "View Courts" di explore
  // ---------------------------------------------------------------------
  {
    slug: "smash-padel-club-kemang",
    name: "Smash Padel Club Kemang",
    verifiedTag: "Verified Hub",
    breadcrumb: ["Venues", "Jakarta Selatan", "Padel"],
    address: "Jl. Kemang Timur No. 48, Bangka, Mampang Prapatan",
    rating: 4.9,
    reviewCount: 218,
    openingHoursToday: "Open Today: 06:30 - 23:30",
    totalPhotos: 15,
    images: [
      {
        src: "/hero.webp",
        tag: "Court 1 • Panoramic Glass",
        title: "Main Club Arena",
        caption: "Mondo Supercourt XN turf, indoor AC throughout",
      },
      { src: "/hero.webp", title: "Wilson Pro Rental" },
      { src: "/hero.webp", title: "Specialty Cafe" },
      { src: "/hero.webp", title: "Hot Shower Room" },
    ],
    description:
      "Smash Padel Club Kemang punya 4 lapangan padel dengan panoramic glass dan AC indoor di setiap lapangan. Fasilitas lengkapnya meliputi rental raket Wilson Pro, specialty cafe, dan free valet.",
    specs: [
      "4 Panoramic Courts",
      "Mondo Supercourt XN Turf",
      "Indoor AC Available",
    ],
    stats: [
      { value: "4", label: "Panoramic Courts" },
      { value: "Mondo XN", label: "Supercourt Turf" },
      { value: "Indoor", label: "AC Available" },
      { value: "17 hrs", label: "Daily Schedule" },
    ],
    facilities: [
      "Hot Shower",
      "Specialty Cafe",
      "Free Valet",
      "Wilson Pro Rental",
    ],
    pricePerHour: 260000,
    disciplines: [
      {
        slug: "padel",
        label: "Padel (4 Courts)",
        courts: [
          { id: "court-1", label: "Court 1 - Panoramic Glass" },
          { id: "court-2", label: "Court 2 - Panoramic Glass" },
          { id: "court-3", label: "Court 3 - Panoramic Glass" },
          { id: "court-4", label: "Court 4 - Value Court" },
        ],
      },
    ],
    sessionDurations: ["1 Hour", "1.5 Hours", "2 Hours"],
    popularSlots: [
      { time: "18:00" },
      { time: "19:00", spotsLeft: 2 },
      { time: "20:30" },
    ],
    facilityFeeNote: "FREE",
    conciergeName: "Smash Padel concierge",
  },
  {
    slug: "gelora-arena-hang-lekir",
    name: "Gelora Arena Hang Lekir",
    verifiedTag: "FIFA Certified",
    breadcrumb: ["Venues", "Jakarta Selatan", "Futsal"],
    address: "Jl. Hang Lekir IX No. 3, Kebayoran Baru, Jakarta Selatan",
    rating: 4.8,
    reviewCount: 340,
    openingHoursToday: "Open Today: 07:00 - 24:00",
    totalPhotos: 14,
    images: [
      {
        src: "/hero.webp",
        tag: "Pitch A • Standard 5v5",
        title: "Main Futsal Pitch",
        caption: "Gerflor Taraflex Vinyl 7.5mm, full air circulation",
      },
      { src: "/hero.webp", title: "VAR Video Recording" },
      { src: "/hero.webp", title: "Digital Lockers" },
      { src: "/hero.webp", title: "Hydration Lounge" },
    ],
    description:
      "Gelora Arena Hang Lekir menyediakan 3 pitch futsal standar 5v5 dengan permukaan Gerflor Taraflex Vinyl 7.5mm, dilengkapi 12 bilik hot shower dan ruang rekam VAR.",
    specs: [
      "3 Standard 5v5 Pitches",
      "Gerflor Taraflex Vinyl 7.5mm",
      "Full Air Circulation Exhaust",
    ],
    stats: [
      { value: "3", label: "Pitches Total" },
      { value: "7.5 mm", label: "Taraflex Vinyl" },
      { value: "12", label: "Shower Stalls" },
      { value: "17 hrs", label: "Daily Schedule" },
    ],
    facilities: [
      "Digital Lockers",
      "Hot Shower (12 stalls)",
      "Hydration Lounge",
      "VAR Video Recording",
    ],
    pricePerHour: 175000,
    disciplines: [
      {
        slug: "futsal",
        label: "Futsal (3 Pitches)",
        courts: [
          { id: "pitch-a", label: "Pitch A - Standard 5v5" },
          { id: "pitch-b", label: "Pitch B - Standard 5v5" },
          { id: "pitch-c", label: "Pitch C - Standard 5v5" },
        ],
      },
    ],
    sessionDurations: ["1 Hour", "1.5 Hours", "2 Hours"],
    popularSlots: [
      { time: "18:00" },
      { time: "19:00", spotsLeft: 3 },
      { time: "20:00" },
    ],
    facilityFeeNote: "FREE",
    conciergeName: "Gelora Arena concierge",
  },
  {
    slug: "padel-arena-pik",
    name: "Padel Arena PIK",
    verifiedTag: "Verified Hub",
    breadcrumb: ["Venues", "Jakarta Utara", "Padel"],
    address: "Jl. Rayacourses No. 2, Pantai Indah Kapuk, Kelapa Gading",
    rating: 4.7,
    reviewCount: 142,
    openingHoursToday: "Open Today: 06:00 - 22:00",
    totalPhotos: 13,
    images: [
      {
        src: "/hero.webp",
        tag: "Court 4 • Covered",
        title: "Covered Court Block",
        caption: "LED floodlights, panoramic glass backdrop",
      },
      { src: "/hero.webp", title: "Cafe & Juice Bar" },
      { src: "/hero.webp", title: "Changing Room" },
    ],
    description:
      "Padel Arena PIK punya 6 lapangan padel beratap dengan lampu LED floodlight dan panoramic glass backdrop, cocok untuk latihan rutin maupun tournament pada sesi malam.",
    specs: ["6 Covered Courts", "LED Floodlights", "Panoramic Glass Backdrop"],
    stats: [
      { value: "6", label: "Covered Courts" },
      { value: "LED", label: "Floodlights" },
      { value: "Panoramic", label: "Glass Backdrop" },
      { value: "16 hrs", label: "Daily Schedule" },
    ],
    facilities: [
      "Free Valet",
      "Cafe & Juice Bar",
      "Racket Rental",
      "Changing Room",
    ],
    pricePerHour: 285000,
    disciplines: [
      {
        slug: "padel",
        label: "Padel (6 Courts)",
        courts: [
          { id: "court-1", label: "Court 1 - Covered" },
          { id: "court-4", label: "Court 4 - Covered" },
          { id: "court-6", label: "Court 6 - Covered" },
        ],
      },
    ],
    sessionDurations: ["1 Hour", "1.5 Hours", "2 Hours"],
    popularSlots: [
      { time: "17:30" },
      { time: "19:00", spotsLeft: 2 },
      { time: "20:30" },
    ],
    facilityFeeNote: "FREE",
    conciergeName: "Padel Arena concierge",
  },
  {
    slug: "smash-badminton-hub-kemang",
    name: "Smash Badminton Hub Kemang",
    verifiedTag: "BWF Standard Turf",
    breadcrumb: ["Venues", "Jakarta Selatan", "Badminton"],
    address: "Jl. Kemang Raya No. 12, Jakarta Selatan",
    rating: 4.8,
    reviewCount: 264,
    openingHoursToday: "Open Today: 06:00 - 23:00",
    totalPhotos: 11,
    images: [
      {
        src: "/hero.webp",
        tag: "Court 6 • Air-Cooled",
        title: "Air-Cooled Court Wing",
        caption: "Tiger Turf Pro Series, air-cooled throughout",
      },
      { src: "/hero.webp", title: "Pro Shop" },
      { src: "/hero.webp", title: "Canteen" },
    ],
    description:
      "Smash Badminton Hub Kemang punya 8 lapangan dengan Tiger Turf Pro Series dan opsi lantai kayu untuk klub. Fasilitasnya meliputi pro shop, kantin, dan free parking 60 slot.",
    specs: [
      "8 Air-Cooled Courts",
      "Tiger Turf Pro Series",
      "Wooden Floor Option",
    ],
    stats: [
      { value: "8", label: "Air-Cooled Courts" },
      { value: "Tiger Turf", label: "Pro Series" },
      { value: "60", label: "Parking Slots" },
      { value: "17 hrs", label: "Daily Schedule" },
    ],
    facilities: [
      "Pro Shop",
      "Free Parking (60 slots)",
      "Canteen",
      "Hot Shower",
    ],
    pricePerHour: 95000,
    disciplines: [
      {
        slug: "badminton",
        label: "Badminton (8 Courts)",
        courts: [
          { id: "court-3", label: "Court 3 - Wooden Floor" },
          { id: "court-6", label: "Court 6 - Air-Cooled" },
          { id: "court-7", label: "Court 7 - Air-Cooled" },
        ],
      },
    ],
    sessionDurations: ["1 Hour", "1.5 Hours", "2 Hours"],
    popularSlots: [
      { time: "17:00" },
      { time: "18:30", spotsLeft: 3 },
      { time: "20:00" },
    ],
    facilityFeeNote: "FREE",
    conciergeName: "Smash Badminton concierge",
  },
  {
    slug: "hoop-nusantara-basket-center",
    name: "Hoop Nusantara Basket Center",
    verifiedTag: "FIBA Standard Maple",
    breadcrumb: ["Venues", "Jakarta Pusat", "Basketball"],
    address: "Jl. Pintu Satu Senayan No. 3, Tanah Abang, Jakarta Pusat",
    rating: 4.9,
    reviewCount: 187,
    openingHoursToday: "Open Today: 08:00 - 23:00",
    totalPhotos: 10,
    images: [
      {
        src: "/hero.webp",
        tag: "Court A • Full-Size",
        title: "Main Hardwood Court",
        caption: "FIBA 28x15 maple floor, pro LED scoreboard",
      },
      { src: "/hero.webp", title: "Streaming Station" },
      { src: "/hero.webp", title: "Player Cafe" },
    ],
    description:
      "Hoop Nusantara Basket Center menyediakan 2 lapangan full-size 28x15 meter dengan lantai maple standar FIBA, dilengkapi streaming station untuk komunikasi dan digital lockers.",
    specs: [
      "2 Full-Size Courts",
      "FIBA 28x15 Maple Floor",
      "Pro LED Scoreboard",
    ],
    stats: [
      { value: "2", label: "Full-Size Courts" },
      { value: "28x15 m", label: "Maple Floor" },
      { value: "Pro LED", label: "Scoreboard" },
      { value: "15 hrs", label: "Daily Schedule" },
    ],
    facilities: ["Streaming Station", "Digital Lockers", "Cafe", "Free Valet"],
    pricePerHour: 320000,
    disciplines: [
      {
        slug: "basketball",
        label: "Basketball (2 Courts)",
        courts: [
          { id: "court-a", label: "Court A - Full-Size" },
          { id: "court-b", label: "Court B - Full-Size" },
        ],
      },
    ],
    sessionDurations: ["1 Hour", "1.5 Hours", "2 Hours"],
    popularSlots: [
      { time: "19:00" },
      { time: "20:00", spotsLeft: 2 },
      { time: "21:00" },
    ],
    facilityFeeNote: "Rp 30.000",
    conciergeName: "Hoop Nusantara concierge",
  },
  {
    slug: "smash-court-tennis-cipedak",
    name: "Smash Court Tennis Cipedak",
    verifiedTag: "ITF Pro Clay",
    breadcrumb: ["Venues", "Jakarta Selatan", "Tennis"],
    address: "Jl. Raya Cipedak No. 55, Cipedak, Jakarta Selatan",
    rating: 4.6,
    reviewCount: 96,
    openingHoursToday: "Open Today: 06:00 - 22:00",
    totalPhotos: 8,
    images: [
      {
        src: "/hero.webp",
        tag: "Court 2 • Clay Surface",
        title: "Clay Court Block",
        caption: "ITF certified acrylic topcoat over clay base",
      },
      { src: "/hero.webp", title: "Bench Seating" },
      { src: "/hero.webp", title: "Drinks Kiosk" },
    ],
    description:
      "Smash Court Tennis Cipedak punya 3 lapangan clay dengan acrylic topcoat bersertifikat ITF dan night lighting, plus ball boy service di sesi sore.",
    specs: ["3 Clay Courts", "ITF Certified Acrylic Topcoat", "Night Lighting"],
    stats: [
      { value: "3", label: "Clay Courts" },
      { value: "ITF", label: "Certified Topcoat" },
      { value: "Night", label: "Lighting" },
      { value: "16 hrs", label: "Daily Schedule" },
    ],
    facilities: [
      "Ball Boy Service",
      "Bench Seating",
      "Drinks Kiosk",
      "Racket Rental",
    ],
    pricePerHour: 180000,
    disciplines: [
      {
        slug: "tennis",
        label: "Tennis (3 Courts)",
        courts: [
          { id: "court-1", label: "Court 1 - Clay" },
          { id: "court-2", label: "Court 2 - Clay" },
          { id: "court-3", label: "Court 3 - Clay" },
        ],
      },
    ],
    sessionDurations: ["1 Hour", "1.5 Hours", "2 Hours"],
    popularSlots: [
      { time: "16:00" },
      { time: "17:30", spotsLeft: 1 },
      { time: "19:00" },
    ],
    facilityFeeNote: "FREE",
    conciergeName: "Smash Court concierge",
  },
  {
    slug: "volley-arena-scbd",
    name: "Volley Arena SCBD",
    verifiedTag: "FIVB Indoor",
    breadcrumb: ["Venues", "Jakarta Selatan", "Volleyball"],
    address: "Jl. Surya Sumantri No. 11, SCBD, Jakarta Selatan",
    rating: 4.7,
    reviewCount: 121,
    openingHoursToday: "Open Today: 07:00 - 22:00",
    totalPhotos: 9,
    images: [
      {
        src: "/hero.webp",
        tag: "Court 1 • Indoor",
        title: "Indoor Volleyball Court",
        caption: "FIVB air pressure flooring, telescopic referee stand",
      },
      { src: "/hero.webp", title: "Hydration Bar" },
      { src: "/hero.webp", title: "Team Photo Booth" },
    ],
    description:
      "Volley Arena SCBD menyediakan 2 lapangan voli indoor dengan FIVB air pressure flooring dan telescopic referee stand, plus digital lockers dan hydration bar.",
    specs: [
      "2 Indoor Courts",
      "FIVB Air Pressure Flooring",
      "Telescopic Referee Stand",
    ],
    stats: [
      { value: "2", label: "Indoor Courts" },
      { value: "FIVB", label: "Air Pressure Floor" },
      { value: "Telescopic", label: "Referee Stand" },
      { value: "15 hrs", label: "Daily Schedule" },
    ],
    facilities: [
      "Hydration Bar",
      "Digital Lockers",
      "Hot Shower",
      "Team Photo Booth",
    ],
    pricePerHour: 210000,
    disciplines: [
      {
        slug: "volleyball",
        label: "Volleyball (2 Courts)",
        courts: [
          { id: "court-1", label: "Court 1 - Indoor" },
          { id: "court-2", label: "Court 2 - Indoor" },
        ],
      },
    ],
    sessionDurations: ["1 Hour", "1.5 Hours", "2 Hours"],
    popularSlots: [
      { time: "18:00" },
      { time: "19:00", spotsLeft: 2 },
      { time: "20:00" },
    ],
    facilityFeeNote: "FREE",
    conciergeName: "Volley Arena concierge",
  },
  {
    slug: "smash-tt-lounge-sudirman",
    name: "Smash TT Lounge Sudirman",
    verifiedTag: "ITTF Pro Table",
    breadcrumb: ["Venues", "Jakarta Pusat", "Table Tennis"],
    address: "Jl. Jend. Sudirman Kav. 52-53, Jakarta Pusat",
    rating: 4.5,
    reviewCount: 78,
    openingHoursToday: "Open Today: 10:00 - 23:00",
    totalPhotos: 7,
    images: [
      {
        src: "/hero.webp",
        tag: "Table 7 • ITTF Spec",
        title: "Main Lounge Floor",
        caption: "ITTF 25mm tabletop, acoustic partition per zone",
      },
      { src: "/hero.webp", title: "Coaching Corner" },
    ],
    description:
      "Smash TT Lounge Sudirman punya 12 meja tenis meja standar ITTF dengan acoustic partition antar zona, serta coaching dari player profesional.",
    specs: ["12 Tables", "ITTF 25mm Tabletop", "Acoustic Partition"],
    stats: [
      { value: "12", label: "Tables Total" },
      { value: "25 mm", label: "ITTF Tabletop" },
      { value: "Acoustic", label: "Partition" },
      { value: "13 hrs", label: "Daily Schedule" },
    ],
    facilities: [
      "Coaching Available",
      "Free Parking",
      "Air Conditioned",
      "Beverage Menu",
    ],
    pricePerHour: 65000,
    disciplines: [
      {
        slug: "table-tennis",
        label: "Table Tennis (12 Tables)",
        courts: [
          { id: "table-3", label: "Table 3 - ITTF Spec" },
          { id: "table-7", label: "Table 7 - ITTF Spec" },
        ],
      },
    ],
    sessionDurations: ["1 Hour", "1.5 Hours", "2 Hours"],
    popularSlots: [
      { time: "16:00" },
      { time: "17:00", spotsLeft: 4 },
      { time: "18:00" },
    ],
    facilityFeeNote: "FREE",
    conciergeName: "Smash TT concierge",
  },
  {
    slug: "squash-junction-scbd",
    name: "Squash Junction SCBD",
    verifiedTag: "Pro Glass Box",
    breadcrumb: ["Venues", "Jakarta Selatan", "Squash"],
    address: "Jl. Mayjen Sutoyo No. 8, SCBD, Jakarta Selatan",
    rating: 4.8,
    reviewCount: 134,
    openingHoursToday: "Open Today: 06:00 - 22:00",
    totalPhotos: 8,
    images: [
      {
        src: "/hero.webp",
        tag: "Court 2 • Glass Box",
        title: "Pro Glass Court",
        caption: "Pro kill point flooring, kinetic wall system",
      },
      { src: "/hero.webp", title: "Spa & Shower" },
      { src: "/hero.webp", title: "Health Bar" },
    ],
    description:
      "Squash Junction SCBD menyediakan 2 squash court pro glass dengan pro kill point flooring dan kinetic wall system, dilengkapi shoe rental dan health bar.",
    specs: [
      "2 Pro Glass Courts",
      "Pro Kill Point Flooring",
      "Kinetic Wall System",
    ],
    stats: [
      { value: "2", label: "Pro Glass Courts" },
      { value: "Kill Point", label: "Flooring" },
      { value: "Kinetic", label: "Wall System" },
      { value: "16 hrs", label: "Daily Schedule" },
    ],
    facilities: ["Shoe Rental", "Spa & Shower", "Smart Locker", "Health Bar"],
    pricePerHour: 145000,
    disciplines: [
      {
        slug: "squash",
        label: "Squash (2 Courts)",
        courts: [
          { id: "court-1", label: "Court 1 - Glass Box" },
          { id: "court-2", label: "Court 2 - Glass Box" },
        ],
      },
    ],
    sessionDurations: ["1 Hour", "1.5 Hours", "2 Hours"],
    popularSlots: [
      { time: "17:00" },
      { time: "18:00", spotsLeft: 1 },
      { time: "19:00" },
    ],
    facilityFeeNote: "Rp 20.000",
    conciergeName: "Squash Junction concierge",
  },
  {
    slug: "futsal-kingdom-kelapa-gading",
    name: "Futsal Kingdom Kelapa Gading",
    verifiedTag: "FIFA Quality Turf",
    breadcrumb: ["Venues", "Jakarta Utara", "Futsal"],
    address: "Jl. Boulevard Raya Blok QJ 1 No. 22, Kelapa Gading",
    rating: 4.6,
    reviewCount: 203,
    openingHoursToday: "Open Today: 07:00 - 23:00",
    totalPhotos: 12,
    images: [
      {
        src: "/hero.webp",
        tag: "Pitch 3 • Standard 5v5",
        title: "Main Futsal Pitch",
        caption: "FIFA quality synthetic turf, full air circulation",
      },
      { src: "/hero.webp", title: "Digital Scoreboard" },
      { src: "/hero.webp", title: "Team Locker" },
    ],
    description:
      "Futsal Kingdom Kelapa Gading punya 4 pitch standar 5v5 dengan FIFA quality synthetic turf dan sirkulasi udara penuh, plus digital scoreboard di setiap lapangan.",
    specs: [
      "4 Standard 5v5 Pitches",
      "FIFA Quality Synthetic Turf",
      "Full Air Circulation",
    ],
    stats: [
      { value: "4", label: "Pitches Total" },
      { value: "FIFA", label: "Quality Turf" },
      { value: "Full", label: "Air Circulation" },
      { value: "16 hrs", label: "Daily Schedule" },
    ],
    facilities: ["Digital Scoreboard", "Free Valet", "Canteen", "Team Locker"],
    pricePerHour: 165000,
    disciplines: [
      {
        slug: "futsal",
        label: "Futsal (4 Pitches)",
        courts: [
          { id: "pitch-1", label: "Pitch 1 - Standard 5v5" },
          { id: "pitch-3", label: "Pitch 3 - Standard 5v5" },
        ],
      },
    ],
    sessionDurations: ["1 Hour", "1.5 Hours", "2 Hours"],
    popularSlots: [
      { time: "18:00" },
      { time: "19:00", spotsLeft: 3 },
      { time: "20:00" },
    ],
    facilityFeeNote: "FREE",
    conciergeName: "Futsal Kingdom concierge",
  },
  {
    slug: "smash-padel-house-tebet",
    name: "Smash Padel House Tebet",
    verifiedTag: "Verified Hub",
    breadcrumb: ["Venues", "Jakarta Selatan", "Padel"],
    address: "Jl. Tebet Barat Dalam No. 88, Tebet, Jakarta Selatan",
    rating: 4.7,
    reviewCount: 168,
    openingHoursToday: "Open Today: 06:30 - 23:00",
    totalPhotos: 11,
    images: [
      {
        src: "/hero.webp",
        tag: "Court 1 • Retractable Roof",
        title: "Retractable Roof Court",
        caption: "Mondo Supercourt turf, roof opened on clear days",
      },
      { src: "/hero.webp", title: "Cafe & Lounge" },
      { src: "/hero.webp", title: "Racket Rental" },
    ],
    description:
      "Smash Padel House Tebet menyediakan 5 lapangan padel dengan retractable roof dan Mondo Supercourt turf, plus cafe lounge dan rental raket.",
    specs: ["5 Courts", "Mondo Supercourt Turf", "Retractable Roof"],
    stats: [
      { value: "5", label: "Courts Total" },
      { value: "Mondo", label: "Supercourt Turf" },
      { value: "Retract.", label: "Roof System" },
      { value: "16.5 hrs", label: "Daily Schedule" },
    ],
    facilities: [
      "Cafe & Lounge",
      "Hot Shower",
      "Racket Rental",
      "Free Parking",
    ],
    pricePerHour: 235000,
    disciplines: [
      {
        slug: "padel",
        label: "Padel (5 Courts)",
        courts: [
          { id: "court-1", label: "Court 1 - Retractable Roof" },
          { id: "court-3", label: "Court 3 - Standard" },
        ],
      },
    ],
    sessionDurations: ["1 Hour", "1.5 Hours", "2 Hours"],
    popularSlots: [
      { time: "18:00" },
      { time: "19:30", spotsLeft: 2 },
      { time: "21:00" },
    ],
    facilityFeeNote: "FREE",
    conciergeName: "Smash Padel House concierge",
  },
  {
    slug: "futsal-court-cilandak",
    name: "Futsal Court Cilandak",
    verifiedTag: "Gerflor Taraflex",
    breadcrumb: ["Venues", "Jakarta Selatan", "Futsal"],
    address: "Jl. Raya Cilandak No. 45, Jakarta Selatan",
    rating: 4.5,
    reviewCount: 112,
    openingHoursToday: "Open Today: 07:00 - 22:00",
    totalPhotos: 8,
    images: [
      {
        src: "/hero.webp",
        tag: "Pitch B • Indoor",
        title: "Indoor Pitch",
        caption: "Gerflor Taraflex Vinyl 7.5mm, recirculating AC",
      },
      { src: "/hero.webp", title: "Hydration Lounge" },
      { src: "/hero.webp", title: "Parking Area" },
    ],
    description:
      "Futsal Court Cilandak punya 2 pitch indoor dengan permukaan Gerflor Taraflex Vinyl 7.5mm dan recirculating AC, serta area parkir 40 slot.",
    specs: [
      "2 Indoor Pitches",
      "Gerflor Taraflex Vinyl 7.5mm",
      "Recirculating AC",
    ],
    stats: [
      { value: "2", label: "Indoor Pitches" },
      { value: "7.5 mm", label: "Taraflex Vinyl" },
      { value: "40", label: "Parking Slots" },
      { value: "15 hrs", label: "Daily Schedule" },
    ],
    facilities: [
      "Hydration Lounge",
      "Digital Lockers",
      "Parking Area (40 slots)",
      "Hot Shower",
    ],
    pricePerHour: 140000,
    disciplines: [
      {
        slug: "futsal",
        label: "Futsal (2 Pitches)",
        courts: [
          { id: "pitch-a", label: "Pitch A - Indoor" },
          { id: "pitch-b", label: "Pitch B - Indoor" },
        ],
      },
    ],
    sessionDurations: ["1 Hour", "1.5 Hours", "2 Hours"],
    popularSlots: [
      { time: "18:00" },
      { time: "19:00", spotsLeft: 1 },
      { time: "20:00" },
    ],
    facilityFeeNote: "FREE",
    conciergeName: "Futsal Court concierge",
  },
];

// Hanya satu sumber data: venueDetails. Semua slug yang di-link ke
// /venues/[slug] harus ada di array di atas.
//
// Return type eksplisit supaya page.tsx wajib memeriksa null sebelum render
// (kalau slug tidak ketemu, isinya undefined bukan VenueDetail).
export function getVenueDetail(slug: string): VenueDetail | undefined {
  return venueDetails.find((v) => v.slug === slug);
}
