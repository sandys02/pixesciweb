import type { Metadata } from "next"

import { MarketingPage } from "@/components/sections/marketing-page"
import { compliancePage } from "@/content/pages"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Compliance & Continuous Quality Software",
  description:
    "An orchestration and evidence layer that runs behind your existing systems, watches continuously for the gaps regulators cite, and keeps a hash-chained, independently verifiable record.",
  path: "/compliance",
})

export default function Page() {
  return <MarketingPage data={compliancePage} disclaimer />
}
