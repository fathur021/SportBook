// Mengimpor notFound untuk mengarahkan ke halaman 404 jika slug venue tidak ditemukan
import { notFound } from "next/navigation";
import { getPublicVenueBySlug } from "@/modules/venues/venue.service";
import { getSettingsService } from "@/modules/settings/settings.service";
import { toVenueDetail } from "@/lib/venue-detail-mapper";

// Mengimpor komponen-komponen UI penyusun halaman venue detail
import { Container } from "@/components/layout/container";
import { VenueGallery } from "@/components/venues/venue-gallery";
import { VenueHeader } from "@/components/venues/venue-header";
import { VenueAbout } from "@/components/venues/venue-about";
import { VenueBookingWidget } from "@/components/venues/venue-booking-widget";
// Mengimpor komponen Facilities & Amenities yang baru saja dibuat
import { VenueAmenities } from "@/components/venues/venue-amenities";
import { VenueOperatingHours } from "@/components/venues/venue-operating-hours";
import { AvailableCourt } from "@/components/courts/available-court";

// Halaman utama detail venue (Server Component async karena membaca params dari URL)
const page = async (props: PageProps<"/venues/[slug]">) => {
  const { slug } = await props.params;
  // 1. Membaca slug dari URL browser (misal: /venues/gelora-padel-club -> slug = "gelora-padel-club")
  const data = await getPublicVenueBySlug(slug);
  if (!data) notFound();

  // 2. Ambil pengaturan untuk jam operasional dan daftar durasi
  const settings = await getSettingsService();

  // 3. Ubah data database menjadi bentuk yang dipakai komponen tampilan
  const venue = toVenueDetail(data, settings);

  return (
    // Container utama agar lebar halaman konsisten dengan halaman lain di website
    <Container className="flex flex-col gap-6 py-6">
      {/* 1. Header venue: Nama, alamat, rating, dan breadcrumb */}
      <VenueHeader venue={venue} />

      {/* 2. Galeri foto-foto venue */}
      <VenueGallery
        images={venue.images}
        totalPhotos={venue.totalPhotos}
        venueName={venue.name}
      />

      {/* 3. Layout Grid 2 Kolom: Kolom kiri konten utama (1fr), Kolom kanan sidebar booking widget (20rem) */}
      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[1fr_20rem]">
        {/* Kolom Kiri: Dibungkus dengan flex-col gap-6 agar About dan Amenities tersusun vertikal ke bawah */}
        <div className="flex min-w-0 flex-col gap-6">
          {/* Section Facility Standards & Informasi Tentang Venue */}
          <VenueAbout
            name={venue.name}
            description={venue.description}
            stats={venue.stats}
          />

          {/* Section Facilities & Amenities: Mengirimkan data venue.amenities sebagai props */}
          <VenueAmenities amenities={venue.amenities} />
          <VenueOperatingHours
            badge={venue.operatingHoursBadge}
            schedules={venue.operatingSchedules}
          />
          <AvailableCourt
            disciplines={venue.disciplines}
            basePricePerHour={venue.pricePerHour}
            images={venue.images}
          />
        </div>

        {/* Kolom Kanan: Widget pemilihan jadwal dan tombol booking lapangan.
            Disembunyikan kalau venue belum punya lapangan, karena widget
            membutuhkan minimal satu discipline/court. */}
        {venue.disciplines.length > 0 && (
          <div className="min-w-0">
            <VenueBookingWidget
              rating={venue.rating}
              reviewCount={venue.reviewCount}
              basePricePerHour={venue.pricePerHour}
              disciplines={venue.disciplines}
              venueSlug={venue.slug}
              sessionDurations={venue.sessionDurations}
              facilityFeeNote={venue.facilityFeeNote}
              conciergeName={venue.conciergeName}
            />
          </div>
        )}
      </div>
    </Container>
  );
};

export default page;
