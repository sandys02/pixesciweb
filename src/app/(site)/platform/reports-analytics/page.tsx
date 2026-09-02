import type { Metadata } from "next"

import { MarketingPage } from "@/components/sections/marketing-page"
import { reportsAnalyticsPage } from "@/content/pages"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Quality & Compliance Reporting Software",
  description:
    "See open deviations, CAPA, and calibrations across every module in one view. Verify your audit chain, map 21 CFR Part 11 controls, and export inspection-ready evidence.",
  path: "/platform/reports-analytics",
})

export default function Page() {
  return <MarketingPage data={reportsAnalyticsPage} disclaimer />
}
