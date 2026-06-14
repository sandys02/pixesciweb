import type { Metadata } from "next"

import { CompanyPage } from "@/components/sections/company-page"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "About Pixesci",
  description:
    "Pixesci is building compliance-first workflow orchestration between specialized scientific software for controlled research and regulated laboratories.",
  path: "/company",
})

export default function Page() {
  return <CompanyPage />
}
