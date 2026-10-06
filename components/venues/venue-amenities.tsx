// Mengimpor tipe data VenueAmenity dari file venue-detail untuk validasi struktur data
import { VenueAmenity } from "@/lib/venue-detail";

// Mengimpor icon-icon siap pakai dari library lucide-react
import {
    Snowflake,   // Icon salju (untuk AC Lounge)
    ShowerHead,  // Icon kepala shower (untuk Hot Water Showers)
    Whistle,     // Icon peluit (untuk Gear & Racket Rental)
    Store,       // Icon toko (untuk Pro Shop)
    Coffee,      // Icon cangkir kopi (untuk Cafe & Refreshments)
    Video,       // Icon kamera video (untuk Auto Match Replay)
} from "lucide-react";

// =========================================================================
// BAGIAN 1: Icon Kustom Manual (Menggunakan SVG murni)
// Dibuat karena Lucide belum menyediakan icon spesifik raket tenis/padel dan bola futsal
// =========================================================================

// Komponen icon Raket Padel / Tenis
function RacketIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}           // Menerima class Tailwind (misal ukuran dan warna)
            viewBox="0 0 24 24"             // Kanvas koordinat SVG standar 24x24
            fill="none"                     // Bagian dalam transparan, hanya garis luar
            stroke="currentColor"           // Warna garis otomatis mengikuti text-emerald-700
            strokeWidth="1.5"               // Ketebalan garis outline
            strokeLinecap="round"           // Ujung garis dibuat membulat
            strokeLinejoin="round"          // Sudut pertemuan garis dibuat membulat
        >
            {/* Lingkaran kepala raket */}
            <circle cx="14" cy="9.5" r="6" />
            {/* Gagang raket yang mengarah ke kiri bawah */}
            <path d="M9.5 14L4 19.5" />
            {/* Bola kecil di samping raket */}
            <circle cx="5" cy="5" r="1.5" />
        </svg>
    );
}

// Komponen icon Bola Futsal / Sepakbola
function SoccerBallIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}           // Menerima class Tailwind (warna & ukuran)
            viewBox="0 0 24 24"             // Kanvas koordinat SVG 24x24
            fill="none"                     // Latar bentuk transparan
            stroke="currentColor"           // Warna garis mengikuti warna teks
            strokeWidth="2"                 // Ketebalan garis
            strokeLinecap="round"           // Ujung garis membulat
            strokeLinejoin="round"          // Sudut garis membulat
        >
            {/* Lingkaran luar bola */}
            <circle cx="12" cy="12" r="10" />
            {/* Pola segi lima (pentagon) di tengah bola */}
            <polygon points="12 7 15.5 9.5 14 13.5 10 13.5 8.5 9.5" />
            {/* Garis-garis jahitan bola */}
            <path d="M12 7V2" />
            <path d="M15.5 9.5L20 8" />
            <path d="M14 13.5L18 18" />
            <path d="M10 13.5L6 18" />
            <path d="M8.5 9.5L4 8" />
        </svg>
    );
}

// =========================================================================
// BAGIAN 2: Helper Pemilihan Icon
// Mengubah kode teks di data (misal "court", "ac") menjadi icon visual React
// =========================================================================

function renderAmenityIcon(iconType: VenueAmenity["icon"]) {
    // Class seragam: ukuran 20x20px (size-5) dengan warna hijau emerald
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
            // Huruf "P" tebal seperti rambu parkir di gambar asli
            return <span className="text-base font-black text-emerald-800">P</span>;
        case "futsal":
            return <SoccerBallIcon className={iconClass} />;
        case "video":
            return <Video className={iconClass} />;
        default:
            return null;
    }
}

// =========================================================================
// BAGIAN 3: Komponen Utama VenueAmenities
// =========================================================================

// Interface Props: Mendefinisikan bahwa komponen ini menerima properti bernama 'amenities'
interface VenueAmenitiesProps {
    amenities?: VenueAmenity[];
}

export function VenueAmenities({ amenities }: VenueAmenitiesProps) {
    // Guard clause: Jika venue ini belum punya data amenities (atau kosong),
    // sembunyikan seluruh komponen (return null) agar tidak muncul kotak kosong di layar
    if (!amenities || amenities.length === 0) {
        return null;
    }

    return (
        // Kartu kontainer terluar: border tipis, rounded-xl, background putih, padding 6 (24px)
        <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
            {/* Header: Judul dan deskripsi bagian atas */}
            <div className="mb-6 flex flex-col gap-1">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                    Facilities & Amenities
                </h2>
                <p className="text-sm text-slate-500">
                    Everything you need for seamless pre-match warmup and post-game recovery.
                </p>
            </div>

            {/* Grid 3 kolom responsif: 1 kolom di HP, 2 kolom di tablet, 3 kolom di laptop/desktop */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Looping / perulangan untuk setiap item di array amenities */}
                {amenities.map((item) => (
                    <div
                        key={item.id} // Key unik wajib untuk tiap elemen loop di React
                        // Kotak kecil item: latar biru es (#f4f8fe), border halus, sudut melengkung, padding 3.5
                        className="flex items-center gap-3.5 rounded-xl border border-sky-100/70 bg-[#f4f8fe] p-3.5"
                    >
                        {/* Kotak putih tempat icon: ukuran 36x36px (size-9), icon ditaruh tepat di tengah */}
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-xs">
                            {renderAmenityIcon(item.icon)}
                        </div>

                        {/* Kontainer teks sebelah kanan: min-w-0 agar teks panjang bisa wrap dan tidak merusak layout */}
                        <div className="min-w-0 flex-1">
                            {/* Judul fasilitas tebal (misal: "AC Players Lounge") */}
                            <h3 className="text-sm font-semibold leading-tight text-slate-900">
                                {item.title}
                            </h3>
                            {/* Deskripsi fasilitas: warna abu-abu, maksimal 2 baris (line-clamp-2) */}
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