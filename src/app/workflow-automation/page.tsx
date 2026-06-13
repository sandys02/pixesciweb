import { MarketingPage } from "@/components/sections/marketing-page"
import { workflowAutomationPage } from "@/content/pages"
import { createMetadata } from "@/lib/seo"

export const metadata = createMetadata({
  title: "Graph-native scientific workflow automation",
  description:
    "Turn plain-language scientific intent into capability-aware graph workflows with variables, files, human review, execution events, summaries, and artifacts.",
  path: "/workflow-automation",
})

export default function Page() {
  return <MarketingPage data={workflowAutomationPage} />
}
