import type { Metadata } from "next"

import { MarketingPage } from "@/components/sections/marketing-page"
import { secureResearchPage } from "@/content/pages"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Automate secure and air-gapped scientific work",
  description:
    "Connect local software, HPC results, and internal data without relying on an outside cloud service.",
  path: "/solutions/secure-research",
})

export default function Page() {
  return <MarketingPage data={secureResearchPage} />
}
