import type { Metadata } from "next"

import { CompanyPage } from "@/components/sections/company-page"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Company",
  description:
    "Our core mission is to create a disease-free world by pushing regulated life science companies into autonomous quality control.",
  path: "/company",
})

export default function Page() {
  return <CompanyPage />
}
