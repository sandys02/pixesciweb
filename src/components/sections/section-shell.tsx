import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type SectionShellProps = {
  id?: string
  eyebrow?: string
  title: string
  description?: string
  children?: ReactNode
  dark?: boolean
  className?: string
}

export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  children,
  dark,
  className,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        "section-space border-t border-border",
        dark && "dark-surface border-white/10 text-white",
        className,
      )}
    >
      <div className="site-container">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div>
            {eyebrow ? (
              <p className={cn("eyebrow", dark && "text-cyan-300")}>{eyebrow}</p>
            ) : null}
            <h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">
              {title}
            </h2>
          </div>
          <div>
            {description ? (
              <p
                className={cn(
                  "max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg",
                  dark && "text-white/62",
                )}
              >
                {description}
              </p>
            ) : null}
            {children ? <div className="mt-8">{children}</div> : null}
          </div>
        </div>
      </div>
    </section>
  )
}
