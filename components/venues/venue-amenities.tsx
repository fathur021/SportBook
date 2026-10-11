// Grid fasilitas & amenities venue. Icon dipetakan dari kode teks di data
// (VenueAmenity["icon"]) menjadi komponen ikon Lucide / SVG kustom.

import {
  Coffee,
  ShowerHead,
  Snowflake,
  Store,
  Video,
  Whistle,
} from "lucide-react";
import { VenueAmenity } from "@/lib/venue-detail";

// Ikon kustom karena Lucide belum menyediakan raket padel dan bola futsal.
function RacketIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="14" cy="9.5" r="6" />
      <path d="M9.5 14L4 19.5" />
      <circle cx="5" cy="5" r="1.5" />
    </svg>
  );
}

function SoccerBallIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="12 7 15.5 9.5 14 13.5 10 13.5 8.5 9.5" />
      <path d="M12 7V2" />
      <path d="M15.5 9.5L20 8" />
      <path d="M14 13.5L18 18" />
      <path d="M10 13.5L6 18" />
      <path d="M8.5 9.5L4 8" />
    </svg>
  );
}

function renderAmenityIcon(iconType: VenueAmenity["icon"]) {
  const iconClass = "size-5 text-emerald-700";

  switch (iconType) {
    case "court":
      return <RacketIcon className={iconClass} />;
    case "ac":
      return <Snowflake className={iconClass} />;
    case "shower":
      return <ShowerHead className={iconClass} />;
    case "rental":
      return <Whistle className={iconClass} />;
    case "shop":
      return <Store className={iconClass} />;
    case "cafe":
      return <Coffee className={iconClass} />;
    case "parking":
      return (
        <span className="text-base font-black text-emerald-800">P</span>
      );
    case "futsal":
      return <SoccerBallIcon className={iconClass} />;
    case "video":
      return <Video className={iconClass} />;
    default:
      return null;
  }
}

interface VenueAmenitiesProps {
  amenities?: VenueAmenity[];
}

export function VenueAmenities({ amenities }: VenueAmenitiesProps) {
  if (!amenities || amenities.length === 0) {
    return null;
  }

  return (
    <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <div className="mb-6 flex flex-col gap-1">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Facilities & Amenities
        </h2>
        <p className="text-sm text-slate-500">
          Everything you need for seamless pre-match warmup and post-game
          recovery.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {amenities.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3.5 rounded-xl border border-sky-100/70 bg-[#f4f8fe] p-3.5"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-xs">
              {renderAmenityIcon(item.icon)}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold leading-tight text-slate-900">
                {item.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs leading-snug text-slate-500">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}