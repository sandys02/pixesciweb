import {
  AppWindow,
  Bot,
  Database,
  HardDrive,
  Package,
  Server,
  Workflow,
} from "lucide-react"

const layers = [
  { title: "Tauri + Next.js", note: "Desktop interface", icon: AppWindow },
  { title: "localhost FastAPI", note: "Auth, orchestration, policy", icon: Server },
  { title: "SQLite / SQLCipher", note: "State, runs, audit", icon: Database },
  { title: "Ollama / GGUF", note: "Local model routing", icon: Bot },
  { title: "Profile packs", note: "Capabilities and setup", icon: Package },
  { title: "Scientific software", note: "CLI, GUI, API, files", icon: Workflow },
]

export function ArchitectureDiagram() {
  return (
    <figure
      className="visual-frame overflow-hidden border-white/12 bg-white/[0.035]"
      aria-label="Illustrative PixeSci local-first architecture from desktop interface through localhost backend to local data, models, profile packs, and scientific software"
    >
      {/* TODO: Replace with final reviewed PixeSci architecture artwork. */}
      <figcaption className="visual-toolbar border-white/10 bg-white/[0.025] text-white">
        <span>Customer-controlled runtime</span>
        <span className="inline-flex items-center gap-1.5 text-cyan-300">
          <HardDrive className="size-3.5" />
          Customer-controlled by default
        </span>
      </figcaption>
      <div className="workflow-grid-dark p-5 sm:p-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {layers.map((layer, index) => {
            const Icon = layer.icon
            return (
              <div key={layer.title} className="relative">
                <div className="h-full rounded-md border border-white/12 bg-[#0d1418] p-5">
                  <div className="flex items-center justify-between">
                    <Icon className="size-4 text-cyan-300" />
                    <span className="font-mono text-[9px] text-white/35">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-8 text-sm font-medium text-white">
                    {layer.title}
                  </h3>
                  <p className="mt-1 text-xs text-white/48">{layer.note}</p>
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-cyan-300/20 bg-cyan-300/[0.06] px-4 py-3 text-[10px] text-white/60">
          <span>HTTP / WebSocket over localhost</span>
          <span>Approved internal shares optional</span>
          <span>No hosted control plane required</span>
        </div>
      </div>
    </figure>
  )
}
