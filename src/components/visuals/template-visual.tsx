import { Clock3, FileStack, Microscope, ScanSearch } from "lucide-react"

const templates = [
  {
    title: "Microscopy quantification",
    category: "Imaging",
    steps: "6 nodes",
    icon: Microscope,
  },
  {
    title: "Flow cytometry review",
    category: "QC",
    steps: "5 nodes",
    icon: ScanSearch,
  },
  {
    title: "Facility report package",
    category: "Reporting",
    steps: "4 nodes",
    icon: FileStack,
  },
]

export function TemplateVisual() {
  return (
    <figure
      className="visual-frame overflow-hidden"
      aria-label="Illustrative workflow template center with reusable scientific workflow templates"
    >
      {/* TODO: Replace with real Pixesci template center screenshot. */}
      <figcaption className="visual-toolbar">
        <span>Template center</span>
        <span className="text-muted-foreground">System workflow templates</span>
      </figcaption>
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
              <div className="mt-5 flex items-center gap-1.5 border-t border-border pt-4 text-[10px] text-muted-foreground">
                <Clock3 className="size-3" />
                {template.steps} · review included
              </div>
            </div>
          )
        })}
      </div>
    </figure>
  )
}
