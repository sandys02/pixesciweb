import type { Metadata } from "next"

import { HomePage } from "@/components/sections/home-page"
import { JsonLd } from "@/components/seo/json-ld"
import { createMetadata, softwareApplicationJsonLd } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Connect scientific software and run workflows locally",
  description:
    "Talk to your lab! Describe the work, review the workflow, run locally, and track every action, file, review, and result.",
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
