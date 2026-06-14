import type { Metadata } from "next"

import { JsonLd } from "@/components/seo/json-ld"
import {
  resourceFaqs,
  ResourcesPage,
} from "@/components/sections/resources-page"
import { createFaqJsonLd, createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Scientific workflow orchestration resources",
  description:
    "Architecture, compliance, workflow automation, integration, security, and data integrity resources for evaluating Pixesci.",
  path: "/resources",
})

export default function Page() {
  return (
    <>
      <JsonLd data={createFaqJsonLd(resourceFaqs)} />
      <ResourcesPage />
    </>
  )
}
