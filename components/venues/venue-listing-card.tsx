// ---------------------------------------------------------------------------
// Komponen Kartu Venue (VenueListingCard)
//
// Komponen kartu ringkasan informasi venue untuk halaman Explore:
// • Menampilkan thumbnail gambar venue dengan rasio responsif (vertikal di mobile, horizontal di desktop)
// • Menampilkan badge kategori olahraga, status verifikasi mitra, dan skor rating
// • Menampilkan informasi nama venue, alamat, estimasi jarak (km), dan tombol favorit (wishlist)
// • Menyajikan ringkasan spesifikasi lapangan (misal jenis lantai, indoor/outdoor) dan daftar fasilitas
// • Menampilkan jadwal slot terdekat yang tersedia (Next Available) dan harga sewa per jam
// • Menyediakan tombol aksi navigasi cepat: "View Courts" dan "Instant Book"
// ---------------------------------------------------------------------------

import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, ShieldCheck, Star, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { VenueListing } from "@/lib/listings";
import { formatRupiah } from "@/lib/format-rupiah";

// ---------------------------------------------------------------------------
// Tipe Props untuk komponen VenueListingCard
// ---------------------------------------------------------------------------
type VenueListingCardProps = {
  venue: VenueListing; // Objek data venue lengkap
};

export function VenueListingCard({ venue }: VenueListingCardProps) {
  return (
    // Kartu utama: Berubah dari layout kolom (mobile) menjadi layout baris horizontal di layar medium ke atas (md:flex-row)
    <Card className="flex flex-col gap-0 overflow-hidden py-0 md:flex-row">
      
      {/* ------------------------------------------------------------------- */}
      {/* Bagian Visual: Gambar Venue + Overlay Badge & Rating                */}
      {/* ------------------------------------------------------------------- */}
      <div className="relative h-56 w-full shrink-0 md:h-auto md:w-72">
        {/* Gambar responsif dengan optimasi Next.js (fill + object-cover) */}
        <Image
          src={venue.image}
          alt={venue.name}
          fill
          sizes="(max-width: 768px) 100vw, 288px"
          className="object-cover"
        />

        {/* Badge Overlay di pojok kiri atas gambar: Kategori Olahraga & Status Verifikasi */}
        <div className="absolute left-3 top-3 flex gap-2">
          {/* Badge Kategori Olahraga (misal: "Padel", "Futsal") */}
          <Badge className="bg-slate-900 text-white hover:bg-slate-900">
            {venue.sportTag}
          </Badge>

          {/* Badge Mitra Terverifikasi dengan ikon centang perisai */}
          <Badge className="gap-1 bg-emerald-700 text-white hover:bg-emerald-700">
            <ShieldCheck className="size-3" />
            {venue.verifiedTag}
          </Badge>
        </div>

        {/* Badge Overlay Rating & Ulasan di pojok kiri bawah dengan efek kaca (backdrop-blur).
            Disembunyikan kalau venue belum punya ulasan. */}
        {venue.reviewCount > 0 && (
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-md bg-white/90 px-2 py-1 text-xs font-semibold backdrop-blur-sm">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            {venue.rating.toFixed(1)}
            <span className="font-normal text-muted-foreground">
              ({venue.reviewCount} reviews)
            </span>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Bagian Informasi & Detail Venue                                     */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Header Nama Venue, Alamat, Jarak, dan Tombol Favorit */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">{venue.name}</h3>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />
              {venue.address}
              {venue.distanceKm > 0 && <> • {venue.distanceKm} km</>}
            </p>
          </div>

          {/* Tombol Simpan/Favorit (Wishlist) */}
          <button
            type="button"
            aria-label="Save venue"
            className="shrink-0 text-slate-400 hover:text-rose-500"
          >
            <Heart className="size-5" />
          </button>
        </div>

        {/* Spesifikasi Lapangan: Dipisahkan oleh titik (bullet), item terakhir diberi highlight warna hijau */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-md bg-slate-50 px-3 py-2 text-xs">
          {venue.specs.map((spec, i) => (
            <span key={spec} className="flex items-center gap-2">
              {i > 0 && <span className="text-slate-300">•</span>}
              <span
                className={
                  i === venue.specs.length - 1
                    ? "font-medium text-emerald-700"
                    : "text-slate-600"
                }
              >
                {spec}
              </span>
            </span>
          ))}
        </div>

        {/* Daftar Fasilitas & Sarana Venue (Shower, AC Lounge, Free Parking, dll.) */}
        <div className="flex flex-wrap gap-1.5">
          {venue.facilities.map((f) => (
            <Badge key={f} variant="secondary" className="text-[10px] font-normal">
              {f}
            </Badge>
          ))}
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* Footer Card: Jadwal Slot Terdekat, Harga Sewa, dan Tombol Navigasi  */}
        {/* ------------------------------------------------------------------- */}
        <div className="mt-auto flex flex-col gap-3 border-t pt-3 md:flex-row md:items-end md:justify-between">
          {/* Informasi Ketersediaan Slot & Tarif Per Jam */}
          <div>
            {/* Slot waktu bermain terdekat yang siap dipesan */}
            <p className="flex items-center gap-1 text-xs font-medium text-emerald-700">
              <span className="size-1.5 rounded-full bg-emerald-600" />
              Next Available: {venue.nextAvailable}
            </p>

            {/* Tarif mulai dari per jam dalam format mata uang Rupiah */}
            <p className="text-sm">
              Starts at{" "}
              <span className="text-base font-bold">
                {formatRupiah(venue.pricePerHour)}
              </span>
              <span className="text-xs text-muted-foreground">/hr</span>
            </p>
          </div>

          {/* Tombol Aksi Navigasi */}
          <div className="flex gap-2">
            {/* Tombol Lihat Detail Lapangan Venue */}
            <Button
              nativeButton={false}
              variant="outline"
              render={<Link href={`/venues/${venue.slug}`}>View Courts</Link>}
            />

            {/* Tombol Booking Instan */}
            <Button
              nativeButton={false}
              className="bg-emerald-700 hover:bg-emerald-800"
              render={
                <Link href={`/venues/${venue.slug}/book`}>
                  <Zap className="size-4" />
                  Instant Book
                </Link>
              }
            />
          </div>
        </div>
      </div>
    </Card>
  );
}