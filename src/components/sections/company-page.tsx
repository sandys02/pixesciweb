import { ArrowRight, Crosshair, Layers3, Map, ShieldCheck } from "lucide-react"

import { CTASection } from "@/components/site/cta-section"
import { DemoBookingLink } from "@/components/site/demo-booking-link"
import { Button } from "@/components/ui/button"

const thesis = [
  {
    title: "Keep using the tools that work.",
    description:
      "PixeSci does not replace every scientific app. It connects them and runs work across them.",
    icon: Layers3,
  },
  {
    title: "Run inside your own environment.",
    description:
      "Run PixeSci locally or on your own servers without depending on an outside cloud service.",
    icon: ShieldCheck,
  },
  {
    title: "Save the details needed to repeat the work.",
    description:
      "Keep files and results with their settings, versions, users, steps, changes, and reviews.",
    icon: Crosshair,
  },
] as const

export function CompanyPage() {
  return (
    <>
      <main>
        <section className="hero-grid border-b border-border">
          <div className="site-container py-18 sm:py-24 lg:py-28">
            <div className="max-w-5xl">
              <p className="eyebrow">Company</p>
              <h1 className="mt-5 text-4xl leading-[1.05] font-semibold sm:text-6xl lg:text-7xl">
                Connecting the scientific tools your lab already uses.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                PixeSci is compliance-first AI agent that connects and automates
                QC software and workflows in regulated biotech, replacing hours
                of manual cross-system work with simple natural language
                commands. <br />
                Tell it what you want to do in your own words, review the steps,
                and track compliance work throughout the experiment.
              </p>
              <Button asChild size="lg" className="mt-8 px-4">
                <DemoBookingLink source="company_hero">
                  Contact PixeSci
                  <ArrowRight className="size-4" />
                </DemoBookingLink>
              </Button>
            </div>
          </div>
        </section>

        <section className="section-space border-b border-border">
          <div className="site-container">
            <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-16">
              <div>
                <Map className="size-5 text-primary" />
                <h2 className="mt-5 text-3xl leading-tight font-semibold sm:text-4xl">
                  What we believe
                </h2>
              </div>
              <div className="grid border-t border-l border-border">
                {thesis.map((item) => {
                  const Icon = item.icon
                  return (
                    <article
                      key={item.title}
                      className="grid gap-5 border-r border-b border-border p-6 sm:grid-cols-[auto_1fr] sm:p-8"
                    >
                      <Icon className="size-5 text-primary" />
                      <div>
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="section-space dark-surface border-b border-white/10 text-white">
          <div className="site-container grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="eyebrow text-cyan-300">Who we serve first</p>
              <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                Teams that need clear control and records.
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                [
                  "Regulated life sciences",
                  "Connect QC, development, manufacturing, lab IT, and quality review work.",
                ],
                [
                  "Secure research",
                  "Connect local software, HPC, and internal data in secure research environments.",
                ],
                [
                  "Core facilities",
                  "Help shared instrument and analysis teams run the same process each time.",
                ],
                [
                  "Scientific software operations",
                  "Help technical teams manage software setup, local deployment, and reliable workflows.",
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
        title="Map your scientific workflow."
        description="Show us where tools, files, and reviews disconnect. We will show how PixeSci can automate the handoffs and track the work."
        cta="Contact PixeSci"
      />
    </>
  )
}
