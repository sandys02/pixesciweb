import { ArrowRight, Crosshair, Layers3, Map, ShieldCheck } from "lucide-react"
import Link from "next/link"

import { CTASection } from "@/components/site/cta-section"

const thesis = [
  {
    title: "Scientific tools should stay specialized.",
    description:
      "The missing layer is not another monolithic suite. It is a system that can describe, connect, and execute work across existing tools.",
    icon: Layers3,
  },
  {
    title: "The runtime should fit controlled infrastructure.",
    description:
      "Local and on-prem operation should be an architectural default, not an exception layered onto a hosted control plane.",
    icon: ShieldCheck,
  },
  {
    title: "Reproducibility requires execution context.",
    description:
      "Files and final results are insufficient without parameters, versions, identities, events, transformations, and review decisions.",
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
              <h1 className="mt-5 text-4xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
                Building the missing execution layer between scientific tools.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                PixeSci is compliance-first AI agent that connects and automates QC software and workflows in regulated biotech, replacing hours of manual cross-system work with simple natural language commands.
              </p>

              <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                Pixesci exists to make fragmented scientific software work as a
                reproducible, local-first system without forcing teams to
                replace the tools that define their domain.
              </p>
              <Link
                href="/contact"
                className="button button-primary mt-8 w-fit"
              >
                Contact Pixesci
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="section-space border-b border-border">
          <div className="site-container">
            <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-16">
              <div>
                <Map className="size-5 text-primary" />
                <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl">
                  Our product thesis
                </h2>
              </div>
              <div className="grid border-l border-t border-border">
                {thesis.map((item) => {
                  const Icon = item.icon
                  return (
                    <article
                      key={item.title}
                      className="grid gap-5 border-b border-r border-border p-6 sm:grid-cols-[auto_1fr] sm:p-8"
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

        <section className="section-space border-b border-white/10 dark-surface text-white">
          <div className="site-container grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="eyebrow text-cyan-300">Initial market focus</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
                High-control scientific environments first.
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                [
                  "Regulated life sciences",
                  "QC, analytical development, manufacturing sciences, lab IT, and quality review.",
                ],
                [
                  "Secure research",
                  "National labs, physical sciences, computational research, HPC, and internal repositories.",
                ],
                [
                  "Core facilities",
                  "Shared instrumentation and analysis teams standardizing repeatable pipelines.",
                ],
                [
                  "Scientific software operations",
                  "Technical teams responsible for capability profiles, local deployment, and workflow reliability.",
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
        title="Talk with the team building scientific workflow infrastructure."
        description="Start with the software handoffs, deployment boundaries, and reproducibility problems your team needs to solve."
        cta="Contact Pixesci"
      />
    </>
  )
}
