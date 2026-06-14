"use client"

import * as React from "react"
import {
  Bot,
  Boxes,
  Check,
  CircleDashed,
  FileCheck2,
  FlaskConical,
  GitBranch,
  MessageSquareText,
  Pause,
  Play,
  Search,
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
    label: "Scientific intent interpreted",
    detail: "flow review / evidence required",
  },
  {
    label: "Approved software searched",
    detail: "FlowJo / FCS Express / LIMS",
  },
  {
    label: "Analysis capability integrated",
    detail: "flow-cytometry.analysis / gating-v3",
  },
  {
    label: "Workflow graph constructed",
    detail: "7 nodes / dependencies resolved",
  },
  {
    label: "Validation checkpoint",
    detail: "parameters / policy / QC approval",
  },
  {
    label: "Controlled workflow executing",
    detail: "instrument → analysis → review",
  },
  {
    label: "Evidence and records packaged",
    detail: "audit trail / LIMS / ELN",
  },
]

const finalPhase = workflowSteps.length + 1
const reviewStepIndex = 4
const executionStepIndex = 5
const phaseDurations = [1800, 2400, 3200, 2800, 2800, 4200, 3400, 3000, 4400]

const phaseMessages = [
  "Interpreting the request and defining the execution objective",
  "Mapping the request to traceable workflow requirements",
  "Searching the approved software and capability catalog",
  "Integrating flow-cytometry.analysis with gating-v3",
  "Constructing the workflow graph and resolving dependencies",
  "Workflow ready. QC approval is required before execution",
  "Running the controlled workflow and capturing every event",
  "Packaging evidence and queuing LIMS / ELN records",
  "Workflow completed with audit-ready execution evidence",
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
  const workflowExecuting = activeStepIndex === executionStepIndex
  const executionComplete = displayedPhase === finalPhase
  const readiness = executionComplete
    ? 100
    : Math.max(8, Math.round((displayedPhase / finalPhase) * 100))
  const completedSteps = workflowSteps.filter(
    (_, index) => getStepStatus(index, displayedPhase) === "completed",
  ).length
  const stageLabel =
    displayedPhase <= 1
      ? "Understanding intent"
      : displayedPhase <= 3
        ? "Discovering capabilities"
        : displayedPhase <= 5
          ? "Building workflow"
          : executionComplete
            ? "Audit ready"
            : "Running workflow"
  const planLabel =
    displayedPhase < executionStepIndex + 1
      ? "Workflow creation timeline"
      : "Live execution timeline"

  return (
    <figure
      className="visual-frame hero-agent-mockup relative min-h-[520px] overflow-hidden bg-card text-card-foreground shadow-[0_24px_80px_rgba(21,36,45,0.14)] dark:border-white/12 dark:bg-[#071015] dark:text-white dark:shadow-[0_24px_80px_rgba(7,16,21,0.28)]"
      aria-label="Illustrative Pixesci AI agent converting a plain-language flow cytometry request into a controlled workflow with execution status, human review, and audit-ready evidence"
    >
      <div className="workflow-grid absolute inset-0 opacity-65 dark:hidden" aria-hidden="true" />
      <div className="workflow-grid-dark absolute inset-0 hidden opacity-70 dark:block" aria-hidden="true" />
      <figcaption className="visual-toolbar relative z-10 bg-muted/45 text-foreground dark:border-white/10 dark:bg-white/[0.035] dark:text-white">
        <span className="flex items-center gap-2">
          <span className="hero-agent-status-dot size-2 rounded-full bg-emerald-400" />
          Pixesci AI Agent
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[9px] text-primary dark:text-cyan-300">
          <ShieldCheck className="size-3.5" />
          Controlled session
        </span>
      </figcaption>

      <div className="relative z-10 grid min-h-[475px] lg:grid-cols-[0.82fr_1.18fr]">
        <div className="border-b bg-muted/15 p-4 sm:p-5 lg:border-b-0 lg:border-r dark:border-white/10 dark:bg-white/[0.018]">
          <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <MessageSquareText className="size-3.5 text-primary dark:text-cyan-300" />
            Intent
          </div>

          <div className="mt-5 space-y-4">
            <div className="ml-6 rounded-lg rounded-tr-sm border bg-muted/55 p-3.5 dark:border-white/10 dark:bg-white/[0.06]">
              <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                QC analyst
              </p>
              <p className="mt-2 text-xs leading-5 text-foreground/80 dark:text-white/78">
                Review flow cytometry results and prepare audit-ready evidence.
              </p>
            </div>

            <div className="mr-3 rounded-lg rounded-tl-sm border border-primary/20 bg-primary/[0.045] p-3.5 dark:border-cyan-300/20 dark:bg-cyan-300/[0.07]">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-md border border-primary/20 bg-primary/10">
                  <Bot className="size-3.5 text-primary dark:text-cyan-300" />
                </span>
                <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-primary dark:text-cyan-300">
                  Pixesci
                </p>
              </div>
              <p className="mt-3 text-xs leading-5 text-foreground/80 dark:text-white/78">
                {phaseMessages[displayedPhase]}
                <span className="hero-agent-typing-cursor ml-0.5 text-primary dark:text-cyan-300">
                  {executionComplete ? "." : "..."}
                </span>
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {[
                  displayedPhase >= 3 ? "gating-v3" : "capability search",
                  displayedPhase >= 5 ? "1 review gate" : "policy aware",
                  executionComplete ? "audit-ready" : "event capture",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded border bg-background/70 px-2 py-1 font-mono text-[8px] text-muted-foreground dark:border-white/10 dark:bg-black/15 dark:text-white/45"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-md border bg-background/70 p-3.5 dark:border-white/10 dark:bg-black/15">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                Orchestration progress
              </span>
              <span className="font-mono text-[9px] text-primary dark:text-cyan-300">
                {readiness}%
              </span>
            </div>
            <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-muted dark:bg-white/8">
              <div
                className="hero-agent-progress h-full rounded-full bg-primary transition-[width] duration-500 dark:bg-cyan-300"
                style={{ width: `${readiness}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-col p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {planLabel}
              </p>
              <p className="mt-1 text-xs font-medium text-foreground/85 dark:text-white/82">
                {stageLabel}
              </p>
            </div>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[8px] font-medium uppercase tracking-[0.1em] transition-colors",
                reviewRequired &&
                  "border-amber-600/25 bg-amber-500/[0.08] text-amber-700 dark:border-amber-300/20 dark:text-amber-300",
                !reviewRequired &&
                  !executionComplete &&
                  "border-primary/20 bg-primary/[0.06] text-primary dark:border-cyan-300/20 dark:bg-cyan-300/[0.08] dark:text-cyan-300",
                executionComplete &&
                  "border-emerald-600/25 bg-emerald-500/[0.08] text-emerald-700 dark:border-emerald-300/20 dark:text-emerald-300",
              )}
            >
              {reviewRequired ? (
                <Pause className="size-3" />
              ) : executionComplete ? (
                <Check className="size-3" />
              ) : workflowExecuting ? (
                <Play className="hero-agent-running size-3" />
              ) : displayedPhase >= 2 && displayedPhase <= 3 ? (
                <Search className="hero-agent-running size-3" />
              ) : displayedPhase >= 4 && displayedPhase <= 5 ? (
                <GitBranch className="hero-agent-running size-3" />
              ) : (
                <CircleDashed className="hero-agent-running size-3" />
              )}
              {reviewRequired
                ? "Approval required"
                : executionComplete
                  ? "Audit ready"
                  : stageLabel}
            </span>
          </div>

          <div className="mt-4 flex-1 rounded-md border bg-background/70 dark:border-white/10 dark:bg-black/15">
            {workflowSteps.map((step, index) => {
              const status = getStepStatus(index, displayedPhase)

              return (
                <div
                  key={step.label}
                  className={cn(
                    "hero-agent-step grid grid-cols-[24px_minmax(0,1fr)_auto] items-center gap-2.5 border-b px-3 py-2.5 transition-colors duration-300 last:border-b-0 dark:border-white/8",
                    status === "running" && "bg-primary/[0.035] dark:bg-cyan-300/[0.035]",
                    status === "review" && "bg-amber-500/[0.05] dark:bg-amber-300/[0.04]",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full border transition-colors duration-300",
                      status === "completed" &&
                        "border-emerald-600/25 bg-emerald-500/10 text-emerald-700 dark:border-emerald-300/25 dark:bg-emerald-300/10 dark:text-emerald-300",
                      status === "running" &&
                        "hero-agent-running border-primary/25 bg-primary/10 text-primary dark:border-cyan-300/25 dark:bg-cyan-300/10 dark:text-cyan-300",
                      status === "review" &&
                        "border-amber-600/30 bg-amber-500/10 text-amber-700 dark:border-amber-300/30 dark:bg-amber-300/10 dark:text-amber-300",
                      status === "queued" &&
                        "border-border bg-muted/40 text-muted-foreground/60 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/30",
                    )}
                  >
                    <StepIcon status={status} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[10px] font-medium text-foreground/80 dark:text-white/78">
                      {step.label}
                    </span>
                    <span className="mt-0.5 block truncate font-mono text-[8px] text-muted-foreground/75 dark:text-white/32">
                      {step.detail}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[7px] uppercase tracking-[0.08em] transition-colors duration-300",
                      status === "completed" && "text-emerald-700 dark:text-emerald-300/75",
                      status === "running" && "text-primary dark:text-cyan-300",
                      status === "review" && "text-amber-700 dark:text-amber-300",
                      status === "queued" && "text-muted-foreground/55 dark:text-white/25",
                    )}
                  >
                    {statusLabel[status]}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="mt-3 grid grid-cols-3 divide-x rounded-md border bg-muted/20 dark:divide-white/10 dark:border-white/10 dark:bg-white/[0.025]">
            {[
              {
                value: String(3 + displayedPhase * 3).padStart(2, "0"),
                label: "events",
                icon: Sparkles,
              },
              {
                value: String(
                  Math.min(
                    displayedPhase < 3 ? displayedPhase : displayedPhase - 1,
                    3,
                  ),
                ).padStart(2, "0"),
                label: "capabilities",
                icon: Boxes,
              },
              {
                value: String(
                  executionComplete ? 5 : Math.min(completedSteps, 2),
                ).padStart(2, "0"),
                label: "artifacts",
                icon: FileCheck2,
              },
            ].map((metric) => {
              const Icon = metric.icon
              return (
                <div key={metric.label} className="px-2 py-2.5 text-center">
                  <Icon className="mx-auto size-3 text-primary/80 dark:text-cyan-300/75" />
                  <p className="mt-1 font-mono text-[10px] font-semibold text-foreground/85 dark:text-white/80">
                    {metric.value}
                  </p>
                  <p className="mt-0.5 text-[7px] uppercase tracking-[0.1em] text-muted-foreground dark:text-white/28">
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
                ? "border-emerald-600/20 bg-emerald-500/[0.055] dark:border-emerald-300/15 dark:bg-emerald-300/[0.055]"
                : "border-primary/15 bg-primary/[0.035] dark:border-cyan-300/12 dark:bg-cyan-300/[0.035]",
            )}
          >
            <span
              className={cn(
                "flex items-center gap-2 text-[9px]",
                executionComplete
                  ? "text-emerald-700 dark:text-emerald-200/80"
                  : "text-primary/80 dark:text-cyan-200/70",
              )}
            >
              <FlaskConical className="size-3.5" />
              {executionComplete
                ? "Evidence package complete"
                : workflowExecuting
                  ? "Execution events streaming"
                  : reviewRequired
                    ? "Execution paused at controlled gate"
                    : displayedPhase >= 2
                      ? "Capability and graph decisions recorded"
                      : "Traceability record initialized"}
            </span>
            <span
              className={cn(
                "font-mono text-[8px]",
                executionComplete
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-primary dark:text-cyan-300",
              )}
            >
              {executionComplete
                ? "audit-ready"
                : reviewRequired
                  ? "awaiting-review"
                  : workflowExecuting
                    ? "running"
                    : "capturing"}
            </span>
          </div>
        </div>
      </div>
    </figure>
  )
}
