// "use client" wajib karena komponen ini memakai hook React.
"use client";

// Lima ikon dari lucide-react untuk mempercantik kartu.
import {
  Banknote,
  CalendarCheck,
  Hourglass,
  ReceiptText,
  Wallet,
} from "lucide-react";

// Fungsi yang sudah ada untuk mengubah angka menjadi "Rp 1.250.000".
import { formatRupiah } from "@/lib/format-rupiah";
// Hook hasil tambahan di admin-api tadi.
import { useGetAdminDashboardQuery } from "@/lib/redux/admin-api";


// Peta gaya untuk setiap kartu.
// as const membuat nilainya dianggap tetap, sehingga tipenya lebih ketat.
const STAT_STYLES = {
  // Kartu total pendapatan memakai warna hijau tua supaya paling menonjol.
  total: { icon: Banknote, iconClass: "bg-emerald-600 text-white" },
  // Kartu pendapatan memakai ikon dompet dan warna hijau.
  revenue: { icon: Wallet, iconClass: "bg-emerald-50 text-emerald-700" },
  // Kartu booking lunas memakai ikon struk dan warna biru.
  paid: { icon: ReceiptText, iconClass: "bg-blue-50 text-blue-700" },
  // Kartu menunggu pembayaran memakai ikon jam pasir dan warna kuning.
  pending: { icon: Hourglass, iconClass: "bg-amber-50 text-amber-700" },
  // Kartu booking hari ini memakai ikon kalender dan warna abu-abu.
  today: { icon: CalendarCheck, iconClass: "bg-slate-100 text-slate-600" },
} as const;

// Komponen utama yang dipasang di halaman dashboard.
export function DashboardStats() {
  // Hook ini otomatis memanggil API saat komponen pertama kali tampil.
  // data berisi hasilnya, isLoading menandakan proses masih berjalan,
  // isError bernilai true kalau request gagal.
  const { data, isLoading, isError } = useGetAdminDashboardQuery();

  // Kalau masih memuat, tampilkan lima kotak berkedip sebagai penanda.
  if (isLoading) {
    return (
      // Grid yang sama dengan tampilan akhir, supaya tata letak tidak melompat.
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {/* map membuat lima kotak dari array angka 0 sampai 4 */}
        {[0, 1, 2, 3, 4].map((item) => (
          <div
            // key dibutuhkan React untuk membedakan tiap elemen.
            key={item}
            // animate-pulse membuat kotak berdenyut pelan.
            className="h-[132px] animate-pulse rounded-xl border border-slate-200 bg-white"
          />
        ))}
      </section>
    );
  }

  // Kalau gagal atau data kosong, tampilkan kotak peringatan.
  if (isError || !data) {
    return (
      // Warna merah muda menandakan ada masalah.
      <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-6 text-center text-sm text-rose-700">
        Gagal memuat ringkasan dashboard. Coba muat ulang halaman.
      </div>
    );
  }

  // Susun lima kartu dari data API.
  // as const pada key membuat tipenya cocok dengan STAT_STYLES di atas.
  const stats = [
    {
      key: "total" as const,
      // Judul kartu.
      label: "Total Pendapatan",
      // Seluruh uang yang pernah masuk, bukan hanya hari ini.
      value: formatRupiah(data.totalRevenue),
      // Catatan kecil di bawah angka.
      note: "Semua pembayaran lunas",
    },
    {
      key: "revenue" as const,
      // Judul kartu.
      label: "Pendapatan Hari Ini",
      // Angka diubah ke format rupiah.
      value: formatRupiah(data.revenueToday),
      // Catatan kecil di bawah angka.
      note: `${data.paidBookingsToday} transaksi lunas hari ini`,
    },
    {
      key: "paid" as const,
      label: "Booking Lunas",
      // toLocaleString("id-ID") memberi pemisah ribuan gaya Indonesia.
      value: data.paidBookingsToday.toLocaleString("id-ID"),
      note: "Pembayaran masuk hari ini",
    },
    {
      key: "pending" as const,
      label: "Menunggu Pembayaran",
      value: data.waitingPayments.toLocaleString("id-ID"),
      note: "Booking yang belum dibayar",
    },
    {
      key: "today" as const,
      label: "Booking Hari Ini",
      value: data.bookingsToday.toLocaleString("id-ID"),
      note: "Tidak termasuk yang dibatalkan",
    },
  ];

  // Tampilan akhir: satu baris berisi lima kartu.
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {/* Ulangi setiap kartu di dalam array stats. */}
      {stats.map((stat) => {
        // Ambil ikon dan kelas warna sesuai kunci kartu.
        const style = STAT_STYLES[stat.key];
        // Simpan komponen ikon ke variabel berhuruf besar,
        // karena React menganggap komponen harus diawali huruf kapital.
        const Icon = style.icon;

        return (
          // article dipakai karena tiap kartu adalah satu kesatuan informasi.
          <article
            key={stat.key}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            {/* Baris atas: judul di kiri, ikon di kanan. */}
            <div className="flex items-start justify-between gap-3">
              {/* Judul kartu. */}
              <p className="text-sm text-slate-500">{stat.label}</p>
              {/* Lingkaran tempat ikon. */}
              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${style.iconClass}`}
              >
                {/* Ikon berukuran 4 satuan. */}
                <Icon className="size-4" />
              </span>
            </div>

            {/* Angka utama kartu. */}
            <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              {stat.value}
            </p>

            {/* [HAPUS] blok tren naik/turun, karena belum ada data pembanding. */}
            {/* Catatan kecil di bawah angka. */}
            <p className="mt-1 text-xs text-slate-500">{stat.note}</p>
          </article>
        );
      })}
    </section>
  );
}
