import type { Metadata } from "next"

import { MarketingPage } from "@/components/sections/marketing-page"
import { secureResearchPage } from "@/content/pages"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Secure and airgapped scientific workflows",
  description:
    "Orchestrate local software, HPC outputs, internal repositories, and reproducible research without an external cloud control plane.",
  path: "/solutions/secure-research",
})

export default function Page() {
  return <MarketingPage data={secureResearchPage} />
}
