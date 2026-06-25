import {
  CheckCircle2,
  Clock3,
  FileStack,
  Microscope,
  Search,
  ScanSearch,
} from "lucide-react"

import { BrandName } from "@/components/site/brand-name"

const templates = [
  {
    title: "Microscopy quantification",
    category: "Microscopy",
    steps: "6 nodes",
    time: "25 min",
    difficulty: "Intermediate",
    icon: Microscope,
  },
  {
    title: "Flow cytometry review",
    category: "QC",
    steps: "5 nodes",
    time: "15 min",
    difficulty: "Advanced",
    icon: ScanSearch,
  },
  {
    title: "Facility report package",
    category: "Reporting",
    steps: "4 nodes",
    time: "10 min",
    difficulty: "Basic",
    icon: FileStack,
  },
]

export function TemplateVisual() {
  return (
    <figure
      className="visual-frame overflow-hidden"
      aria-label="Illustrative workflow template center with reusable scientific workflow templates"
    >
      {/* TODO: Replace with real PixeSci TM template center screenshot. */}
      <figcaption className="visual-toolbar">
        <span>Template center</span>
        <span className="text-muted-foreground">Published workflow templates</span>
      </figcaption>
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/20 px-4 py-3">
        <div className="flex min-w-44 flex-1 items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-[10px] text-muted-foreground">
          <Search className="size-3" />
          Search templates
        </div>
        {["All", "Quality Control", "Microscopy", "Reporting"].map(
          (category, index) => (
            <span
              key={category}
              className={
                index === 0
                  ? "rounded-md bg-foreground px-2.5 py-1.5 text-[9px] text-background"
                  : "rounded-md px-2.5 py-1.5 text-[9px] text-muted-foreground"
              }
            >
              {category}
            </span>
          ),
        )}
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-3 sm:p-6">
        {templates.map((template, index) => {
          const Icon = template.icon
          return (
            <div
              key={template.title}
              className="rounded-md border border-border bg-background p-5"
            >
              <div className="flex items-center justify-between">
                <Icon className="size-4 text-primary" />
                <span className="font-mono text-[9px] text-muted-foreground">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-10 text-sm font-semibold">{template.title}</h3>
              <p className="mt-2 text-xs text-muted-foreground">
                {template.category}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5 text-[9px] text-muted-foreground">
                <span className="rounded border border-border px-1.5 py-0.5">
                  {template.difficulty}
                </span>
                <span className="rounded border border-border px-1.5 py-0.5">
                  {template.steps}
                </span>
              </div>
              <div className="mt-4 space-y-2 border-t border-border pt-4 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock3 className="size-3" />
                  {template.time} estimated
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle2 className="size-3" />
                  <BrandName /> · published
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </figure>
  )
}
