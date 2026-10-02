import { notFound } from "next/navigation"

import { getVenueDetail } from "@/lib/venue-detail"
import { Container } from "@/components/layout/container"
import { VenueHeader } from "@/components/venues/venue-header"

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
  const venue = getVenueDetail(slug)

  if (!venue) notFound()

  // Pakai <Container> supaya lebarnya sama dengan halaman lain. Sebelumnya
  // max-w-5xl (1024px) membuat konten ini terlihat "ke tengah" di monitor
  // lebar, sedangkan --container-page di app/globals.css itu 112rem.
  // <Container> juga sudah menyediakan <main> lewat app/(public)/layout.tsx.
  return (
    <Container className="py-6">
      <VenueHeader venue={venue} />
    </Container>
  )
}

export default page
