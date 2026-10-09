import { Container } from "@/components/layout/container";
import { getVenueDetail } from "@/lib/venue-detail";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type bookPageProps = {
  params: Promise<{ slug: string }>;
};

const page = async ({ params }: bookPageProps) => {
  const { slug } = await params;

  const venue = getVenueDetail(slug);

  if (!venue) notFound();

  return (
    <Container className="flex flex-col gap-6 py-6">
      <Link
        href={`/venues/${slug}`}
        className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:underline"
      >
        <ArrowLeft className="size-3.5" />
        back to {venue.name}
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Book {venue.name}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {venue.address} • mulai {venue.pricePerHour.toLocaleString("id-ID")}
          /jam
        </p>
        <section>{venue.rating}</section>
      </div>
    </Container>
  );
};

export default page;
