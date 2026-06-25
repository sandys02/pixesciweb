import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { demoBookingUrl } from "@/content/site"

import { TrademarkText } from "./brand-name"
import { DemoBookingLink } from "./demo-booking-link"

type CTASectionProps = {
  title: string
  description: string
  cta?: string
  href?: string
}

export function CTASection({
  title,
  description,
  cta = "Request a demo",
  href = demoBookingUrl,
}: CTASectionProps) {
  return (
    <section className="border-t border-border bg-foreground text-background">
      <div className="site-container grid gap-8 py-16 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-3xl">
          <p className="eyebrow text-cyan-300">Workflow mapping</p>
          <h2 className="mt-4 text-3xl leading-tight font-semibold sm:text-4xl">
            <TrademarkText text={title} />
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-background/65">
            <TrademarkText text={description} />
          </p>
        </div>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="w-fit border-background bg-background px-4 text-foreground hover:bg-background/90 hover:text-foreground"
        >
          {href === demoBookingUrl ? (
            <DemoBookingLink source="section_cta">
              {cta}
              <ArrowRight className="size-4" />
            </DemoBookingLink>
          ) : (
            <Link href={href}>
              {cta}
              <ArrowRight className="size-4" />
            </Link>
          )}
        </Button>
      </div>
    </section>
  )
}
