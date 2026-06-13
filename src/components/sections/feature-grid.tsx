import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type FeatureGridItem = {
  title: string
  description: string
  icon: LucideIcon
}

type FeatureGridProps = {
  items: FeatureGridItem[]
  dark?: boolean
  columns?: 2 | 3
}

export function FeatureGrid({
  items,
  dark,
  columns = 3,
}: FeatureGridProps) {
  return (
    <div
      className={cn(
        "grid border-l border-t",
        dark ? "border-white/10" : "border-border",
        columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3",
      )}
    >
      {items.map((item) => {
        const Icon = item.icon
        return (
          <article
            key={item.title}
            className={cn(
              "min-h-52 border-b border-r p-6 sm:p-7",
              dark ? "border-white/10" : "border-border",
            )}
          >
            <Icon
              className={cn("size-5", dark ? "text-cyan-300" : "text-primary")}
              aria-hidden="true"
            />
            <h3 className="mt-8 text-base font-semibold">{item.title}</h3>
            <p
              className={cn(
                "mt-2 text-sm leading-6 text-muted-foreground",
                dark && "text-white/58",
              )}
            >
              {item.description}
            </p>
          </article>
        )
      })}
    </div>
  )
}
