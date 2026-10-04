import { CourtFilter } from "@/components/courts/court-filters";
import { CourtsHeader } from "@/components/courts/courts-header";
import { Container } from "@/components/layout/container";
import { VenueListings } from "@/components/venues/venue-listings";
import { VenuePagination } from "@/components/venues/venue-pagination";

import { venueListings } from "@/lib/listings";
import { paginate, parsePage } from "@/lib/pagination";

const PER_PAGE = 6;

const page = async function Page(props: PageProps<"/explore">) {
  // Di Next 16 searchParams itu Promise, bukan objek biasa
  const { page } = await props.searchParams;

  const { items, total, totalPages, currentPage, hasPrev, hasNext } = paginate(
    venueListings,
    parsePage(page),
    PER_PAGE,
  );

  return (
    <div>
      <CourtsHeader />
      <Container className="py-6">
        <div className="grid items-start gap-6 lg:grid-cols-[18rem_1fr]">
          <CourtFilter />

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
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default page;
