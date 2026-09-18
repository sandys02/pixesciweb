// @/components/sections/product-page.tsx

import {
  ArrowRight,
  BrainCircuit,
  ShieldCheck,
  Workflow,
} from "lucide-react"
import Link from "next/link"

import { platformModules } from "@/content/site"

import { TrademarkText } from "@/components/site/brand-name"
import { CTASection } from "@/components/site/cta-section"
import { DemoBookingLink } from "@/components/site/demo-booking-link"
import { Button } from "@/components/ui/button"
import { EnvironmentControls } from "@/components/visuals"

const layers = [
  {
    title: "Agentic compliance",
    description:
      "Continuous, deterministic monitoring and a governed AI copilot that recommends but never decides.",
    href: "/platform/agents",
    icon: BrainCircuit,
  },
  {
    title: "Workflow automation",
    description:
      "Describe the work in plain language, review the steps, and run them locally.",
    href: "/platform/workflow-automation",
    icon: Workflow,
  },
  {
    title: "Regulated modules",
    description:
      "Laboratory, Quality, Materials, Manufacturing, Equipment, Documents & Training, and Reports keep the record.",
    href: "/platform/laboratory",
    icon: ShieldCheck,
  },
] as const

export function ProductPage() {
  return (
    <>
      <main>
        <section className="hero-grid border-b border-border">
          <div className="site-container py-18 sm:py-24 lg:py-28">
            <div className="max-w-4xl">
              <p className="eyebrow">Product</p>
              <h1 className="mt-5 text-4xl leading-[1.05] font-semibold sm:text-6xl lg:text-7xl">
                One governed platform behind the Quality Unit.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                <TrademarkText text="PixeSci is one product: an agentic compliance layer that watches continuously, a workflow engine that runs the work, and nine connected modules that keep the record — all on the same local-first platform." />
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="px-4">
                  <DemoBookingLink source="product_hero">
                    Request a demo
                    <ArrowRight className="size-4" />
                  </DemoBookingLink>
                </Button>
                <Button asChild size="lg" variant="outline" className="px-4">
                  <Link href="/platform/agents">
                    See how the AI is governed
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="section-space border-b border-border">
          <div className="site-container">
            <div className="max-w-3xl">
              <p className="eyebrow">How it fits together</p>
              <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                One record system, three layers.
              </h2>
            </div>
            <div className="mt-10 grid border-t border-l border-border lg:grid-cols-3">
              {layers.map((layer) => {
                const Icon = layer.icon
                return (
                  <article
                    key={layer.href}
                    className="border-r border-b border-border p-6 sm:p-8"
                  >
                    <Icon className="size-5 text-primary" />
                    <h3 className="mt-10 text-lg font-semibold">
                      {layer.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      <TrademarkText text={layer.description} />
                    </p>
                    <Link
                      href={layer.href}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      Learn more
                      <ArrowRight className="size-4" />
                    </Link>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="section-space border-b border-border bg-muted/25">
          <div className="site-container">
            <div className="max-w-3xl">
              <p className="eyebrow">Platform</p>
              <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                Every module, in one place.
              </h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground">
                <TrademarkText text="PixeSci's agentic compliance layer watches across every module below — see what's built." />
              </p>
            </div>
            <div className="mt-10 grid border-t border-l border-border sm:grid-cols-2 lg:grid-cols-3">
              {platformModules.map((item) => {
                const Icon = item.icon
                return (
                  <article
                    key={item.href}
                    className="border-r border-b border-border bg-background p-6 sm:p-7"
                  >
                    <Icon className="size-5 text-primary" />
                    <h3 className="mt-8 text-base font-semibold">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      <TrademarkText text={item.description} />
                    </p>
                    <Link
                      href={item.href}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      Learn more
                      <ArrowRight className="size-4" />
                    </Link>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="section-space dark-surface border-b border-white/10 text-white">
          <div className="site-container grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-16">
            <div>
              <p className="eyebrow text-cyan-300">Local-first</p>
              <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                Run the whole platform inside your own environment.
              </h2>
              <p className="mt-5 text-base leading-7 text-white/62">
                Every layer above runs on approved workstations or your own
                servers, without depending on an outside cloud service —
                including the AI.
              </p>
              <Link
                href="/security"
                className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-cyan-300 hover:underline"
              >
                Review deployment controls
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <EnvironmentControls />
          </div>
        </section>
      </main>
      <CTASection
        title="Show us your platform requirements."
        description="Bring the systems, modules, and deployment rules your Quality Unit needs. We will map them into one governed platform."
        cta="Request a demo"
      />
    </>
  )
}
