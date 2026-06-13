import { MarketingPage } from "@/components/sections/marketing-page"
import { compliancePage } from "@/content/pages"
import { createMetadata } from "@/lib/seo"

export const metadata = createMetadata({
  title: "Scientific workflow compliance and data integrity",
  description:
    "Support ALCOA-oriented data integrity and reviewable execution with audit trails, metadata, attribution, checksums, checkpoints, and local deployment.",
  path: "/compliance",
})

export default function Page() {
  return <MarketingPage data={compliancePage} disclaimer />
}
