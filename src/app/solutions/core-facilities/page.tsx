import type { Metadata } from "next"

import { MarketingPage } from "@/components/sections/marketing-page"
import { coreFacilitiesPage } from "@/content/pages"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Standardize core facility workflows",
  description:
    "Connect acquisition, analysis, review, and reporting tools in workflows that every operator can follow.",
  path: "/solutions/core-facilities",
})

export default function Page() {
  return <MarketingPage data={coreFacilitiesPage} />
}
