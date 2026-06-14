import type { Metadata } from "next"

import { MarketingPage } from "@/components/sections/marketing-page"
import { regulatedPage } from "@/content/pages"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Regulated life sciences workflow automation",
  description:
    "Connect QC and R&D software, automate handoffs, and track actions, changes, reviews, and results.",
  path: "/solutions/regulated-life-sciences",
})

export default function Page() {
  return <MarketingPage data={regulatedPage} disclaimer />
}
