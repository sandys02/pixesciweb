import { ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"

import type { MarketingPageData, PageSection } from "@/content/pages"
import { complianceDisclaimer } from "@/content/site"
import { cn } from "@/lib/utils"

import { CTASection } from "@/components/site/cta-section"
import { DemoBookingLink } from "@/components/site/demo-booking-link"
import { Button } from "@/components/ui/button"
import { demoBookingUrl } from "@/content/site"
import {
  ArchitectureDiagram,
  AuditTimeline,
  CatalogVisual,
  ExecutionConsole,
  TemplateVisual,
  WorkflowVisual,
} from "@/components/visuals"

import { FeatureGrid } from "./feature-grid"

function SectionVisual({ visual }: Pick<PageSection, "visual">) {
  switch (visual) {
    case "workflow":
      return <WorkflowVisual compact />
    case "audit":
      return <AuditTimeline />
    case "architecture":
      return <ArchitectureDiagram />
    case "catalog":
      return <CatalogVisual />
    case "console":
      return <ExecutionConsole />
    case "templates":
      return <TemplateVisual />
    default:
      return null
  }
}

type MarketingPageProps = {
  data: MarketingPageData
  disclaimer?: boolean
}

export function MarketingPage({ data, disclaimer }: MarketingPageProps) {
  return (
    <>
      <main>
        <section className="hero-grid border-b border-border">
          <div className="site-container py-18 sm:py-24 lg:py-28">
            <div className="max-w-4xl">
              <p className="eyebrow">{data.eyebrow}</p>
              <h1 className="mt-5 text-4xl leading-[1.05] font-semibold sm:text-6xl lg:text-7xl">
                {data.title}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                {data.description}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="px-4">
                  {data.primaryHref === demoBookingUrl ? (
                    <DemoBookingLink source={`${data.eyebrow}_hero`}>
                      {data.primaryCta}
                      <ArrowRight className="size-4" />
                    </DemoBookingLink>
                  ) : (
                    <Link href={data.primaryHref}>
                      {data.primaryCta}
                      <ArrowRight className="size-4" />
                    </Link>
                  )}
                </Button>
                <Button asChild size="lg" variant="outline" className="px-4">
                  <Link href={data.secondaryHref}>{data.secondaryCta}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {data.sections.map((section, index) => (
          <section
            key={section.title}
            className={cn(
              "section-space border-b border-border",
              section.dark && "dark-surface border-white/10 text-white"
            )}
          >
            <div className="site-container">
              <div
                className={cn(
                  "grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16",
                  section.layout === "stacked" && "lg:grid-cols-1 lg:gap-10",
                  section.layout !== "stacked" &&
                    index % 2 === 1 &&
                    "lg:[&>*:first-child]:order-2"
                )}
              >
                <div>
                  {section.eyebrow ? (
                    <p
                      className={cn("eyebrow", section.dark && "text-cyan-300")}
                    >
                      {section.eyebrow}
                    </p>
                  ) : null}
                  <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                    {section.title}
                  </h2>
                  <div
                    className={cn(
                      "mt-5 space-y-4 text-base leading-7 text-muted-foreground",
                      section.dark && "text-white/62"
                    )}
                  >
                    {(Array.isArray(section.description)
                      ? section.description
                      : [section.description]
                    ).map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  {section.bullets ? (
                    <ul className="mt-7 space-y-3">
                      {section.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className={cn(
                            "flex gap-3 text-sm leading-6 text-muted-foreground",
                            section.dark && "text-white/62"
                          )}
                        >
                          <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <div>
                  {section.visual ? (
                    <SectionVisual visual={section.visual} />
                  ) : section.features ? (
                    <FeatureGrid
                      items={section.features}
                      dark={section.dark}
                      columns={section.layout === "stacked" ? 3 : 2}
                    />
                  ) : null}
                </div>
              </div>
              {section.visual && section.features ? (
                <div className="mt-10">
                  <FeatureGrid
                    items={section.features}
                    dark={section.dark}
                    columns={3}
                  />
                </div>
              ) : null}
            </div>
          </section>
        ))}

        {disclaimer ? (
          <aside className="border-b border-border bg-amber-50/60">
            <div className="site-container py-6 text-sm leading-6 text-amber-950/70">
              <strong className="font-semibold text-amber-950">
                Validation responsibility:
              </strong>{" "}
              {complianceDisclaimer}
            </div>
          </aside>
        ) : null}
      </main>
      <CTASection
        title={data.finalTitle}
        description={data.finalDescription}
        cta={data.finalCta}
      />
    </>
  )
}
