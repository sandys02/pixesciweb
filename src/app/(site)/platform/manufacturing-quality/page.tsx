import type { Metadata } from "next"

import { MarketingPage } from "@/components/sections/marketing-page"
import { manufacturingQualityPage } from "@/content/pages"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Electronic Batch Record (EBR) Software",
  description:
    "Run master batch records, line clearance, dispensing, in-process controls, and QA release with built-in e-signatures and full batch genealogy.",
  path: "/platform/manufacturing-quality",
})

export default function Page() {
  return <MarketingPage data={manufacturingQualityPage} disclaimer />
}
