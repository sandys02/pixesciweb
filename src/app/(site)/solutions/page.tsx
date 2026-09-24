import type { Metadata } from "next"

import { JsonLd } from "@/components/seo/json-ld"
import { SolutionsPage } from "@/components/sections/solutions-page"
import { createMetadata, softwareApplicationJsonLd } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Solutions",
  description:
    "Four products that connect your lab and keep the record: Quality Core, Integrations, Agentic Automation, and Continuous Quality Monitoring.",
  path: "/solutions",
})

export default function Page() {
  return (
    <>
      <JsonLd data={softwareApplicationJsonLd} />
      <SolutionsPage />
    </>
  )
}
