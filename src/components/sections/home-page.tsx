// @/components/sections/home-page.tsx

import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { qualityCore, solutionProducts } from "@/content/solutions"
import {
  governedAiPrinciples,
  heroMessages,
  painPoints,
  promisedLand,
  proofPoints,
  riskPatterns,
  stakesLosers,
  stakesWinners,
} from "@/content/site"

import { TrademarkText } from "@/components/site/brand-name"
import { CTASection } from "@/components/site/cta-section"
import { DemoBookingLink } from "@/components/site/demo-booking-link"
import { Tagline } from "@/components/site/tagline"
import { Button } from "@/components/ui/button"
import { LabConsole, MetalPlanes } from "@/components/visuals"

import { FeatureGrid } from "./feature-grid"
import { HeroRotator } from "./hero-rotator"
import { RiskCalculator } from "./risk-calculator"

const howWeGetYouThere = [qualityCore, ...solutionProducts]

export function HomePage() {
  return (
    <>
      <main>
        <section className="hero-grid overflow-hidden border-b border-border">
          <MetalPlanes />
          <div className="site-container relative pt-16 pb-16 sm:pb-22 lg:pb-24">
            <div className="grid items-center gap-4 lg:grid-cols-[0.85fr_1.1fr]">
              <div>
                <p className="instrument-strip inline-flex items-center rounded-md border border-silver/70 px-3 py-2 text-xs font-semibold tracking-[0.16em] text-foreground/80 uppercase dark:border-input">
                  <Tagline trademark />
                </p>
                <h1 className="mt-7 text-4xl leading-[1.04] font-semibold md:text-5xl">
                  The autonomous quality control operating system for
                  regulated life sciences.
                </h1>
                <div className="mt-6">
                  <HeroRotator messages={heroMessages} />
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" className="px-4">
                    <DemoBookingLink source="home_hero">
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
              <LabConsole />
            </div>
            <div className="instrument-strip mt-12 grid grid-cols-2 border-t border-l border-silver/60 sm:grid-cols-6 lg:mt-16 dark:border-border">
              {proofPoints.map((point) => (
                <div
                  key={point}
                  className="border-r border-b border-silver/60 px-3 py-4 text-center text-[10px] font-medium tracking-[0.16em] text-muted-foreground uppercase dark:border-border"
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
              <p className="eyebrow">The problem</p>
              <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-5xl">
                You&apos;re stuck in manual and fragmented processes.
              </h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
                Your quality work spans instruments, software, and outside
                partners that were never built to work together, so the gaps
                between them land on you.
              </p>
            </div>
            <div className="mt-10">
              <FeatureGrid items={painPoints} columns={3} />
            </div>
            <div className="dark-surface mt-6 rounded-lg p-6 text-white sm:p-10">
              <p className="eyebrow text-icy">What we do about it</p>
              <h3 className="mt-3 text-2xl leading-tight font-semibold sm:text-4xl">
                We take that off your plate.
              </h3>
              <p className="mt-4 max-w-3xl text-base leading-7 text-white/70 sm:text-lg">
                <TrademarkText text="PixeSci connects your instruments, software, and partners, and runs your routine QC work with your sign-off on every step that matters. Work runs precisely as you approved it, and every action, file, and decision is recorded as it happens. Your team gets complete quality records, an audit trail ready for compliance review, and confidence in every result." />
              </p>
              <Link
                href="/solutions"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-icy hover:underline"
              >
                See how it works
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="section-space border-b border-border bg-muted/25">
          <div className="site-container">
            <div className="max-w-3xl">
              <p className="eyebrow">What&apos;s at stake</p>
              <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                Small evidence gaps become expensive problems, fast.
              </h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
                Without PixeSci, teams rebuild quality evidence after the fact
                and find their gaps at release, audit, or inspection, when
                they cost the most. With it, they carry the evidence through
                the work and find gaps while they&apos;re small.
              </p>
            </div>
            <div className="mt-10 grid overflow-hidden rounded-lg border border-border bg-background lg:grid-cols-2">
              <div className="p-6 sm:p-8">
                <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  Teams that don&apos;t use PixeSci
                </p>
                <ul className="mt-6 space-y-5">
                  {stakesLosers.map((item) => {
                    const Icon = item.icon
                    return (
                      <li key={item.title} className="flex gap-3">
                        <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground/85">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
              <div className="dark-surface p-6 text-white sm:p-8">
                <p className="text-xs font-semibold tracking-[0.12em] text-icy uppercase">
                  Teams that use PixeSci
                </p>
                <ul className="mt-6 space-y-5">
                  {stakesWinners.map((item) => {
                    const Icon = item.icon
                    return (
                      <li key={item.title} className="flex gap-3">
                        <Icon className="mt-0.5 size-4 shrink-0 text-icy" />
                        <div>
                          <p className="text-sm font-medium text-white/85">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-white/55">
                            {item.description}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
            <div className="mt-16 hidden">
              <div className="max-w-3xl">
                <h3 className="text-xl font-semibold sm:text-2xl">
                  What could evidence gaps cost your operation?
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                  <TrademarkText text="Estimate your exposure based on your own operation. These are illustrative scenarios built on PixeSci's own remediation-cost modeling — not predictions, and not a substitute for your own risk assessment." />
                </p>
              </div>
              <div className="mt-6">
                <RiskCalculator />
              </div>
            </div>
          </div>
        </section>

        <section className="section-space border-b border-border">
          <div className="site-container">
            <div className="max-w-3xl">
              <p className="eyebrow">What winning looks like</p>
              <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-5xl">
                Your quality team gets to do the actual quality work again.
              </h2>
            </div>
            <div className="mt-10">
              <FeatureGrid items={promisedLand} columns={3} />
            </div>
          </div>
        </section>

        <section className="section-space border-b border-border bg-muted/25">
          <div className="site-container">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div className="max-w-3xl">
                <p className="eyebrow">How we get you there</p>
                <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                  Four things stand in your way. We clear each one.
                </h2>
              </div>
              <Link
                href="/solutions"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                See how it fits together
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-10 grid border-t border-l border-border bg-background sm:grid-cols-2 lg:grid-cols-4">
              {howWeGetYouThere.map((item) => (
                <Link
                  key={item.id}
                  href={`/solutions#${item.id}`}
                  className="group block border-r border-b border-border p-6 transition-colors hover:bg-muted/60 sm:p-7"
                >
                  <p className="tech-label">The obstacle</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.obstacle}
                  </p>
                  <p className="mt-6 flex items-center gap-2 text-base font-semibold">
                    {item.label}
                    <ArrowRight
                      className="size-4 text-primary transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </p>
                  <p className="mt-2 text-sm leading-6">{item.gift}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section-space border-b border-border">
          <div className="site-container">
            <div className="max-w-3xl">
              <p className="eyebrow">You stay in charge</p>
              <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                <TrademarkText text="PixeSci works for you. You make every decision." />
              </h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
                <TrademarkText text="PixeSci reads, watches, and recommends. It can't approve, close, release, invalidate, or sign a record, and that limit is built into the software, not left to a policy document." />
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
              See how you stay in control
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>

        <section className="section-space border-b border-border bg-muted/25">
          <div className="site-container">
            <div className="max-w-3xl">
              <p className="eyebrow">Sound familiar?</p>
              <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                Recognize any of these?
              </h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
                <TrademarkText text="These are common patterns across regulated labs, described as categories, not as citations to any specific company or inspection. We watch for them continuously, so you can find and fix them early." />
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
      </main>
      <CTASection
        title="See it on the workflow that worries you most."
        description="Bring one workflow where evidence is hardest to pull together. We will show you how it looks when it is connected, with your team making every decision."
        cta="Request a demo"
      />
    </>
  )
}
