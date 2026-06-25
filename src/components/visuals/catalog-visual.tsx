import { CheckCircle2, Search, Settings2 } from "lucide-react"

const software = [
  {
    name: "Empower CDS",
    category: "Analytical Chemistry",
    outcome: "Reviewed chromatographic results",
    status: "Available",
    detail: "8 capabilities · 4 workflows",
  },

  {
    name: "HPLC System",
    category: "Analytical Chemistry",
    outcome: "Quantified compounds",
    status: "Needs setup",
    detail: "6 capabilities · 3 workflows",
  },

  {
    name: "NMR Software",
    category: "Analytical Chemistry",
    outcome: "Structural characterization",
    status: "Installed",
    detail: "5 capabilities · 2 workflows",
  },

  {
    name: "LC-MS Platform",
    category: "Analytical Chemistry",
    outcome: "Identified analytes",
    status: "Available",
    detail: "7 capabilities · 3 workflows",
  },
]

export function CatalogVisual() {
  return (
    <figure
      className="visual-frame overflow-hidden"
      aria-label="Illustrative software catalog showing software categories, workflow outcomes, setup state, and local detection"
    >
      {/* TODO: Replace with real PixeSci TM software catalog screenshot. */}
      <figcaption className="visual-toolbar">
        <span>Software capability catalog</span>
        <span className="text-muted-foreground">
          4 profiles / local scan 09:41
        </span>
      </figcaption>
      <div className="grid md:grid-cols-[210px_1fr]">
        <div className="border-b border-border bg-muted/35 p-4 md:border-r md:border-b-0">
          <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
            <Search className="size-3.5" />
            Search profiles
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1 text-center text-[9px] text-muted-foreground">
            <span className="rounded-md bg-foreground px-2 py-1.5 text-background">
              Catalog
            </span>
            <span className="rounded-md px-2 py-1.5">Installed</span>
            <span className="rounded-md px-2 py-1.5">Setup</span>
          </div>
          <div className="mt-5 space-y-1">
            {[
              "Analytical Chemistry",
              "Data Analysis & Statistics",
              "Laboratory Productivity",
              "Reporting & Visualization",
              "AI & Automation",
              "Imaging & Microscopy",
              "Bioinformatics & Omics",
            ].map((category, index) => (
              <div
                key={category}
                className={
                  index === 0
                    ? "rounded-md bg-foreground px-3 py-2 text-[11px] text-background"
                    : "px-3 py-2 text-[11px] text-muted-foreground"
                }
              >
                {category}
              </div>
            ))}
          </div>
        </div>
        <div className="divide-y divide-border">
          {software.map((app) => (
            <div
              key={app.name}
              className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:p-5"
            >
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-md border border-border bg-muted/50 font-mono text-[10px]">
                  {app.name.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <h3 className="text-xs font-semibold">{app.name}</h3>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {app.category}
                  </p>
                  <p className="mt-2 font-mono text-[9px] text-muted-foreground">
                    {app.outcome}
                  </p>
                  <p className="mt-1 text-[9px] text-muted-foreground">
                    {app.detail}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                {app.status === "Installed" ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600">
                    <CheckCircle2 className="size-3" />
                    {app.status}
                  </span>
                ) : app.status === "Needs setup" ? (
                  <span className="inline-flex items-center gap-1 text-amber-600">
                    <Settings2 className="size-3" />
                    {app.status}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-primary">
                    <CheckCircle2 className="size-3" />
                    {app.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  )
}
