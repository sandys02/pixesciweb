import type { Metadata } from "next"

import { MarketingPage } from "@/components/sections/marketing-page"
import { securityPage } from "@/content/pages"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Local-first security and on-prem deployment",
  description:
    "Review PixeSci local desktop architecture, localhost FastAPI runtime, local data and model stores, policy gates, and airgapped operation.",
  path: "/security",
})

export default function Page() {
  return <MarketingPage data={securityPage} />
}
