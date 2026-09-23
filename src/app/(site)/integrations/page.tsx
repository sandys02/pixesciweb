import type { Metadata } from "next"

import { IntegrationsPage } from "@/components/sections/integrations-page"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Integrations",
  description:
    "Connect the instruments, chromatography data, LIMS, QMS, and environmental systems your team already uses, so nobody rebuilds context between them.",
  path: "/integrations",
})

export default function Page() {
  return <IntegrationsPage />
}
