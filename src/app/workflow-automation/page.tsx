import type { Metadata } from "next"

import { MarketingPage } from "@/components/sections/marketing-page"
import { workflowAutomationPage } from "@/content/pages"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Automate scientific workflows in plain language",
  description:
    "Describe the work in your own words, review the steps, run the workflow locally, and save every file, decision, and result.",
  path: "/workflow-automation",
})

export default function Page() {
  return <MarketingPage data={workflowAutomationPage} />
}
