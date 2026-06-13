import { MarketingPage } from "@/components/sections/marketing-page"
import { securityPage } from "@/content/pages"
import { createMetadata } from "@/lib/seo"

export const metadata = createMetadata({
  title: "Local-first security and on-prem deployment",
  description:
    "Review Pixesci local desktop architecture, localhost FastAPI runtime, local data and model stores, policy gates, and airgapped operation.",
  path: "/security",
})

export default function Page() {
  return <MarketingPage data={securityPage} />
}
