import { ContactPage } from "@/components/sections/contact-page"
import { createMetadata } from "@/lib/seo"

export const metadata = createMetadata({
  title: "Request a demo",
  description:
    "Request a Pixesci demo or discuss workflow fit, deployment requirements, evaluation planning, security review, and rollout.",
  path: "/contact",
})

export default function Page() {
  return <ContactPage />
}
