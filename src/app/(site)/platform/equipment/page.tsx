import type { Metadata } from "next"

import { MarketingPage } from "@/components/sections/marketing-page"
import { equipmentPage } from "@/content/pages"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Equipment Calibration & Qualification Software",
  description:
    "Track equipment qualification, calibration, preventive maintenance, and retirement for every asset, with automatic out-of-tolerance investigations.",
  path: "/platform/equipment",
})

export default function Page() {
  return <MarketingPage data={equipmentPage} disclaimer />
}
