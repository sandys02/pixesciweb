import type { Metadata } from "next"

import { MarketingPage } from "@/components/sections/marketing-page"
import { JsonLd } from "@/components/seo/json-ld"
import { productPage } from "@/content/pages"
import { createMetadata, softwareApplicationJsonLd } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Connect scientific software and run workflows locally",
  description:
    "Talk to your lab! Describe the work, review the workflow, run it inside your environment, and track every file, setting, decision, and result.",
  path: "/product",
})

export default function Page() {
  return (
    <>
      <JsonLd data={softwareApplicationJsonLd} />
      <MarketingPage data={productPage} />
    </>
  )
}
