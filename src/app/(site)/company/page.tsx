import type { Metadata } from "next"

import { CompanyPage } from "@/components/sections/company-page"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Connect scientific software for controlled labs",
  description:
    "Connect and automate scientific software while keeping actions, files, reviews, and results ready to inspect.",
  path: "/company",
})

export default function Page() {
  return <CompanyPage />
}
