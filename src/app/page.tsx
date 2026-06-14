import type { Metadata } from "next"

import { HomePage } from "@/components/sections/home-page"
import { JsonLd } from "@/components/seo/json-ld"
import { createMetadata, softwareApplicationJsonLd } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Connect and automate scientific software",
  description:
    "Talk to your lab in natural language! Connect scientific software, run workflows locally, and track every action, file, review, and result.",
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
