import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  Crosshair,
  ShieldCheck,
} from "lucide-react"

import { TrademarkText } from "@/components/site/brand-name"
import { CTASection } from "@/components/site/cta-section"
import { DemoBookingLink } from "@/components/site/demo-booking-link"
import { Button } from "@/components/ui/button"

import { FeatureGrid } from "./feature-grid"

const values = [
  {
    title: "Precision",
    description:
      "Every run, result, and change stays exact and tied to its source, so you can trust what you're looking at.",
    icon: Crosshair,
  },
  {
    title: "Confidence",
    description:
      "You go into every review, audit, and release knowing the evidence is already connected.",
    icon: ShieldCheck,
  },
  {
    title: "Quality",
    description:
      "Quality is the job, not a checkbox. We build for the people who protect what their lab makes.",
    icon: BadgeCheck,
  },
  {
    title: "Compliance",
    description:
      "We help you keep records ready for review. Your quality system stays yours: your team decides, validates, and signs.",
    icon: ClipboardCheck,
  },
]

export function CompanyPage() {
  return (
    <>
      <main>
        <section className="hero-grid border-b border-border">
          <div className="site-container py-18 sm:py-24 lg:py-28">
            <div className="max-w-5xl">
              <p className="eyebrow">Company</p>
              <h1 className="mt-5 text-4xl leading-[1.05] font-semibold sm:text-6xl lg:text-7xl">
                Your lab&apos;s tools and partners, working as one.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                You spend too much time moving data between tools and
                rebuilding context for the people who need it. We connect
                the tools, run the routine work with your sign-off, and keep
                the record as it goes. PixeSci is the autonomous quality
                control operating system for regulated life sciences.
              </p>
              <Button asChild size="lg" className="mt-8 px-4">
                <DemoBookingLink source="company_hero">
                  Connect your software
                  <ArrowRight className="size-4" />
                </DemoBookingLink>
              </Button>
            </div>
          </div>
        </section>

        <section className="section-space border-b border-border">
          <div className="site-container">
            <div className="max-w-4xl">
              <p className="eyebrow">Our mission</p>
              <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                Our core mission is to create a{" "}
                <span className="whitespace-nowrap">disease-free</span> world
                by pushing regulated life science companies into autonomous
                quality control.
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
                <TrademarkText text="We start by letting quality teams in regulated life sciences talk to their lab, with every record connected to the work and every decision left to your team." />
              </p>
            </div>
          </div>
        </section>

        <section className="section-space border-b border-border bg-muted/25">
          <div className="site-container">
            <div className="max-w-3xl">
              <p className="eyebrow">Our values</p>
              <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                What we hold ourselves to.
              </h2>
            </div>
            <div className="mt-10">
              <FeatureGrid items={values} columns={3} />
            </div>
          </div>
        </section>

        <section className="section-space dark-surface border-b border-white/10 text-white">
          <div className="site-container grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="eyebrow text-icy">Who we build for</p>
              <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                Small regulated teams with a lot of quality work.
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                [
                  "SMB biomanufacturers",
                  "Small teams running QC and manufacturing with a lot of records to keep straight.",
                ],
                [
                  "Biologics and sterile-product companies",
                  "Where an environmental excursion or a missing record turns into an investigation fast.",
                ],
                [
                  "Quality-heavy biotech startups",
                  "Getting ready for GMP without building a big quality team first.",
                ],
                [
                  "CDMOs and CMOs",
                  "Many clients, systems, and partners to keep in sync at once.",
                ],
                [
                  "Regulated testing organizations",
                  "Every test, instrument, and result tied back to its record.",
                ],
              ].map(([title, description]) => (
                <div key={title} className="border-t border-white/15 pt-5">
                  <h3 className="text-sm font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/55">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <CTASection
        title="Map your QC process."
        description="Show us where your tools, partners, and reviews disconnect. We will show you how to connect them and keep the record."
        cta="Request a demo"
      />
    </>
  )
}
