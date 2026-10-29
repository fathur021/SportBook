// Mengimpor handler fungsi controller untuk create dan list courts
import {
  createCourtController,
  getCourtsByVenueController,
} from "@/modules/courts/court.controller";

// Handler HTTP GET: Mengambil seluruh lapangan di bawah satu venue
// Endpoint: GET /api/admin/venues/[slug]/courts
export async function GET(
  _request: Request, // Objek HTTP Request (tidak dipakai langsung di GET ini)
  { params }: { params: Promise<{ slug: string }> }, // Next.js dynamic params berupa Promise
): Promise<Response> {
  const { slug } = await params; // Menunggu Promise params dan mengekstrak parameter slug dari URL
  return getCourtsByVenueController(slug); // Menyerahkan pemrosesan ke controller
}

// Handler HTTP POST: Menambahkan lapangan baru ke dalam venue
// Endpoint: POST /api/admin/venues/[slug]/courts
export async function POST(
  request: Request, // Objek HTTP Request yang membawa payload JSON dari klien
  { params }: { params: Promise<{ slug: string }> }, // Next.js dynamic params
): Promise<Response> {
  const { slug } = await params; // Ekstrak nilai slug dari URL
  return createCourtController(request, slug); // Menyerahkan request dan slug ke controller
}
