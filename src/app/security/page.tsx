import type { Metadata } from "next"

import { MarketingPage } from "@/components/sections/marketing-page"
import { securityPage } from "@/content/pages"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Run scientific workflows inside your environment",
  description:
    "Run PixeSci on workstations or your own servers. Keep data, AI models, software connections, and access under your control.",
  path: "/security",
})

export default function Page() {
  return <MarketingPage data={securityPage} />
}
