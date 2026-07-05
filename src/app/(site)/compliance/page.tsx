import type { Metadata } from "next"

import { MarketingPage } from "@/components/sections/marketing-page"
import { compliancePage } from "@/content/pages"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Track compliance throughout scientific work",
  description:
    "Track users, actions, files, settings, changes, approvals, and results throughout each experiment.",
  path: "/compliance",
})

export default function Page() {
  return <MarketingPage data={compliancePage} disclaimer />
}
