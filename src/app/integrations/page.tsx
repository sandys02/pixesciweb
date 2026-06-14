import type { Metadata } from "next"

import { IntegrationsPage } from "@/components/sections/integrations-page"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Scientific software integrations",
  description:
    "Explore scientific software capability profiles, setup guidance, local detection, and CLI, API, GUI, file, and script integration channels.",
  path: "/integrations",
})

export default function Page() {
  return <IntegrationsPage />
}
