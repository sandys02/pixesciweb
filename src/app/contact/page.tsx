import { ContactPage } from "@/components/sections/contact-page"
import { createMetadata } from "@/lib/seo"

export const metadata = createMetadata({
  title: "Request a Pixesci demo",
  description:
    "Map your scientific software stack, workflow handoffs, review requirements, and local or on-prem deployment needs with Pixesci.",
  path: "/contact",
})

export default function Page() {
  return <ContactPage />
}
