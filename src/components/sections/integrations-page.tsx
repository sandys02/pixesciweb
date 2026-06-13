import { ArrowRight, CheckCircle2, Search, SlidersHorizontal } from "lucide-react"
import Link from "next/link"

import {
  adapterChannels,
  capabilityFields,
  integrationCategories,
} from "@/content/integrations"

import { CTASection } from "@/components/site/cta-section"

export function IntegrationsPage() {
  return (
    <>
      <main>
        <section className="hero-grid border-b border-border">
          <div className="site-container py-18 sm:py-24 lg:py-28">
            <div className="max-w-4xl">
              <p className="eyebrow">Integrations</p>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
                Capability profiles for the scientific software you already use.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                Pixesci models software through requirements, formats, setup,
                execution channels, risk, and user-input needs. The examples
                below describe the target ecosystem, not a claim that every
                connector is production-ready.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="button button-primary">
                  Ask about your software stack
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/workflow-automation"
                  className="button button-secondary"
                >
                  See workflow automation
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section-space border-b border-border">
          <div className="site-container">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
              <div>
                <p className="eyebrow">Catalog model</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
                  Catalog metadata and local detection stay separate.
                </h2>
                <p className="mt-5 text-base leading-7 text-muted-foreground">
                  Shared profiles describe a tool and its capabilities. A local
                  overlay reports whether software is installed, detected, or
                  needs workstation-specific setup. Setup guides and supported
                  workflow definitions turn vendor documentation and
                  analyst-specific knowledge into reusable onboarding context,
                  reducing the effort required to introduce or replace a tool.
                </p>
              </div>
              <div className="grid border-l border-t border-border sm:grid-cols-2">
                {capabilityFields.map((field) => (
                  <div
                    key={field}
                    className="flex min-h-20 items-center gap-3 border-b border-r border-border p-4 text-sm"
                  >
                    <CheckCircle2 className="size-4 shrink-0 text-primary" />
                    {field}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-space border-b border-border bg-muted/25">
          <div className="site-container">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-3xl">
                <p className="eyebrow">Integration matrix</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
                  Scientific categories, representative tools, and possible
                  orchestration paths.
                </h2>
              </div>
              <div
                className="flex w-full max-w-sm items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground"
                aria-label="Static search preview"
              >
                <Search className="size-4" />
                Search preview
                <span className="ml-auto font-mono text-[9px]">UI only</span>
              </div>
            </div>
            <div className="mt-10 grid border-l border-t border-border lg:grid-cols-2">
              {integrationCategories.map((category) => (
                <article
                  key={category.name}
                  className="border-b border-r border-border bg-background p-6 sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-base font-semibold">{category.name}</h3>
                    <SlidersHorizontal className="size-4 shrink-0 text-primary" />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {category.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {category.examples.map((example) => (
                      <span
                        key={example}
                        className="rounded-md border border-border bg-muted/40 px-2 py-1 text-[10px]"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 border-t border-border pt-5">
                    <p className="font-mono text-[10px] leading-5 text-muted-foreground">
                      {category.pipeline}
                    </p>
                    <p className="mt-3 text-[10px] leading-5 text-muted-foreground">
                      Channels: {category.channels.join(" · ")}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-space border-b border-white/10 dark-surface text-white">
          <div className="site-container grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <div>
              <p className="eyebrow text-cyan-300">Adapter channels</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
                Use the integration mechanism each tool actually supports.
              </h2>
              <p className="mt-5 text-base leading-7 text-white/62">
                A capability profile can expose one or more channels and flag
                GUI, user-input, or risk requirements before a node is added to
                the workflow.
              </p>
            </div>
            <div className="grid border-l border-t border-white/10 sm:grid-cols-2">
              {adapterChannels.map((channel, index) => (
                <div
                  key={channel}
                  className="border-b border-r border-white/10 p-5"
                >
                  <span className="font-mono text-[9px] text-cyan-300">
                    0{index + 1}
                  </span>
                  <p className="mt-5 text-sm text-white/75">{channel}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <CTASection
        title="Bring your actual scientific software stack."
        description="We will identify likely capability channels, setup needs, local constraints, human checkpoints, and integration gaps."
        cta="Ask about your software stack"
      />
    </>
  )
}
