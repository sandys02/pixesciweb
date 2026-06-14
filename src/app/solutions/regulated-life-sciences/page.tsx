import type { Metadata } from "next"

import { MarketingPage } from "@/components/sections/marketing-page"
import { regulatedPage } from "@/content/pages"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Regulated life sciences workflow automation",
  description:
    "Standardize QC, analytical development, and R&D software handoffs with local execution, OOS and OOR context, audit history, and reviewable evidence.",
  path: "/solutions/regulated-life-sciences",
})

export default function Page() {
  return <MarketingPage data={regulatedPage} disclaimer />
}
