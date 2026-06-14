import { ArrowRight, CheckCircle2, Search, Workflow } from "lucide-react"
import Link from "next/link"

import { capabilityFields, integrationCategories } from "@/content/integrations"

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
                You should not have to move results by hand, rebuild the same
                reports, or lose context every time work crosses applications.
                See the software categories teams can connect into reviewable,
                reusable workflows.
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
                  See your tools working together before the run starts.
                </h2>
                <p className="mt-5 text-base leading-7 text-muted-foreground">
                  Check supported software, required inputs, expected outputs,
                  review points, and local availability. Give operators enough
                  context to run the same process without rebuilding it from
                  memory.
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
                  Move work across applications without manual handoffs.
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
                    <Workflow className="size-4 shrink-0 text-primary" />
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
                      {category.workflow}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {category.outcomes.map((outcome) => (
                        <span
                          key={outcome}
                          className="rounded-md bg-primary/10 px-2 py-1 text-[10px] text-primary"
                        >
                          {outcome}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-space dark-surface border-b border-white/10 text-white">
          <div className="site-container max-w-4xl">
            <p className="eyebrow text-cyan-300">Workflow outcomes</p>
            <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
              Talk to your lab in natural language!
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-white/62">
              Describe the work you need, review the proposed steps, run the
              workflow where your software and data already live, and keep the
              files, decisions, and results together for review.
            </p>
          </div>
        </section>
      </main>
      <CTASection
        title="See your tools working together."
        description="Bring the software, files, manual transfers, and review steps that slow your team down."
        cta="Request a demo"
      />
    </>
  )
}
