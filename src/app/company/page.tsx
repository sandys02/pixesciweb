import { CompanyPage } from "@/components/sections/company-page"
import { createMetadata } from "@/lib/seo"

export const metadata = createMetadata({
  title: "About Pixesci",
  description:
    "Pixesci is building the local-first workflow orchestration layer between specialized scientific software for controlled research and regulated laboratories.",
  path: "/company",
})

export default function Page() {
  return <CompanyPage />
}
