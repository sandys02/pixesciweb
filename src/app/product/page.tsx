import { MarketingPage } from "@/components/sections/marketing-page"
import { JsonLd } from "@/components/seo/json-ld"
import { productPage } from "@/content/pages"
import { createMetadata, softwareApplicationJsonLd } from "@/lib/seo"

export const metadata = createMetadata({
  title: "Scientific workflow orchestration platform",
  description:
    "Explore Pixesci workflow canvas, capability catalog, local execution runtime, plain-language planning, run summaries, templates, and audit records.",
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
