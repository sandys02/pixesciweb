"use client"

import * as React from "react"
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
}

const workflowSteps: WorkflowStep[] = [
  {
    label: "Instrument output detected",
    detail: "plate-7 / sample-set-042",
  },
  {
    label: "Flow analysis started",
    detail: "validated capability / gating-v3",
  },
  {
    label: "Parameters captured",
    detail: "12 variables / checksum recorded",
  },
  {
    label: "Review checkpoint required",
    detail: "QC reviewer approval",
  },
  {
    label: "Evidence package generating",
    detail: "events / metadata / artifacts",
  },
  {
    label: "LIMS / ELN record queued",
    detail: "pending approved evidence",
  },
]

const finalPhase = workflowSteps.length + 1
const reviewStepIndex = 3
const phaseDurations = [700, 1100, 1100, 1100, 1900, 1200, 1200, 1900]

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

function getStepStatus(stepIndex: number, phase: number): StepStatus {
  if (phase === finalPhase || stepIndex < phase - 1) {
    return "completed"
  }

  if (stepIndex > phase - 1 || phase === 0) {
    return "queued"
  }

  return stepIndex === reviewStepIndex ? "review" : "running"
}

export function HeroAgentMockup() {
  const [phase, setPhase] = React.useState(0)
  const [reduceMotion, setReduceMotion] = React.useState(false)

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updatePreference = () => setReduceMotion(media.matches)

    updatePreference()
    media.addEventListener("change", updatePreference)

    return () => media.removeEventListener("change", updatePreference)
  }, [])

  React.useEffect(() => {
    if (reduceMotion) {
      return
    }

    const timer = window.setTimeout(() => {
      setPhase((currentPhase) => (currentPhase + 1) % (finalPhase + 1))
    }, phaseDurations[phase] ?? 1100)

    return () => window.clearTimeout(timer)
  }, [phase, reduceMotion])

  const displayedPhase = reduceMotion ? reviewStepIndex + 1 : phase
  const activeStepIndex = displayedPhase - 1
  const reviewRequired = activeStepIndex === reviewStepIndex
  const executionComplete = displayedPhase === finalPhase
  const readiness = executionComplete
    ? 100
    : Math.max(16, Math.round((displayedPhase / finalPhase) * 100))
  const completedSteps = workflowSteps.filter(
    (_, index) => getStepStatus(index, displayedPhase) === "completed",
  ).length

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
                {displayedPhase === 0
                  ? "Building validated workflow graph"
                  : executionComplete
                    ? "Workflow completed with audit-ready evidence"
                    : "Executing validated workflow graph"}
                <span className="hero-agent-typing-cursor ml-0.5 text-cyan-300">
                  {executionComplete ? "." : "..."}
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
              <span className="font-mono text-[9px] text-cyan-300">
                {readiness}%
              </span>
            </div>
            <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-white/8">
              <div
                className="hero-agent-progress h-full rounded-full bg-cyan-300 transition-[width] duration-500"
                style={{ width: `${readiness}%` }}
              />
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
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[8px] font-medium uppercase tracking-[0.1em] transition-colors",
                reviewRequired &&
                  "border-amber-300/20 bg-amber-300/[0.08] text-amber-300",
                !reviewRequired &&
                  !executionComplete &&
                  "border-cyan-300/20 bg-cyan-300/[0.08] text-cyan-300",
                executionComplete &&
                  "border-emerald-300/20 bg-emerald-300/[0.08] text-emerald-300",
              )}
            >
              {reviewRequired ? (
                <Pause className="size-3" />
              ) : executionComplete ? (
                <Check className="size-3" />
              ) : (
                <CircleDashed className="hero-agent-running size-3" />
              )}
              {reviewRequired
                ? "Review gate"
                : executionComplete
                  ? "Audit ready"
                  : "Executing"}
            </span>
          </div>

          <div className="mt-4 flex-1 rounded-md border border-white/10 bg-black/15">
            {workflowSteps.map((step, index) => {
              const status = getStepStatus(index, displayedPhase)

              return (
                <div
                  key={step.label}
                  className={cn(
                    "hero-agent-step grid grid-cols-[24px_minmax(0,1fr)_auto] items-center gap-2.5 border-b border-white/8 px-3 py-2.5 transition-colors duration-300 last:border-b-0",
                    status === "running" && "bg-cyan-300/[0.035]",
                    status === "review" && "bg-amber-300/[0.04]",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full border transition-colors duration-300",
                      status === "completed" &&
                        "border-emerald-300/25 bg-emerald-300/10 text-emerald-300",
                      status === "running" &&
                        "hero-agent-running border-cyan-300/25 bg-cyan-300/10 text-cyan-300",
                      status === "review" &&
                        "border-amber-300/30 bg-amber-300/10 text-amber-300",
                      status === "queued" &&
                        "border-white/10 bg-white/[0.04] text-white/30",
                    )}
                  >
                    <StepIcon status={status} />
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
                      "font-mono text-[7px] uppercase tracking-[0.08em] transition-colors duration-300",
                      status === "completed" && "text-emerald-300/75",
                      status === "running" && "text-cyan-300",
                      status === "review" && "text-amber-300",
                      status === "queued" && "text-white/25",
                    )}
                  >
                    {statusLabel[status]}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="mt-3 grid grid-cols-3 divide-x divide-white/10 rounded-md border border-white/10 bg-white/[0.025]">
            {[
              {
                value: String(4 + displayedPhase * 2).padStart(2, "0"),
                label: "events",
                icon: Sparkles,
              },
              {
                value: String(Math.min(completedSteps, 4)).padStart(2, "0"),
                label: "artifacts",
                icon: FileCheck2,
              },
              {
                value: executionComplete ? "01" : "00",
                label: "record",
                icon: Database,
              },
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

          <div
            className={cn(
              "mt-3 flex items-center justify-between gap-3 rounded-md border px-3 py-2 transition-colors duration-300",
              executionComplete
                ? "border-emerald-300/15 bg-emerald-300/[0.055]"
                : "border-cyan-300/12 bg-cyan-300/[0.035]",
            )}
          >
            <span
              className={cn(
                "flex items-center gap-2 text-[9px]",
                executionComplete
                  ? "text-emerald-200/80"
                  : "text-cyan-200/70",
              )}
            >
              <FlaskConical className="size-3.5" />
              {executionComplete
                ? "Evidence package complete"
                : "Evidence chain active"}
            </span>
            <span
              className={cn(
                "font-mono text-[8px]",
                executionComplete ? "text-emerald-300" : "text-cyan-300",
              )}
            >
              {executionComplete ? "audit-ready" : "capturing"}
            </span>
          </div>
        </div>
      </div>
    </figure>
  )
}
