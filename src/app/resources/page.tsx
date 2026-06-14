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
    "Learn how PixeSci connects software, runs workflows, protects data, and tracks scientific work.",
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
