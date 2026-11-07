import { Suspense } from "react";

import { CourtFilter } from "@/components/courts/court-filters";
import { CourtsHeader } from "@/components/courts/courts-header";
import { Container } from "@/components/layout/container";
import { VenueListings } from "@/components/venues/venue-listings";
import { VenuePagination } from "@/components/venues/venue-pagination";

import { filterVenues } from "@/lib/filter-venues";
import { paginate, parsePage } from "@/lib/pagination";

// [HAPUS] Baris lama: import { venueListings } from "@/lib/listings";

// [TAMBAH] Ambil data asli dari database dan ubah bentuknya.
import { listPublicVenues } from "@/modules/venues/venue.service";
import { toVenueListing } from "@/lib/venue-listings";

// [TAMBAH] Supaya data selalu diambil ulang saat halaman dibuka,
// tidak dibekukan sekali saat proses build.
export const dynamic = "force-dynamic";

const PER_PAGE = 6;

const page = async function Page(props: PageProps<"/explore">) {
  // Di Next 16 searchParams itu Promise, bukan objek biasa
  const sp = await props.searchParams;

  // [TAMBAH] 1. Ambil venue aktif dari database, lalu ubah ke bentuk VenueListing.
  const venuesFromDb = await listPublicVenues();
  const listings = venuesFromDb.map(toVenueListing);

  // [GANTI] Dulu: filterVenues(venueListings, sp)
  // Sekarang memakai hasil query database di atas.
  const filtered = filterVenues(listings, sp);

  // 2. Baru dipaginasi dari hasil filter
  const { items, total, totalPages, currentPage, hasPrev, hasNext } = paginate(
    filtered,
    parsePage(sp.page),
    PER_PAGE,
  );

  return (
    <div>
      <Suspense>
        <CourtsHeader />
      </Suspense>
      <Container className="py-6">
        <div className="grid items-start gap-6 lg:grid-cols-[18rem_1fr]">
          <Suspense>
            <CourtFilter resultCount={total} />
          </Suspense>

          <div>
            <p className="mb-4 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{total}</span>{" "}
              venues match your filters
            </p>

            <VenueListings venues={items} />

            <VenuePagination
              currentPage={currentPage}
              totalPages={totalPages}
              hasPrev={hasPrev}
              hasNext={hasNext}
              searchParams={sp}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default page;