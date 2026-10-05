import { Suspense } from "react";

import { CourtFilter } from "@/components/courts/court-filters";
import { CourtsHeader } from "@/components/courts/courts-header";
import { Container } from "@/components/layout/container";
import { VenueListings } from "@/components/venues/venue-listings";
import { VenuePagination } from "@/components/venues/venue-pagination";

import { filterVenues } from "@/lib/filter-venues";
import { venueListings } from "@/lib/listings";
import { paginate, parsePage } from "@/lib/pagination";

const PER_PAGE = 6;

const page = async function Page(props: PageProps<"/explore">) {
  // Di Next 16 searchParams itu Promise, bukan objek biasa
  const sp = await props.searchParams;

  // 1. filter dulu dari semua data
  const filtered = filterVenues(venueListings, sp);

  // 2. baru dipaginasi dari hasil filter
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