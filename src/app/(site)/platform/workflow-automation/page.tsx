import type { Metadata } from "next"

import { WorkflowAutomationPage } from "@/components/sections/workflow-automation-page"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Workflow Automation Software",
  description:
    "Describe the work in plain language, review the steps, run the workflow locally, and track every file, decision, and result.",
  path: "/platform/workflow-automation",
})

export default function Page() {
  return <WorkflowAutomationPage />
}
