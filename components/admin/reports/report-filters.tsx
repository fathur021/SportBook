import type { ReportPeriod } from "@/lib/redux/admin-api";

type VenueOption = {
  slug: string;
  name: string;
};

type ReportFiltersProps = {
  selectedPeriod: ReportPeriod;
  selectedVenue: string;
  venues: VenueOption[];
  onPeriodChange: (period: ReportPeriod) => void;
  onVenueChange: (venue: string) => void;
};

export function ReportFilters({
  selectedPeriod,
  selectedVenue,
  venues,
  onPeriodChange,
  onVenueChange,
}: ReportFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <label className="space-y-1 text-xs font-medium text-slate-600">
        Periode
        <select
          value={selectedPeriod}
          onChange={(event) =>
            onPeriodChange(event.target.value as ReportPeriod)
          }
          className="block h-9 min-w-36 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-emerald-600"
        >
          <option value="all">Semua waktu</option>
          <option value="30">30 hari terakhir</option>
          <option value="90">90 hari terakhir</option>
        </select>
      </label>

      <label className="space-y-1 text-xs font-medium text-slate-600">
        Venue
        <select
          value={selectedVenue}
          onChange={(event) => onVenueChange(event.target.value)}
          className="block h-9 min-w-44 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-emerald-600"
        >
          <option value="all">Semua venue</option>
          {venues.map((venue) => (
            <option key={venue.slug} value={venue.slug}>
              {venue.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
