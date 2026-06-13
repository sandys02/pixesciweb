import { ArrowRight } from "lucide-react"
import Link from "next/link"

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
  href = "/contact",
}: CTASectionProps) {
  return (
    <section className="border-t border-border bg-foreground text-background">
      <div className="site-container grid gap-8 py-16 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-3xl">
          <p className="eyebrow text-cyan-300">Workflow mapping</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-background/65">
            {description}
          </p>
        </div>
        <Link
          href={href}
          className="button w-fit border-background bg-background text-foreground hover:bg-background/90"
        >
          {cta}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}
