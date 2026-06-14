import Link from "next/link"
import type { Metadata } from "next"

import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Privacy",
  description:
    "Learn how the Pixesci website uses privacy-conscious traffic measurement, performance monitoring, and external booking services.",
  path: "/privacy",
})

const sections = [
  {
    title: "Information this website processes",
    paragraphs: [
      "This marketing website does not currently provide user accounts, accept file uploads, or operate a contact form. When you browse the site, standard request information may be processed by the hosting platform to deliver pages securely and reliably.",
      "Pixesci uses Vercel Web Analytics to understand page usage and demo-booking conversions, and Vercel Speed Insights to measure real-world website performance. Conversion events contain the page path, CTA label, and CTA location. They are not designed to include names, email addresses, scientific data, or other form content.",
    ],
  },
  {
    title: "External booking",
    paragraphs: [
      "Demo links open a Pixesci booking page hosted by Cal.com in a new browser tab. Information submitted on that page is processed by Cal.com and Pixesci according to the choices and notices shown there.",
    ],
  },
  {
    title: "Service providers",
    paragraphs: [
      "Vercel provides website hosting, traffic analytics, and performance measurement. Cal.com provides scheduling. These providers may process technical information needed to operate their services under their own privacy terms.",
    ],
  },
  {
    title: "Your choices",
    paragraphs: [
      "You can limit analytics through browser privacy controls, content blockers, or network-level tools. Blocking measurement scripts does not prevent access to the website's primary content.",
      "For privacy questions related to this website, contact Pixesci at hello@pixesci.com.",
    ],
  },
] as const

export default function Page() {
  return (
    <main>
      <section className="hero-grid border-b border-border">
        <div className="site-container py-18 sm:py-24">
          <p className="eyebrow">Legal</p>
          <h1 className="mt-5 text-4xl leading-tight font-semibold sm:text-6xl">
            Privacy
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
            How this website measures usage, monitors performance, and connects
            visitors to external scheduling.
          </p>
          <p className="mt-5 text-xs text-muted-foreground">
            Last updated June 14, 2026
          </p>
        </div>
      </section>

      <section className="section-space">
        <div className="site-container grid gap-10 lg:grid-cols-[0.55fr_1.45fr] lg:gap-16">
          <div>
            <p className="eyebrow">Website scope</p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              This notice applies to the public Pixesci marketing website. A
              customer product or deployment may be governed by separate
              agreements and notices.
            </p>
          </div>
          <div className="divide-y divide-border border-y border-border">
            {sections.map((section) => (
              <section key={section.title} className="py-7">
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}

            <section className="py-7">
              <h2 className="text-xl font-semibold">Provider notices</h2>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm">
                <Link
                  href="https://vercel.com/docs/analytics/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  Vercel Web Analytics privacy
                </Link>
                <Link
                  href="https://vercel.com/docs/speed-insights/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  Vercel Speed Insights privacy
                </Link>
                <Link
                  href="https://cal.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  Cal.com privacy
                </Link>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}
