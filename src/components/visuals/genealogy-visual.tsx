import { cn } from "@/lib/utils"

type Node = {
  label: string
  meta: string
  status: "released" | "in-testing" | "quarantine"
}

const parent: Node = {
  label: "Material Lot",
  meta: "MAT-2026-0417",
  status: "released",
}

const children: Node[] = [
  { label: "Sub-lot", meta: "MAT-2026-0417-A", status: "released" },
  { label: "Sub-lot", meta: "MAT-2026-0417-B", status: "quarantine" },
]

const grandchild: Node = {
  label: "Product Lot",
  meta: "PRD-2026-0091",
  status: "in-testing",
}

const statusColor: Record<Node["status"], string> = {
  released: "bg-emerald-500",
  "in-testing": "bg-amber-400",
  quarantine: "bg-muted-foreground/50",
}

function Tile({ node }: { node: Node }) {
  return (
    <div className="rounded-md border border-border bg-background px-3 py-2.5">
      <div className="flex items-center gap-2">
        <span
          className={cn("size-1.5 shrink-0 rounded-full", statusColor[node.status])}
          aria-hidden="true"
        />
        <p className="text-[10px] font-semibold">{node.label}</p>
      </div>
      <p className="mt-1 font-mono text-[9px] text-muted-foreground">
        {node.meta}
      </p>
    </div>
  )
}

export function GenealogyVisual() {
  return (
    <figure
      className="visual-frame overflow-hidden"
      aria-label="Lineage tree showing a material lot, its two sub-lots, and the product lot built from one of them"
    >
      {/* TODO: Replace with real PixeSci TM genealogy screenshot. */}
      <figcaption className="visual-toolbar">
        <span>Genealogy / MAT-2026-0417</span>
        <span className="text-muted-foreground">3 linked records</span>
      </figcaption>
      <div className="flex flex-col items-center gap-0 p-6 sm:p-8">
        <Tile node={parent} />
        <div className="h-4 w-px bg-border" aria-hidden="true" />
        <div className="flex w-full items-start justify-center gap-6">
          {children.map((child, index) => (
            <div key={child.meta} className="flex flex-1 flex-col items-center">
              <Tile node={child} />
              {index === 0 ? (
                <div className="h-4 w-px bg-border" aria-hidden="true" />
              ) : null}
            </div>
          ))}
        </div>
        <div className="w-1/2">
          <Tile node={grandchild} />
        </div>
      </div>
    </figure>
  )
}
