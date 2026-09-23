"use client"

import * as React from "react"
import {
  BadgeCheck,
  Boxes,
  CheckCircle2,
  FileCog,
  FileText,
  FlaskConical,
  LineChart,
  ShieldCheck,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { TrademarkText } from "@/components/site/brand-name"
import {
  documentsTrainingPage,
  equipmentPage,
  laboratoryPage,
  manufacturingQualityPage,
  materialsProductsPage,
  qualityManagementPage,
  reportsAnalyticsPage,
  type ModulePageData,
} from "@/content/pages"
import { cn } from "@/lib/utils"

import { FeatureGrid } from "./feature-grid"
import { SectionVisual } from "./section-visual"

type CoreModule = {
  id: string
  label: string
  icon: LucideIcon
  data: ModulePageData
}

const coreModules: CoreModule[] = [
  {
    id: "laboratory",
    label: "Laboratory",
    icon: FlaskConical,
    data: laboratoryPage,
  },
  {
    id: "quality-management",
    label: "Quality Management",
    icon: ShieldCheck,
    data: qualityManagementPage,
  },
  {
    id: "materials-products",
    label: "Materials & Products",
    icon: Boxes,
    data: materialsProductsPage,
  },
  {
    id: "manufacturing-quality",
    label: "Manufacturing Quality",
    icon: FileCog,
    data: manufacturingQualityPage,
  },
  {
    id: "equipment",
    label: "Equipment",
    icon: BadgeCheck,
    data: equipmentPage,
  },
  {
    id: "documents-training",
    label: "Documents & Training",
    icon: FileText,
    data: documentsTrainingPage,
  },
  {
    id: "reports-analytics",
    label: "Reports & Analytics",
    icon: LineChart,
    data: reportsAnalyticsPage,
  },
]

function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange)
  return () => window.removeEventListener("hashchange", onChange)
}

const readHash = () => window.location.hash.slice(1)
const readServerHash = () => ""

export function ModuleExplorer() {
  const hash = React.useSyncExternalStore(
    subscribeToHash,
    readHash,
    readServerHash
  )
  const [selected, setSelected] = React.useState<string | null>(null)
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([])

  const hashModuleId = coreModules.some((module) => module.id === hash)
    ? hash
    : null
  const activeId = selected ?? hashModuleId ?? coreModules[0].id

  React.useEffect(() => {
    if (hashModuleId) {
      document.getElementById("quality-core")?.scrollIntoView()
    }
  }, [hashModuleId])

  function select(id: string) {
    setSelected(id)
    window.history.replaceState(null, "", `#${id}`)
  }

  function onKeyDown(event: React.KeyboardEvent, index: number) {
    const last = coreModules.length - 1
    const keys: Record<string, number> = {
      ArrowDown: index === last ? 0 : index + 1,
      ArrowRight: index === last ? 0 : index + 1,
      ArrowUp: index === 0 ? last : index - 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }
    if (!(event.key in keys)) return
    event.preventDefault()
    const next = keys[event.key]
    select(coreModules[next].id)
    tabRefs.current[next]?.focus()
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
      <div
        role="tablist"
        aria-label="Quality Core modules"
        className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible"
      >
        {coreModules.map((module, index) => {
          const Icon = module.icon
          const isActive = module.id === activeId
          return (
            <button
              key={module.id}
              ref={(node) => {
                tabRefs.current[index] = node
              }}
              type="button"
              role="tab"
              id={`tab-${module.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${module.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => select(module.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-md border px-3 py-2.5 text-left text-sm transition-colors lg:w-full",
                isActive
                  ? "border-primary/25 bg-primary/[0.07] font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "size-4 shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
                aria-hidden="true"
              />
              {module.label}
            </button>
          )
        })}
      </div>

      <div>
        {coreModules.map((module) => {
          const isActive = module.id === activeId
          const [first, ...rest] = module.data.sections
          const features = first?.features ?? []
          const alsoCovers = rest.map((section) => section.title)

          return (
            <div
              key={module.id}
              role="tabpanel"
              id={`panel-${module.id}`}
              aria-labelledby={`tab-${module.id}`}
              hidden={!isActive}
            >
              <h3 className="text-2xl leading-tight font-semibold sm:text-3xl">
                <TrademarkText text={module.data.title} />
              </h3>
              <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
                <TrademarkText text={module.data.description} />
              </p>

              {isActive && first?.visual ? (
                <div className="mt-8">
                  <SectionVisual visual={first.visual} />
                </div>
              ) : null}

              {features.length > 0 ? (
                <div className="mt-8">
                  <FeatureGrid items={features} columns={3} />
                </div>
              ) : null}

              {alsoCovers.length > 0 ? (
                <div className="mt-8">
                  <p className="tech-label">Also covers</p>
                  <ul className="mt-3 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                    {alsoCovers.map((title) => (
                      <li
                        key={title}
                        className="flex gap-3 text-sm leading-6 text-muted-foreground"
                      >
                        <CheckCircle2
                          className="mt-1 size-4 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                        <TrademarkText text={title} />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
