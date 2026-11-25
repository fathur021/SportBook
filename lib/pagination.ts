export type Paginated<T> = {
  items: T[];
  total: number;
  totalPages: number;
  currentPage: number;
  hasPrev: boolean;
  hasNext: boolean;
};

// searchParams bertipe string | string[] | undefined dan bisa berisi apa saja
// karena user mengetik URL manual, jadi harus dibersihkan sebelum dipakai
export function parsePage(raw: string | string[] | undefined): number {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : 1;
}

export function paginate<T>(
  items: T[],
  page: number,
  perPage: number
): Paginated<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  // clamp supaya ?page=99 jadi halaman terakhir, bukan halaman kosong
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * perPage;

  return {
    items: items.slice(start, start + perPage),
    total,
    totalPages,
    currentPage,
    hasPrev: currentPage > 1,
    hasNext: currentPage < totalPages,
  };
}
