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
    <section className="dark-surface metal-edge metal-edge-top border-t border-border text-white">
      <div className="site-container grid gap-8 py-16 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-3xl">
          <p className="eyebrow text-icy">Workflow mapping</p>
          <h2 className="mt-4 text-3xl leading-tight font-semibold sm:text-4xl">
            <TrademarkText text={title} />
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
            <TrademarkText text={description} />
          </p>
        </div>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="w-fit border-white/70 px-4 text-[#1f2d3d] hover:text-[#1f2d3d] dark:border-white/70 dark:bg-[image:linear-gradient(180deg,#ffffff,#e2eaf5)] dark:text-[#1f2d3d] dark:hover:bg-[image:linear-gradient(180deg,#ffffff,#d5e0ef)]"
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
