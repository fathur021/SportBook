import { Hero } from "@/components/hero"
import { PopularVenues } from "@/components/popular-venues"
import { SportCategories } from "@/components/sport-categories"
import { sportCategories } from "@/lib/sports"

const page = () => {
  return (
    <div>
        <Hero/>
        <SportCategories categories={sportCategories}/>
        <PopularVenues/>
    </div>
  )
}

export default page
