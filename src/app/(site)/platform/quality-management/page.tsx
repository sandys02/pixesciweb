import type { Metadata } from "next"

import { MarketingPage } from "@/components/sections/marketing-page"
import { qualityManagementPage } from "@/content/pages"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Quality Management System (QMS) Software",
  description:
    "Track deviations, CAPA, nonconformances, complaints, and audits in one hash-chained record system. Generate ALCOA+, Part 11, and validation evidence for your own deployment.",
  path: "/platform/quality-management",
})

export default function Page() {
  return <MarketingPage data={qualityManagementPage} disclaimer />
}
