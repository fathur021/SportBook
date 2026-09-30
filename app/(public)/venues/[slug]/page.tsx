import { notFound } from "next/navigation"

import { getVenueBySlug } from "@/lib/venues"

// PERBAIKAN 1: literal route di PageProps mengikuti nama folder yang benar.
// Sebelumnya '/venus/[slug]' karena folder masih bernama "venus" (kurang satu
// huruf 'e'). Semua link di app menulis /venues/${slug} — lihat
// components/venues/venue-card.tsx dan venue-listing-card.tsx — jadi route
// /venus/[slug] tidak akan pernah bisa diakses.
//
// PERBAIKAN 2: indentasi diubah dari 4 spasi ke 2 spasi sesuai repo.
// PERBAIKAN 3: nama fungsi "getVenueByslug" -> "getVenueBySlug".
//
// Catatan: params WAJIB di-await. Di Next 16 params itu Promise, bukan objek
// biasa. PageProps sendiri adalah global helper hasil generate Next.js di
// .next/types/routes.d.ts, jadi tidak perlu di-import.
const page = async (props: PageProps<"/venues/[slug]">) => {
  const { slug } = await props.params
  const venue = getVenueBySlug(slug)

  if (!venue) notFound()

  // Pakai <div>, bukan <main>, karena app/(public)/layout.tsx sudah menyediakan
  // elemen <main> pembungkus. Pakai <main> lagi di sini akan jadi HTML invalid.
  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold tracking-tight">{venue.name}</h1>
    </div>
  )
}

export default page
