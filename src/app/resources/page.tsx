import type { Metadata } from "next"

import { JsonLd } from "@/components/seo/json-ld"
import {
  resourceFaqs,
  ResourcesPage,
} from "@/components/sections/resources-page"
import { createFaqJsonLd, createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Scientific workflow guides",
  description:
    "Learn how to connect software, run workflows, protect data, and track scientific work.",
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
