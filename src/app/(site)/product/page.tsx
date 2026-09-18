import type { Metadata } from "next"

import { JsonLd } from "@/components/seo/json-ld"
import { ProductPage } from "@/components/sections/product-page"
import { createMetadata, softwareApplicationJsonLd } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "The PixeSci Platform",
  description:
    "One governed platform behind the Quality Unit: agentic compliance monitoring, workflow automation, and regulated modules for Laboratory, Quality, Materials, Manufacturing, Equipment, and Documents.",
  path: "/product",
})

export default function Page() {
  return (
    <>
      <JsonLd data={softwareApplicationJsonLd} />
      <ProductPage />
    </>
  )
}
