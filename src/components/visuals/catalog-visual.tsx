import { CheckCircle2, Search, Settings2 } from "lucide-react"

const software = [
  ["ImageJ / Fiji", "Imaging & Microscopy", "Macro · Files"],
  ["FastQC", "Bioinformatics & Omics", "CLI · Files"],
  ["GraphPad Prism", "Data Analysis", "GUI · Review"],
  ["LIMS REST", "ELN & LIMS", "API · Policy"],
]

export function CatalogVisual() {
  return (
    <figure
      className="visual-frame overflow-hidden"
      aria-label="Illustrative software capability catalog showing software categories, execution channels, setup state, and local detection"
    >
      {/* TODO: Replace with real Pixesci software catalog screenshot. */}
      <figcaption className="visual-toolbar">
        <span>Software capability catalog</span>
        <span className="text-muted-foreground">Backend profiles + local overlay</span>
      </figcaption>
      <div className="grid md:grid-cols-[210px_1fr]">
        <div className="border-b border-border bg-muted/35 p-4 md:border-b-0 md:border-r">
          <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
            <Search className="size-3.5" />
            Search profiles
          </div>
          <div className="mt-5 space-y-1">
            {[
              "Imaging & Microscopy",
              "Bioinformatics & Omics",
              "ELN & LIMS",
              "Analytical Chemistry",
              "Compliance & Quality",
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
          {software.map(([name, category, channels], index) => (
            <div
              key={name}
              className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:p-5"
            >
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-md border border-border bg-muted/50 font-mono text-[10px]">
                  {name.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <h3 className="text-xs font-semibold">{name}</h3>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {category}
                  </p>
                  <p className="mt-2 font-mono text-[9px] text-muted-foreground">
                    {channels}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                {index !== 2 ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600">
                    <CheckCircle2 className="size-3" />
                    Detected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-600">
                    <Settings2 className="size-3" />
                    Setup
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
