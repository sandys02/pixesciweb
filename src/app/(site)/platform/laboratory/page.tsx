import type { Metadata } from "next"

import { MarketingPage } from "@/components/sections/marketing-page"
import { laboratoryPage } from "@/content/pages"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Laboratory (LIMS) Software",
  description:
    "Track samples from accessioning to Certificate of Analysis. Chain of custody, worksheets, analyst and quality-unit review, and OOS/OOT investigation gating, run locally.",
  path: "/platform/laboratory",
})

export default function Page() {
  return <MarketingPage data={laboratoryPage} disclaimer />
}
