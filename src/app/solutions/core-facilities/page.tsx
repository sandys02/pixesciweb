import { MarketingPage } from "@/components/sections/marketing-page"
import { coreFacilitiesPage } from "@/content/pages"
import { createMetadata } from "@/lib/seo"

export const metadata = createMetadata({
  title: "Core facility workflow standardization",
  description:
    "Turn proven acquisition, analysis, review, and reporting procedures into reusable local scientific workflow templates.",
  path: "/solutions/core-facilities",
})

export default function Page() {
  return <MarketingPage data={coreFacilitiesPage} />
}
