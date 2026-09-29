import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { buildPageHref } from "@/lib/pagination";

type Props = {
  currentPage: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
};

// Sengaja Server Component: PaginationLink merender <a href>, jadi navigasi
// diserahkan ke browser tanpa JS pagination sama sekali.
export function VenuePagination({currentPage,totalPages,hasPrev,hasNext,}: Props) {
  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-6 border-t pt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            // href dibuang saat mati supaya <a> tidak bisa di-Tab atau di-Enter
            // lewat keyboard (pointer-events-none hanya menahan mouse)
            {...(hasPrev ? { href: buildPageHref(currentPage - 1) } : {})}
            aria-disabled={!hasPrev}
            className={!hasPrev ? "pointer-events-none opacity-40" : undefined}
          />
        </PaginationItem>

        {buildPages(currentPage, totalPages).map((p, i) =>
          p === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                href={buildPageHref(p)}
                isActive={p === currentPage}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            {...(hasNext ? { href: buildPageHref(currentPage + 1) } : {})}
            aria-disabled={!hasNext}
            className={!hasNext ? "pointer-events-none opacity-40" : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

// Selalu tampilkan halaman pertama & terakhir, plus window di sekitar halaman
// sekarang. Jarak yang bolong diganti ellipsis.
function buildPages(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const wanted = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...wanted]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const pages: (number | "ellipsis")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) pages.push("ellipsis");
    pages.push(p);
  });
  return pages;
}
