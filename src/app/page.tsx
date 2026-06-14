import type { Metadata } from "next"

import { HomePage } from "@/components/sections/home-page"
import { JsonLd } from "@/components/seo/json-ld"
import { createMetadata, softwareApplicationJsonLd } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Compliance-first scientific workflow orchestration",
  description:
    "Connect scientific software into traceable workflows with plain-language planning, local execution, capability profiles, audit history, and review checkpoints.",
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
