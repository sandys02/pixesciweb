import { CheckCircle2, CircleDashed, PauseCircle } from "lucide-react"

const logs = [
  ["09:42:16.104", "run.started", "run_01J8Q / trace_7F2"],
  ["09:42:18.892", "file.validated", "source/FCS/plate-7"],
  ["09:43:08.220", "node.completed", "flowjo-gating"],
  ["09:44:51.609", "artifact.created", "gating-summary.csv"],
  ["09:46:03.017", "review.requested", "qc-director"],
]

export function ExecutionConsole() {
  return (
    <figure
      className="visual-frame overflow-hidden border-white/12 bg-[#081014]"
      aria-label="Illustrative workflow execution console with live events, artifacts, progress, and a human review checkpoint"
    >
      {/* TODO: Replace with real PixeSci execution monitor screenshot. */}
      <figcaption className="visual-toolbar border-white/10 bg-white/[0.025] text-white">
        <span>Live monitor / run_01J8Q</span>
        <span className="inline-flex items-center gap-1.5 text-amber-300">
          <PauseCircle className="size-3.5" />
          Awaiting review
        </span>
      </figcaption>
      <div className="grid md:grid-cols-[1fr_200px]">
        <div className="divide-y divide-white/8 font-mono">
          {logs.map(([time, event, value], index) => (
            <div
              key={event}
              className="grid grid-cols-[84px_1fr] gap-3 px-4 py-3 text-[10px] sm:grid-cols-[96px_130px_1fr] sm:px-5"
            >
              <span className="text-white/30">{time}</span>
              <span className="text-cyan-300">{event}</span>
              <span className="col-start-2 break-all text-white/55 sm:col-start-auto">
                {value}
              </span>
              {index === logs.length - 1 ? (
                <span className="sr-only">Latest event</span>
              ) : null}
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 bg-white/[0.025] p-5 md:border-l md:border-t-0">
          <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">
            Run summary
          </p>
          <div className="mt-5 space-y-4 text-xs">
            <div className="flex items-center justify-between text-white/65">
              <span>Steps</span>
              <span className="font-mono">3 / 5</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-3/5 bg-cyan-300" />
            </div>
            <div className="flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="size-3.5" />
              3 executed
            </div>
            <div className="flex items-center gap-2 text-amber-300">
              <CircleDashed className="size-3.5" />
              1 approval required
            </div>
            <dl className="space-y-2 border-t border-white/10 pt-3 font-mono text-[9px] text-white/45">
              <div className="flex justify-between gap-3">
                <dt>events</dt>
                <dd>12</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>artifacts</dt>
                <dd>2</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>blocked</dt>
                <dd>0</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </figure>
  )
}
