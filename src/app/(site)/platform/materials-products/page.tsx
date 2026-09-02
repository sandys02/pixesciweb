import type { Metadata } from "next"

import { MarketingPage } from "@/components/sections/marketing-page"
import { materialsProductsPage } from "@/content/pages"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Materials & Products Inventory Software",
  description:
    "Track material lots, suppliers, and inventory from receipt to release, and finished products from intermediate lot to Certificate of Analysis, with full genealogy.",
  path: "/platform/materials-products",
})

export default function Page() {
  return <MarketingPage data={materialsProductsPage} disclaimer />
}
