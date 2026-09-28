import { Hero } from "@/components/home/hero"
import { OwnerCta } from "@/components/home/owner-cta"
import { SportCategories } from "@/components/home/sport-categories"
import { PopularVenues } from "@/components/venues/popular-venues"
import { TrendingSlots } from "@/components/courts/trending-slots"

import { trendingSlots } from "@/lib/slot"
import { sportCategories } from "@/lib/sports"

const page = () => {
  return (
    <div>
        <Hero/>
        <SportCategories categories={sportCategories}/>
        <PopularVenues/>
        <TrendingSlots courts={trendingSlots}/>
        <OwnerCta/>
    </div>
  )
}

export default page
