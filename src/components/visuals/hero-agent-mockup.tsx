import {
  Bot,
  Check,
  CircleDashed,
  Database,
  FileCheck2,
  FlaskConical,
  MessageSquareText,
  Pause,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

import { cn } from "@/lib/utils"

type StepStatus = "completed" | "running" | "review" | "queued"

type WorkflowStep = {
  label: string
  detail: string
  status: StepStatus
}

const workflowSteps: WorkflowStep[] = [
  {
    label: "Instrument output detected",
    detail: "plate-7 / sample-set-042",
    status: "completed",
  },
  {
    label: "Flow analysis started",
    detail: "validated capability / gating-v3",
    status: "completed",
  },
  {
    label: "Parameters captured",
    detail: "12 variables / checksum recorded",
    status: "completed",
  },
  {
    label: "Review checkpoint required",
    detail: "QC reviewer approval",
    status: "review",
  },
  {
    label: "Evidence package generating",
    detail: "events / metadata / artifacts",
    status: "running",
  },
  {
    label: "LIMS / ELN record queued",
    detail: "pending approved evidence",
    status: "queued",
  },
]

const statusLabel: Record<StepStatus, string> = {
  completed: "Completed",
  running: "Running",
  review: "Review required",
  queued: "Queued",
}

function StepIcon({ status }: { status: StepStatus }) {
  if (status === "completed") {
    return <Check className="size-3" />
  }

  if (status === "review") {
    return <Pause className="size-3" />
  }

  return <CircleDashed className="size-3" />
}

export function HeroAgentMockup() {
  return (
    <figure
      className="visual-frame hero-agent-mockup relative min-h-[520px] overflow-hidden border-white/12 bg-[#071015] text-white shadow-[0_24px_80px_rgba(7,16,21,0.28)]"
      aria-label="Illustrative Pixesci AI agent converting a plain-language flow cytometry request into a controlled workflow with execution status, human review, and audit-ready evidence"
    >
      <div className="workflow-grid-dark absolute inset-0 opacity-70" aria-hidden="true" />
      <figcaption className="visual-toolbar relative z-10 border-white/10 bg-white/[0.035] text-white">
        <span className="flex items-center gap-2">
          <span className="hero-agent-status-dot size-2 rounded-full bg-emerald-400" />
          Pixesci AI Agent
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[9px] text-cyan-300">
          <ShieldCheck className="size-3.5" />
          Controlled session
        </span>
      </figcaption>

      <div className="relative z-10 grid min-h-[475px] lg:grid-cols-[0.82fr_1.18fr]">
        <div className="border-b border-white/10 bg-white/[0.018] p-4 sm:p-5 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/35">
            <MessageSquareText className="size-3.5 text-cyan-300" />
            Intent
          </div>

          <div className="mt-5 space-y-4">
            <div className="ml-6 rounded-lg rounded-tr-sm border border-white/10 bg-white/[0.06] p-3.5">
              <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-white/35">
                QC analyst
              </p>
              <p className="mt-2 text-xs leading-5 text-white/78">
                Review flow cytometry results and prepare audit-ready evidence.
              </p>
            </div>

            <div className="mr-3 rounded-lg rounded-tl-sm border border-cyan-300/20 bg-cyan-300/[0.07] p-3.5">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-md border border-cyan-300/20 bg-cyan-300/10">
                  <Bot className="size-3.5 text-cyan-300" />
                </span>
                <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-cyan-300">
                  Pixesci
                </p>
              </div>
              <p className="mt-3 text-xs leading-5 text-white/78">
                Building validated workflow graph
                <span className="hero-agent-typing-cursor ml-0.5 text-cyan-300">
                  ...
                </span>
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["6 steps", "1 review gate", "audit trail"].map((item) => (
                  <span
                    key={item}
                    className="rounded border border-white/10 bg-black/15 px-2 py-1 font-mono text-[8px] text-white/45"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-md border border-white/10 bg-black/15 p-3.5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[9px] uppercase tracking-[0.12em] text-white/35">
                Workflow readiness
              </span>
              <span className="font-mono text-[9px] text-cyan-300">68%</span>
            </div>
            <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-white/8">
              <div className="hero-agent-progress h-full w-[68%] rounded-full bg-cyan-300" />
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-col p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/35">
                Live execution plan
              </p>
              <p className="mt-1 text-xs font-medium text-white/82">
                Flow cytometry review
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/20 bg-amber-300/[0.08] px-2.5 py-1 text-[8px] font-medium uppercase tracking-[0.1em] text-amber-300">
              <Pause className="size-3" />
              Review gate
            </span>
          </div>

          <div className="mt-4 flex-1 rounded-md border border-white/10 bg-black/15">
            {workflowSteps.map((step) => (
              <div
                key={step.label}
                className="hero-agent-step grid grid-cols-[24px_minmax(0,1fr)_auto] items-center gap-2.5 border-b border-white/8 px-3 py-2.5 last:border-b-0"
              >
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full border",
                    step.status === "completed" &&
                      "border-emerald-300/25 bg-emerald-300/10 text-emerald-300",
                    step.status === "running" &&
                      "hero-agent-running border-cyan-300/25 bg-cyan-300/10 text-cyan-300",
                    step.status === "review" &&
                      "border-amber-300/30 bg-amber-300/10 text-amber-300",
                    step.status === "queued" &&
                      "border-white/10 bg-white/[0.04] text-white/30",
                  )}
                >
                  <StepIcon status={step.status} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[10px] font-medium text-white/78">
                    {step.label}
                  </span>
                  <span className="mt-0.5 block truncate font-mono text-[8px] text-white/32">
                    {step.detail}
                  </span>
                </span>
                <span
                  className={cn(
                    "font-mono text-[7px] uppercase tracking-[0.08em]",
                    step.status === "completed" && "text-emerald-300/75",
                    step.status === "running" && "text-cyan-300",
                    step.status === "review" && "text-amber-300",
                    step.status === "queued" && "text-white/25",
                  )}
                >
                  {statusLabel[step.status]}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-3 divide-x divide-white/10 rounded-md border border-white/10 bg-white/[0.025]">
            {[
              { value: "18", label: "events", icon: Sparkles },
              { value: "04", label: "artifacts", icon: FileCheck2 },
              { value: "01", label: "record", icon: Database },
            ].map((metric) => {
              const Icon = metric.icon
              return (
                <div key={metric.label} className="px-2 py-2.5 text-center">
                  <Icon className="mx-auto size-3 text-cyan-300/75" />
                  <p className="mt-1 font-mono text-[10px] font-semibold text-white/80">
                    {metric.value}
                  </p>
                  <p className="mt-0.5 text-[7px] uppercase tracking-[0.1em] text-white/28">
                    {metric.label}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 rounded-md border border-emerald-300/15 bg-emerald-300/[0.055] px-3 py-2">
            <span className="flex items-center gap-2 text-[9px] text-emerald-200/80">
              <FlaskConical className="size-3.5" />
              Evidence chain active
            </span>
            <span className="font-mono text-[8px] text-emerald-300">
              audit-ready
            </span>
          </div>
        </div>
      </div>
    </figure>
  )
}
