import { FileText, Layers, ShieldAlert } from "lucide-react"

export function QualityRecordVisual() {
  return (
    <figure
      className="visual-frame overflow-hidden"
      aria-label="Quality record card showing a deviation status, owner, due date, and its linked document and batch records"
    >
      {/* TODO: Replace with real PixeSci TM quality record screenshot. */}
      <figcaption className="visual-toolbar">
        <span>Quality record / DEV-2026-0142</span>
        <span className="inline-flex items-center gap-1.5 text-amber-600">
          <ShieldAlert className="size-3.5" />
          Under review
        </span>
      </figcaption>
      <div className="grid gap-6 p-5 sm:grid-cols-[1fr_auto] sm:p-6">
        <dl className="grid grid-cols-2 gap-4 text-xs">
          {[
            ["Type", "Deviation"],
            ["Owner", "Q. Adeyemi"],
            ["Opened", "2026-08-04"],
            ["Due", "2026-09-18"],
          ].map(([term, value]) => (
            <div key={term}>
              <dt className="text-[9px] tracking-[0.1em] text-muted-foreground uppercase">
                {term}
              </dt>
              <dd className="mt-1 font-mono text-[10px]">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="grid size-14 shrink-0 place-items-center justify-self-start rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-600 sm:justify-self-end">
          <span className="font-mono text-[9px] font-semibold">3/5</span>
        </div>
      </div>
      <div className="border-t border-border bg-muted/20 p-4 sm:p-5">
        <p className="text-[9px] tracking-[0.12em] text-muted-foreground uppercase">
          Linked records
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-[10px]">
            <FileText className="size-3 text-primary" />
            SOP-101-014
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-[10px]">
            <Layers className="size-3 text-primary" />
            Batch BR-2026-0087
          </span>
        </div>
      </div>
    </figure>
  )
}
