// Seed data venue, lapangan, dan equipment.
// Aman dijalankan berulang: venue dan lapangan memakai upsert, equipment
// dihapus dulu untuk slug yang di-seed supaya tidak menumpuk.
//
// Jalankan dengan: npm run db:seed

require("dotenv").config({
  path: require("path").join(__dirname, "..", ".env"),
});
const { Client } = require("pg");
const { randomUUID } = require("crypto");

// User dengan nama/email jelas testing.
const TEST_USER_EMAILS = [
  "admintest-0303@example.com",
  "user2@gmail.com",
  "user@gmail.com",
];

// Venue yang jelas testing atau duplikat kosong.
// - testing / testing2: nama dan alamat asal-asalan.
// - venue-uji-admin-20261027: venue uji admin.
// - smash-padel-club-kemang: duplikat lama tanpa lapangan.
const TEST_VENUE_SLUGS = [
  "testing",
  "testing2",
  "venue-uji-admin-20261027",
  "smash-padel-club-kemang",
];

const VENUES = [
  {
    slug: "smash-padel-kemang",
    name: "Smash Padel Club Kemang",
    description:
      "Klub padel dengan lapangan panoramik dan area sosial yang nyaman di jantung Kemang.",
    address: "Jl. Kemang Raya No. 45, Bangka, Mampang Prapatan",
    city: "Jakarta Selatan",
    phone: "+6281234567890",
    email: "info@smashpadel.com",
    facilities: [
      "ac-lounge",
      "showers",
      "pro-shop",
      "free-parking",
      "scoreboard",
    ],
    popularityRank: 1,
    courts: [
      {
        name: "Court 1 - Panoramic Glass",
        sport: "Padel",
        surface: "Mondo Supercourt XN Turf",
        isIndoor: false,
        pricePerHour: 260000,
        maxPlayers: 4,
      },
      {
        name: "Court 2 - Open Sky",
        sport: "Padel",
        surface: "Synthetic Grass",
        isIndoor: false,
        pricePerHour: 220000,
        maxPlayers: 4,
      },
      {
        name: "Court 3 - Night Session",
        sport: "Padel",
        surface: "Synthetic Grass",
        isIndoor: true,
        pricePerHour: 280000,
        maxPlayers: 4,
      },
      {
        name: "Lapangan 1 - Vinyl",
        sport: "Badminton",
        surface: "Vinyl",
        isIndoor: false,
        pricePerHour: 60000,
        maxPlayers: 4,
      },
    ],
    equipment: [
      { name: "Padel Racket - Control", price: 45000, stock: 12, category: "Padel" },
      { name: "Padel Ball (3 pcs)", price: 25000, stock: 40, category: "Padel" },
      { name: "Grip Tape", price: 15000, stock: 30, category: "Aksesoris" },
    ],
  },
  {
    slug: "padel-senayan-jakarta",
    name: "Padel Senayan Jakarta",
    description:
      "Lapangan padel indoor dan outdoor dengan akses mudah di area Senayan.",
    address: "Jl. Gatot Subroto No. 52, Senayan, Jakarta Pusat",
    city: "Jakarta Pusat",
    phone: "+628112223334",
    email: "hello@padelsenayan.id",
    facilities: [
      "ac-lounge",
      "showers",
      "free-parking",
      "lockers",
      "scoreboard",
    ],
    popularityRank: 2,
    courts: [
      {
        name: "Court 1 - Signature Indoor",
        sport: "Padel",
        surface: "Mondo Supercourt",
        isIndoor: true,
        pricePerHour: 300000,
        maxPlayers: 4,
      },
      {
        name: "Court 2 - Social Outdoor",
        sport: "Padel",
        surface: "Synthetic Turf",
        isIndoor: false,
        pricePerHour: 240000,
        maxPlayers: 4,
      },
      {
        name: "Court 3 - Rooftop",
        sport: "Padel",
        surface: "Synthetic Grass",
        isIndoor: false,
        pricePerHour: 270000,
        maxPlayers: 4,
      },
    ],
    equipment: [
      { name: "Padel Racket - Power", price: 50000, stock: 10, category: "Padel" },
      { name: "Padel Ball (3 pcs)", price: 25000, stock: 36, category: "Padel" },
      { name: "Locker Rental", price: 10000, stock: 20, category: "Fasilitas" },
    ],
  },
  {
    slug: "garuda-futsal-tangerang",
    name: "Garuda Futsal Center",
    description:
      "Futsal indoor dengan rumut profesional, tribun kecil, dan area istirahat ber-AC.",
    address: "Jl. BSD Green City No. 8, Serpong, Tangerang Selatan",
    city: "Tangerang Selatan",
    phone: "+628137778889",
    email: "garuda@futsalcenter.id",
    facilities: [
      "ac-lounge",
      "showers",
      "free-parking",
      "canteen",
      "sound-system",
    ],
    popularityRank: 3,
    courts: [
      {
        name: "Lapangan A - Pro Turf",
        sport: "Futsal",
        surface: "Synthetic Turf",
        isIndoor: true,
        pricePerHour: 180000,
        maxPlayers: 10,
      },
      {
        name: "Lapangan B - Community",
        sport: "Futsal",
        surface: "Vinyl",
        isIndoor: true,
        pricePerHour: 140000,
        maxPlayers: 10,
      },
    ],
    equipment: [
      { name: "Sepatu Futsal", price: 35000, stock: 18, category: "Futsal" },
      { name: "Bola Futsal", price: 30000, stock: 24, category: "Futsal" },
      { name: "Kaus Olahraga", price: 20000, stock: 25, category: "Apparel" },
    ],
  },
  {
    slug: "seri-badminton-condet",
    name: "Seri Badminton Condet",
    description:
      "Badminton indoor dan outdoor dengan layanan stringing racket di lokasi.",
    address: "Jl. Condet Raya No. 77, Balekambang, Jakarta Timur",
    city: "Jakarta Timur",
    phone: "+628129990011",
    email: "seri@badmintoncondet.id",
    facilities: [
      "ac-lounge",
      "showers",
      "pro-shop",
      "free-parking",
      "racket-stringing",
    ],
    popularityRank: 4,
    courts: [
      {
        name: "Lapangan 1 - Vinyl Pro",
        sport: "Badminton",
        surface: "Vinyl",
        isIndoor: true,
        pricePerHour: 120000,
        maxPlayers: 4,
      },
      {
        name: "Lapangan 2 - Wood",
        sport: "Badminton",
        surface: "Wood",
        isIndoor: true,
        pricePerHour: 140000,
        maxPlayers: 4,
      },
      {
        name: "Lapangan 3 - Synthetic",
        sport: "Badminton",
        surface: "Synthetic",
        isIndoor: false,
        pricePerHour: 90000,
        maxPlayers: 4,
      },
    ],
    equipment: [
      { name: "Raket Yonex Astrox", price: 30000, stock: 15, category: "Badminton" },
      { name: "Kok Tube (12 pcs)", price: 35000, stock: 30, category: "Badminton" },
      { name: "Grip Tape", price: 15000, stock: 28, category: "Aksesoris" },
    ],
  },
  {
    slug: "pondok-indah-tennis",
    name: "Pondok Indah Tennis Court",
    description:
      "Lapangan tenis dengan permukaan hard court dan clay di area Pondok Indah.",
    address: "Jl. Metro Pondok Indah No. 12, Pondok Indah, Jakarta Selatan",
    city: "Jakarta Selatan",
    phone: "+628111223344",
    email: "reservation@pitennis.id",
    facilities: [
      "showers",
      "free-parking",
      "ball-rental",
      "canteen",
      "lockers",
    ],
    popularityRank: null,
    courts: [
      {
        name: "Court 1 - Hard Court",
        sport: "Tennis",
        surface: "Hard Court",
        isIndoor: false,
        pricePerHour: 150000,
        maxPlayers: 4,
      },
      {
        name: "Court 2 - Clay",
        sport: "Tennis",
        surface: "Clay",
        isIndoor: false,
        pricePerHour: 170000,
        maxPlayers: 4,
      },
    ],
    equipment: [
      { name: "Raket Wilson Clash", price: 40000, stock: 8, category: "Tennis" },
      { name: "Bola Tennis (3 pcs)", price: 25000, stock: 32, category: "Tennis" },
      { name: "Tas Raket", price: 20000, stock: 12, category: "Aksesoris" },
    ],
  },
];

