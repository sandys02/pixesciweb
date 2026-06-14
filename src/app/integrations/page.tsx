import type { Metadata } from "next"

import { IntegrationsPage } from "@/components/sections/integrations-page"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Scientific software integrations",
  description:
    "Connect the scientific software your team already uses and automate manual handoffs between analysis, lab systems, reporting, AI, imaging, and omics tools.",
  path: "/integrations",
})

export default function Page() {
  return <IntegrationsPage />
}
