import type { Metadata } from "next"

import { MarketingPage } from "@/components/sections/marketing-page"
import { documentsTrainingPage } from "@/content/pages"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Document Control & GxP Training Software",
  description:
    "Run SOPs and controlled documents through draft, review, approval, and periodic review, and connect every revision to the training records it requires.",
  path: "/platform/documents-training",
})

export default function Page() {
  return <MarketingPage data={documentsTrainingPage} disclaimer />
}
