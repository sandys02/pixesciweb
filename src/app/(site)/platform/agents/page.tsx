import type { Metadata } from "next"

import { MarketingPage } from "@/components/sections/marketing-page"
import { agenticCompliancePage } from "@/content/pages"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Agentic Compliance Software for Quality Units",
  description:
    "Continuous, deterministic monitoring across your connected systems, a governed AI copilot that recommends but never decides, and a hash-chained audit trail you can verify on demand.",
  path: "/platform/agents",
})

export default function Page() {
  return <MarketingPage data={agenticCompliancePage} disclaimer />
}
