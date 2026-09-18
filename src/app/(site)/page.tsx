import type { Metadata } from "next"

import { HomePage } from "@/components/sections/home-page"
import { JsonLd } from "@/components/seo/json-ld"
import { createMetadata, softwareApplicationJsonLd } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "The agentic compliance operating system",
  description:
    "PixeSci is the agentic compliance operating system for the Quality Unit. Connect the systems you already use, watch for the gaps regulators cite, and carry evidence through the work as it happens.",
  path: "/",
})

export default function Page() {
  return (
    <>
      <JsonLd data={softwareApplicationJsonLd} />
      <HomePage />
    </>
  )
}