const SEED_SLUGS = VENUES.map((venue) => venue.slug);

async function upsertVenue(client, venue) {
  const popular = venue.popularityRank !== null;
  const values = [
    randomUUID(),
    venue.slug,
    venue.name,
    venue.description,
    venue.address,
    venue.city,
    venue.phone,
    venue.email,
    "Asia/Jakarta",
    "/hero.webp",
    venue.facilities,
    true,
    true,
    popular,
    venue.popularityRank,
  ];

  const { rows } = await client.query(
    `INSERT INTO "Venue"
      ("id", "slug", "name", "description", "address", "city", "phone", "email",
       "timeZone", "coverImage", "facilities", "isVerified", "isActive",
       "isPopular", "popularityRank", "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
             NOW(), NOW())
     ON CONFLICT ("slug") DO UPDATE SET
       "name" = EXCLUDED."name",
       "description" = EXCLUDED."description",
       "address" = EXCLUDED."address",
       "city" = EXCLUDED."city",
       "phone" = EXCLUDED."phone",
       "email" = EXCLUDED."email",
       "timeZone" = EXCLUDED."timeZone",
       "coverImage" = EXCLUDED."coverImage",
       "facilities" = EXCLUDED."facilities",
       "isVerified" = EXCLUDED."isVerified",
       "isActive" = EXCLUDED."isActive",
       "isPopular" = EXCLUDED."isPopular",
       "popularityRank" = EXCLUDED."popularityRank",
       "updatedAt" = NOW()
     RETURNING "id"`,
    values,
  );

  return rows[0].id;
}

