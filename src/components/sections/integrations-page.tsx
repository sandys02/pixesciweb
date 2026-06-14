import {
  ArrowRight,
  CheckCircle2,
  Search,
  SlidersHorizontal,
} from "lucide-react"
import Link from "next/link"

import {
  adapterChannels,
  capabilityFields,
  integrationCategories,
} from "@/content/integrations"

import { CTASection } from "@/components/site/cta-section"
import { DemoBookingLink } from "@/components/site/demo-booking-link"
import { Button } from "@/components/ui/button"

export function IntegrationsPage() {
  return (
    <>
      <main>
        <section className="hero-grid border-b border-border">
          <div className="site-container py-18 sm:py-24 lg:py-28">
            <div className="max-w-4xl">
              <p className="eyebrow">Integrations</p>
              <h1 className="mt-5 text-4xl leading-[1.05] font-semibold sm:text-6xl lg:text-7xl">
                Connect the scientific software you already use.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                PixeSci records what each tool can do, which files it uses, how
                to set it up, and when it needs a person. The examples below
                show the tools we target. They do not mean every connection is
                ready for production.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="px-4">
                  <DemoBookingLink source="integrations_hero">
                    Ask about your software stack
                    <ArrowRight className="size-4" />
                  </DemoBookingLink>
                </Button>
                <Button asChild size="lg" variant="outline" className="px-4">
                  <Link href="/workflow-automation">
                    See workflow automation
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="section-space border-b border-border">
          <div className="site-container">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
              <div>
                <p className="eyebrow">Software catalog</p>
                <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                  Describe each tool, then check where it is installed.
                </h2>
                <p className="mt-5 text-base leading-7 text-muted-foreground">
                  Shared profiles show what a tool can do. A local check shows
                  whether it is installed or needs setup on a workstation. Setup
                  guides turn vendor documents and team knowledge into
                  instructions that others can reuse.
                </p>
              </div>
              <div className="grid border-t border-l border-border sm:grid-cols-2">
                {capabilityFields.map((field) => (
                  <div
                    key={field}
                    className="flex min-h-20 items-center gap-3 border-r border-b border-border p-4 text-sm"
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
                <p className="eyebrow">Software examples</p>
                <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                  See which tools PixeSci can connect and how work can move.
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
            <div className="mt-10 grid border-t border-l border-border lg:grid-cols-2">
              {integrationCategories.map((category) => (
                <article
                  key={category.name}
                  className="border-r border-b border-border bg-background p-6 sm:p-7"
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

        <section className="section-space dark-surface border-b border-white/10 text-white">
          <div className="site-container grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <div>
              <p className="eyebrow text-cyan-300">Ways to connect</p>
              <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                Connect each tool in the way it supports.
              </h2>
              <p className="mt-5 text-base leading-7 text-white/62">
                PixeSci can use command lines, APIs, files, scripts, or desktop
                controls. It shows when a step needs user input or carries more
                risk before you add it to a workflow.
              </p>
            </div>
            <div className="grid border-t border-l border-white/10 sm:grid-cols-2">
              {adapterChannels.map((channel, index) => (
                <div
                  key={channel}
                  className="border-r border-b border-white/10 p-5"
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
        title="Bring the scientific software you use."
        description="We will review how each tool can connect, what setup it needs, and where a person must review the work."
        cta="Ask about your software stack"
      />
    </>
  )
}
