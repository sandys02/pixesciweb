import type { Metadata } from "next"

import { MarketingPage } from "@/components/sections/marketing-page"
import { JsonLd } from "@/components/seo/json-ld"
import { productPage } from "@/content/pages"
import { createMetadata, softwareApplicationJsonLd } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Connect and automate scientific software",
  description:
    "Talk to your lab! Build visual workflows, run work locally, and track every action, file, setting, and result.",
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