async function upsertCourt(client, venueId, court) {
  await client.query(
    `INSERT INTO "Court"
      ("id", "venueId", "name", "sport", "surface", "isIndoor", "pricePerHour",
       "image", "maxPlayers", "isActive", "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
     ON CONFLICT ("venueId", "name") DO UPDATE SET
       "sport" = EXCLUDED."sport",
       "surface" = EXCLUDED."surface",
       "isIndoor" = EXCLUDED."isIndoor",
       "pricePerHour" = EXCLUDED."pricePerHour",
       "maxPlayers" = EXCLUDED."maxPlayers",
       "isActive" = EXCLUDED."isActive",
       "updatedAt" = NOW()`,
    [
      randomUUID(),
      venueId,
      court.name,
      court.sport,
      court.surface,
      court.isIndoor,
      court.pricePerHour,
      null,
      court.maxPlayers,
      true,
    ],
  );
}

async function insertEquipment(client, venueId, equipment) {
  await client.query(
    `INSERT INTO "Equipment"
      ("id", "venueId", "name", "price", "stock", "category", "isActive",
       "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
    [
      randomUUID(),
      venueId,
      equipment.name,
      equipment.price,
      equipment.stock,
      equipment.category,
      true,
    ],
  );
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL belum terisi di .env");
  }

  const client = new Client({ connectionString });
  await client.connect();

  try {
    await client.query("BEGIN");

    // 1. User testing beserta session, account, dan booking terkait.
    const removedUsers = await client.query(
      `DELETE FROM "user" WHERE "email" = ANY($1::text[])`,
      [TEST_USER_EMAILS],
    );
    await client.query(
      `DELETE FROM "verification" WHERE "identifier" = ANY($1::text[])`,
      [TEST_USER_EMAILS],
    );

    // 2. Venue testing/duplikat beserta court, equipment, dan booking terkait.
    const removedVenues = await client.query(
      `DELETE FROM "Venue" WHERE "slug" = ANY($1::text[])`,
      [TEST_VENUE_SLUGS],
    );

    // 3. Equipment lama pada venue yang akan di-seed diganti seluruhnya.
    await client.query(
      `DELETE FROM "Equipment"
       WHERE "venueId" IN (
         SELECT "id" FROM "Venue" WHERE "slug" = ANY($1::text[])
       )`,
      [SEED_SLUGS],
    );

    let courtCount = 0;
    let equipmentCount = 0;

    for (const venue of VENUES) {
      const venueId = await upsertVenue(client, venue);

      for (const court of venue.courts) {
        await upsertCourt(client, venueId, court);
        courtCount += 1;
      }

      for (const equipment of venue.equipment) {
        await insertEquipment(client, venueId, equipment);
        equipmentCount += 1;
      }
    }

    // 4. Venue di luar seed tidak boleh tampil sebagai popular.
    await client.query(
      `UPDATE "Venue"
       SET "isPopular" = false, "popularityRank" = NULL, "updatedAt" = NOW()
       WHERE NOT ("slug" = ANY($1::text[]))`,
      [SEED_SLUGS],
    );

    await client.query("COMMIT");

    console.log(
      `Seed selesai: ${removedUsers.rowCount} user testing dihapus, ` +
        `${removedVenues.rowCount} venue testing dihapus, ` +
        `${VENUES.length} venue, ${courtCount} lapangan, ` +
        `${equipmentCount} equipment disiapkan.`,
    );
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("Seed gagal:", error.message);
  process.exit(1);
});
