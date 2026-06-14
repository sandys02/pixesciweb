import type { Metadata } from "next"

import { CompanyPage } from "@/components/sections/company-page"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "About PixeSci",
  description:
    "PixeSci connects and automates scientific software while helping labs track actions, files, reviews, and results.",
  path: "/company",
})

export default function Page() {
  return <CompanyPage />
}
