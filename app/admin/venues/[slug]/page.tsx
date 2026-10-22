import { getVenueDetail } from "@/lib/venue-detail"
import { notFound } from "next/navigation"

const page = async (props:PageProps<"/venues/[slug]">) => {
    const {slug} = await props.params
    const venue = getVenueDetail(slug)

    if(!venue) notFound()
  return (
    <div>{venue.name}</div>
  )
}

export default page