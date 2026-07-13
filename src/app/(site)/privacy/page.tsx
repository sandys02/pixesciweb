import Link from "next/link"
import type { Metadata } from "next"

import { BrandName, TrademarkText } from "@/components/site/brand-name"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Privacy",
  description:
    "Learn what this website measures and how its demo booking link works.",
  path: "/privacy",
})

const sections = [
  {
    title: "Information this website processes",
    paragraphs: [
      "The public marketing pages have no file uploads or contact form. The website also includes gated download access and an organization portal for customer administrators. Those areas process account email addresses, session cookies, organization profile fields, license records, seat records, audit events, and signed activation or license files needed to provide the portal.",
      "PixeSci uses Vercel Web Analytics to count page visits and demo-link clicks. It uses Vercel Speed Insights to measure website speed. These events include the page path, link label, and link location. They do not include names, email addresses, scientific data, or form content.",
      "The portal does not store scientific workflow data, experiment files, local run records, SOP content, endpoint usernames, device inventory, telemetry, or internal deployment topology.",
    ],
  },
  {
    title: "External booking",
    paragraphs: [
      "Demo links open a PixeSci booking page on Cal.com in a new tab. Cal.com and PixeSci process the information you submit there under the notices shown on that page.",
    ],
  },
  {
    title: "Service providers",
    paragraphs: [
      "Vercel hosts this website and measures visits and speed. Cal.com provides scheduling. Each company may process the technical details needed to run its service under its own privacy terms.",
    ],
  },
  {
    title: "Your choices",
    paragraphs: [
      "You can block analytics with browser privacy settings, content blockers, or network tools. The main website content still works when these scripts are blocked.",
      "For privacy questions related to this website, contact PixeSci at hello@pixesci.com.",
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
            What this website measures and how demo booking works.
          </p>
          <p className="mt-5 text-xs text-muted-foreground">
            Last updated July 13, 2026
          </p>
        </div>
      </section>

      <section className="section-space">
        <div className="site-container grid gap-10 lg:grid-cols-[0.55fr_1.45fr] lg:gap-16">
          <div>
            <p className="eyebrow">Website scope</p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              This notice applies to the public <BrandName /> website. Customer
              products and deployments may use separate agreements and notices.
            </p>
          </div>
          <div className="divide-y divide-border border-y border-border">
            {sections.map((section) => (
              <section key={section.title} className="py-7">
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>
                      <TrademarkText text={paragraph} />
                    </p>
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
