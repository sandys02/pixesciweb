import type { Metadata } from "next"

import { IntegrationsPage } from "@/components/sections/integrations-page"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Scientific software integrations",
  description:
    "Connect scientific software through command lines, APIs, desktop controls, files, and scripts.",
  path: "/integrations",
})

export default function Page() {
  return <IntegrationsPage />
}
