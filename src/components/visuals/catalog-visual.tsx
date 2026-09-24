import { CheckCircle2, Clock, Search, Settings2 } from "lucide-react"

const software = [
  {
    name: "Empower CDS",
    category: "Chromatography",
    outcome: "Reviewed chromatographic results",
    status: "On roadmap",
    detail: "Direct connector planned",
  },

  {
    name: "HPLC / UPLC exports",
    category: "Chromatography",
    outcome: "Linked instrument files",
    status: "Needs setup",
    detail: "File-based intake",
  },

  {
    name: "Balance and pH meter data",
    category: "QC instruments",
    outcome: "Weights and readings captured",
    status: "Installed",
    detail: "CSV gateway",
  },

  {
    name: "Environmental monitors",
    category: "Environmental monitoring",
    outcome: "Excursions flagged early",
    status: "On roadmap",
    detail: "Direct connector planned",
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
              "Chromatography",
              "QC instruments",
              "LIMS & ELN",
              "Quality management",
              "Environmental monitoring",
              "Equipment & calibration",
              "Documents & training",
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
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Clock className="size-3" />
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
