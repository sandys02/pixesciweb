// @/components/sections/solutions-page.tsx

import { ArrowRight } from "lucide-react"
import Link from "next/link"

import {
  qualityCore,
  solutionProducts,
  type SolutionProduct,
} from "@/content/solutions"
import { complianceDisclaimer } from "@/content/site"
import { cn } from "@/lib/utils"

import { TrademarkText } from "@/components/site/brand-name"
import { CTASection } from "@/components/site/cta-section"
import { DemoBookingLink } from "@/components/site/demo-booking-link"
import { Button } from "@/components/ui/button"

import { FeatureGrid } from "./feature-grid"
import { ModuleExplorer } from "./module-explorer"
import { SectionVisual } from "./section-visual"

const overview = [
  {
    id: qualityCore.id,
    label: qualityCore.label,
    obstacle: qualityCore.obstacle,
    gift: qualityCore.gift,
  },
  ...solutionProducts.map(({ id, label, obstacle, gift }) => ({
    id,
    label,
    obstacle,
    gift,
  })),
]

function ProductSection({
  layer,
  index,
}: {
  layer: SolutionProduct
  index: number
}) {
  const { section } = layer
  const dark = section.dark
  const paragraphs = Array.isArray(section.description)
    ? section.description
    : [section.description]

  return (
    <section
      id={layer.id}
      className={cn(
        "section-space border-b border-border",
        dark
          ? "dark-surface border-white/10 text-white"
          : index % 2 === 0 && "bg-muted/25"
      )}
    >
      <div className="site-container">
        <div
          className={cn(
            "grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16",
            index % 2 === 1 && "lg:[&>*:first-child]:order-2"
          )}
        >
          <div>
            <p className={cn("eyebrow", dark && "text-icy")}>
              {section.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
              <TrademarkText text={section.title} />
            </h2>
            <div
              className={cn(
                "mt-5 space-y-4 text-base leading-7 text-muted-foreground",
                dark && "text-white/62"
              )}
            >
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>
                  <TrademarkText text={paragraph} />
                </p>
              ))}
            </div>
            <Link
              href={layer.href}
              className={cn(
                "mt-7 inline-flex items-center gap-2 text-sm font-medium hover:underline",
                dark ? "text-icy" : "text-primary"
              )}
            >
              {layer.linkLabel}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div>
            {section.visual ? <SectionVisual visual={section.visual} /> : null}
          </div>
        </div>
        {section.features ? (
          <div className="mt-12">
            <FeatureGrid items={section.features} dark={dark} columns={3} />
          </div>
        ) : null}
      </div>
    </section>
  )
}

export function SolutionsPage() {
  return (
    <>
      <main>
        <section className="hero-grid border-b border-border">
          <div className="site-container py-18 sm:py-24 lg:py-28">
            <div className="max-w-4xl">
              <p className="eyebrow">Solutions</p>
              <h1 className="mt-5 text-4xl leading-[1.05] font-semibold sm:text-6xl lg:text-7xl">
                Answer “what happened?” without digging through five systems.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                <TrademarkText text="We connect your instruments, software, and quality systems, run the routine work, watch for problems, and keep the record, so your team can focus on judgment." />
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="px-4">
                  <DemoBookingLink source="solutions_hero">
                    Request a demo
                    <ArrowRight className="size-4" />
                  </DemoBookingLink>
                </Button>
                <Button asChild size="lg" variant="outline" className="px-4">
                  <Link href="/platform/agents">
                    See how you stay in control
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="site-container grid sm:grid-cols-2 lg:grid-cols-4">
            {overview.map((item, index) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={cn(
                  "group block border-b border-border p-6 transition-colors hover:bg-muted/60 last:border-b-0 sm:p-7 lg:border-b-0",
                  index > 0 && "lg:border-l",
                  index % 2 === 1 && "sm:border-l lg:border-l"
                )}
              >
                <p className="tech-label">
                  Product {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-4 flex items-center gap-2 text-base font-semibold">
                  {item.label}
                  <ArrowRight
                    className="size-4 text-primary transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.obstacle}
                </p>
                <p className="mt-2 text-sm leading-6">{item.gift}</p>
              </a>
            ))}
          </div>
        </section>

        <section
          id={qualityCore.id}
          className="section-space border-b border-border"
        >
          <div className="site-container">
            <div className="max-w-3xl">
              <p className="eyebrow">{qualityCore.eyebrow}</p>
              <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                {qualityCore.title}
              </h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
                <TrademarkText text={qualityCore.description} />
              </p>
            </div>
            <div className="mt-12">
              <ModuleExplorer />
            </div>
          </div>
        </section>

        {solutionProducts.map((layer, index) => (
          <ProductSection key={layer.id} layer={layer} index={index} />
        ))}

        <aside className="border-b border-border bg-amber-50/60">
          <div className="site-container py-6 text-sm leading-6 text-amber-950/70">
            <strong className="font-semibold text-amber-950">
              Validation responsibility:
            </strong>{" "}
            {complianceDisclaimer}
          </div>
        </aside>
      </main>
      <CTASection
        title="See it on the workflow that worries you most."
        description="Bring one workflow where evidence is hardest to pull together. We will show you how it looks when it is connected, with your team making every decision."
        cta="Request a demo"
      />
    </>
  )
}
