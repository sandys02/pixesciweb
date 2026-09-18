// @/components/sections/home-page.tsx

import { ArrowRight, CircleDot } from "lucide-react"
import Link from "next/link"

import {
  continuousColumn,
  governedAiPrinciples,
  proofPoints,
  reactiveColumn,
  resourceCards,
  riskPatterns,
  solutionCards,
  whatBreaks,
} from "@/content/site"

import { TrademarkText } from "@/components/site/brand-name"
import { CTASection } from "@/components/site/cta-section"
import { DemoBookingLink } from "@/components/site/demo-booking-link"
import { SignInPortalButton } from "@/components/site/download-pixesci-button"
import { Button } from "@/components/ui/button"
import { ContinuousMonitoringMockup } from "@/components/visuals"

import { FeatureGrid } from "./feature-grid"
import { RiskCalculator } from "./risk-calculator"

export function HomePage() {
  return (
    <>
      <main>
        <section className="hero-grid overflow-hidden border-b border-border">
          <div className="site-container pt-16 pb-16 sm:pb-22 lg:pb-24">
            <div className="grid items-center gap-4 lg:grid-cols-[0.75fr_1.1fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground">
                  <CircleDot className="size-3 text-emerald-500" />
                  Talk to your Lab.™
                </div>
                <h1 className="mt-7 text-4xl leading-[1.04] font-semibold md:text-5xl xl:text-6xl">
                  The agentic compliance operating system for the Quality
                  Unit.
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                  <TrademarkText text="PixeSci connects the instruments, software, and records your Quality Unit already uses, watches for the same gaps regulators cite, and carries evidence through the work as it happens, not reconstructed after the fact." />
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" className="px-4">
                    <DemoBookingLink source="home_hero">
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
              <ContinuousMonitoringMockup />
            </div>
            <div className="mt-12 grid grid-cols-2 border-t border-l border-border sm:grid-cols-6 lg:mt-16">
              {proofPoints.map((point) => (
                <div
                  key={point}
                  className="border-r border-b border-border px-3 py-4 text-center text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase"
                >
                  {point}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-space border-b border-border">
          <div className="site-container">
            <div className="max-w-3xl">
              <p className="eyebrow">Fragmented QC</p>
              <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-5xl">
                Quality is reconstructed after the work instead of being
                carried through it.
              </h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
                Existing systems each solve one function well. Nothing
                governs the workflow end to end — so gaps between systems
                survive long enough to reach review, release, an audit, or an
                inspection.
              </p>
            </div>
            <div className="mt-10">
              <FeatureGrid items={whatBreaks} columns={3} />
            </div>
          </div>
        </section>

        <section className="section-space border-b border-border">
          <div className="site-container">
            <div className="max-w-3xl">
              <p className="eyebrow">A better way</p>
              <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                Move from reconstructing compliance to carrying it through the
                work.
              </h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
                Instead of finding and fixing problems after the fact, keep
                the Quality Unit continuously monitored — the same shift from
                retrospective reconstruction to prospective, continuous
                quality.
              </p>
            </div>
            <div className="mt-10 grid overflow-hidden rounded-lg border border-border lg:grid-cols-2">
              <div className="p-6 sm:p-8">
                <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  Today: reactive and manual
                </p>
                <ul className="mt-6 space-y-5">
                  {reactiveColumn.map((item) => {
                    const Icon = item.icon
                    return (
                      <li key={item.title} className="flex gap-3">
                        <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground/85">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            <TrademarkText text={item.description} />
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
              <div className="dark-surface p-6 text-white sm:p-8">
                <p className="text-xs font-semibold tracking-[0.12em] text-cyan-300 uppercase">
                  <TrademarkText text="With PixeSci: continuous quality" />
                </p>
                <ul className="mt-6 space-y-5">
                  {continuousColumn.map((item) => {
                    const Icon = item.icon
                    return (
                      <li key={item.title} className="flex gap-3">
                        <Icon className="mt-0.5 size-4 shrink-0 text-cyan-300" />
                        <div>
                          <p className="text-sm font-medium text-white/85">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-white/55">
                            <TrademarkText text={item.description} />
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section-space border-b border-border bg-muted/25">
          <div className="site-container">
            <div className="max-w-3xl">
              <p className="eyebrow">Cost of fragmented QC</p>
              <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                What could evidence gaps cost your operation?
              </h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
                <TrademarkText text="Estimate your exposure based on your own operation. These are illustrative scenarios built on PixeSci's own remediation-cost modeling — not predictions, and not a substitute for your own risk assessment." />
              </p>
            </div>
            <div className="mt-10">
              <RiskCalculator />
            </div>
          </div>
        </section>

        <section className="section-space border-b border-border">
          <div className="site-container">
            <div className="max-w-3xl">
              <p className="eyebrow">Governed AI</p>
              <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                The AI recommends. A qualified reviewer decides.
              </h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
                <TrademarkText text="PixeSci's agents read continuously and flag early — but every approval, release, closure, and signature stays with your team, enforced in the software itself, not left to a policy document." />
              </p>
            </div>
            <div className="mt-10">
              <FeatureGrid items={governedAiPrinciples} columns={3} />
            </div>
            <p className="mt-6 max-w-3xl text-xs leading-5 text-muted-foreground">
              Aligned to FDA and EMA good-AI-practice principles: clear
              intended use, proportionate risk management, trustworthy data,
              independent validation, human oversight, defined accountability,
              controlled change management, and auditable records.
            </p>
            <Link
              href="/platform/agents"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              See how the AI is governed
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="site-container flex flex-col items-start gap-3 py-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              <TrademarkText text="PixeSci's agentic compliance layer runs across nine connected modules." />
            </p>
            <Link
              href="/product"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              See every module
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>

        <section className="section-space border-b border-border bg-muted/25">
          <div className="site-container">
            <div className="max-w-3xl">
              <p className="eyebrow">Risk education</p>
              <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                These are the kinds of gaps regulators look for.
              </h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
                <TrademarkText text="These are common finding patterns across regulated labs generally, described as categories, not as citations to any specific company or inspection. PixeSci's compliance agents watch for the same patterns, continuously, across the systems you connect." />
              </p>
            </div>
            <div className="mt-10">
              <FeatureGrid items={riskPatterns} columns={2} />
            </div>
            <p className="mt-6 max-w-3xl text-xs leading-5 text-muted-foreground">
              These categories are illustrative and general to the industry.
              They do not describe any named company, product, or specific
              regulatory action.
            </p>
          </div>
        </section>

        <section className="section-space border-b border-border">
          <div className="site-container">
            <div className="max-w-3xl">
              <p className="eyebrow">Built for controlled scientific work</p>
              <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                Automate work without losing control of data or records.
              </h2>
            </div>
            <div className="mt-10 grid border-t border-l border-border lg:grid-cols-3">
              {solutionCards.map((solution) => {
                const Icon = solution.icon
                return (
                  <article
                    key={solution.href}
                    className="border-r border-b border-border p-6 sm:p-8"
                  >
                    <Icon className="size-5 text-primary" />
                    <h3 className="mt-10 text-lg font-semibold">
                      {solution.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {solution.description}
                    </p>
                    <p className="mt-6 border-t border-border pt-5 font-mono text-[10px] leading-5 text-muted-foreground">
                      {solution.examples}
                    </p>
                    <Link
                      href={solution.href}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      Automate this workflow
                      <ArrowRight className="size-4" />
                    </Link>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="section-space bg-muted/25">
          <div className="site-container">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div className="max-w-2xl">
                <p className="eyebrow">Learn how it works</p>
                <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                  Give technical and quality teams clear information to
                  review.
                </h2>
              </div>
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                View all resources
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-10 grid border-t border-l border-border lg:grid-cols-3">
              {resourceCards.map((resource) => (
                <article
                  key={resource.title}
                  className="border-r border-b border-border p-6 sm:p-8"
                >
                  <p className="eyebrow">{resource.type}</p>
                  <h3 className="mt-8 text-lg font-semibold">
                    {resource.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {resource.description}
                  </p>
                  <Link
                    href={resource.href}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    Read workflow guide
                    <ArrowRight className="size-4" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <CTASection
        title="Show us one workflow where evidence is hardest to reconstruct."
        description="Bring the systems involved and the review it requires. We will show you how PixeSci connects them, watches continuously, and carries the evidence through — with your team approving every step."
        cta="Request a demo"
      />
    </>
  )
}
