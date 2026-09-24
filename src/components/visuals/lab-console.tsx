"use client"

import * as React from "react"
import {
  AlertTriangle,
  CircleDashed,
  Link2,
  Loader2,
  LockKeyhole,
  UserCheck,
} from "lucide-react"

import {
  labBoundary,
  labScripts,
  type LabScript,
  type LabTaskStatus,
} from "@/content/lab-conversation"
import { BrandName } from "@/components/site/brand-name"
import { useInView, useReducedMotion } from "@/lib/use-motion"
import { cn } from "@/lib/utils"

import { PauseToggle } from "./pause-toggle"
import { VoiceWaveform } from "./voice-waveform"

// Phases: 0 speaking, 1 transcribing, 2 planning, 3 running tasks, 4 summary, 5 holding.
const runningPhase = 3
const summaryPhase = 4
const finalPhase = 5
const phaseDurations = [1400, 0, 1300, 0, 900, 4500]
const typeEveryMs = 34
const sourceStaggerMs = 380
// Source line endpoints in a 300×40 viewBox, converging on the output below.
const sourceLinePaths = [
  "M50 0 C50 24 150 16 150 40",
  "M150 0 L150 40",
  "M250 0 C250 24 150 16 150 40",
]

type TaskState = "queued" | "running" | "done"

const doneStyles: Record<LabTaskStatus, string> = {
  linked:
    "border-primary/20 bg-primary/[0.06] text-primary dark:border-icy/20 dark:bg-icy/[0.08] dark:text-icy",
  flagged:
    "border-amber-600/30 bg-amber-500/10 text-amber-700 dark:border-amber-300/30 dark:bg-amber-300/10 dark:text-amber-300",
  step: "border-border bg-background text-foreground/70 dark:border-white/15 dark:bg-white/5 dark:text-white/70",
  pending:
    "border-border bg-background text-muted-foreground dark:border-white/15 dark:bg-white/5 dark:text-white/45",
}

const doneLabels: Record<LabTaskStatus, string> = {
  linked: "Linked record",
  flagged: "Flagged",
  step: "Step ready",
  pending: "Not started",
}

function TaskIcon({
  state,
  status,
  index,
}: {
  state: TaskState
  status: LabTaskStatus
  index: number
}) {
  if (state === "queued") return <CircleDashed className="size-3" />
  if (state === "running") return <Loader2 className="size-3 animate-spin" />
  if (status === "linked") return <Link2 className="size-3" />
  if (status === "flagged") return <AlertTriangle className="size-3" />
  if (status === "pending") return <CircleDashed className="size-3" />
  return <span className="font-mono text-[9px] font-semibold">{index + 1}</span>
}

function seconds(ms: number) {
  return `${(ms / 1000).toFixed(1)}s`
}

function statusLine(script: LabScript, phase: number, taskIndex: number) {
  if (phase === 0) {
    return script.speaker === "lab" ? "PixeSci is speaking" : "Listening"
  }
  if (phase === 1) return "Transcribing"
  if (phase === 2) return `Planning ${script.tasks.length} tasks`
  if (phase === runningPhase) {
    return `Running task ${taskIndex + 1} of ${script.tasks.length}`
  }
  return script.outcome
}

export function LabConsole() {
  const frameRef = React.useRef<HTMLElement>(null)
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([])
  const baseId = React.useId()
  const [modeIndex, setModeIndex] = React.useState(0)
  const [phase, setPhase] = React.useState(0)
  const [typed, setTyped] = React.useState(0)
  const [taskIndex, setTaskIndex] = React.useState(0)
  const [autoCycle, setAutoCycle] = React.useState(true)
  const [paused, setPaused] = React.useState(false)
  const reduceMotion = useReducedMotion()
  const inView = useInView(frameRef)
  const running = !reduceMotion && !paused && inView

  const script = labScripts[modeIndex]
  const taskCount = script.tasks.length

  React.useEffect(() => {
    if (!running) return

    let delay = phaseDurations[phase]
    let next: () => void = () => setPhase(phase + 1)

    if (phase === 1) {
      if (typed < script.prompt.length) {
        delay = typeEveryMs
        next = () => setTyped(typed + 1)
      } else {
        delay = 450
      }
    } else if (phase === runningPhase) {
      delay = script.tasks[taskIndex].ms
      if (taskIndex < taskCount - 1) {
        next = () => setTaskIndex(taskIndex + 1)
      }
    } else if (phase === finalPhase) {
      if (!autoCycle) return
      next = () => {
        setModeIndex((current) => (current + 1) % labScripts.length)
        setPhase(0)
        setTyped(0)
        setTaskIndex(0)
      }
    }

    const timer = window.setTimeout(next, delay)
    return () => window.clearTimeout(timer)
  }, [running, phase, typed, taskIndex, autoCycle, script, taskCount])

  function selectMode(index: number) {
    setModeIndex(index)
    setPhase(0)
    setTyped(0)
    setTaskIndex(0)
    setAutoCycle(false)
  }

  function onTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    const offsets: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 }
    const offset = offsets[event.key]
    if (offset === undefined) return
    event.preventDefault()
    const next = (modeIndex + offset + labScripts.length) % labScripts.length
    selectMode(next)
    tabRefs.current[next]?.focus()
  }

  const shownPhase = reduceMotion ? finalPhase : phase
  const shownTyped =
    shownPhase >= 2 ? script.prompt.length : shownPhase === 1 ? typed : 0
  const speaking = shownPhase <= 1
  const planned = shownPhase >= 2
  const summarized = shownPhase >= summaryPhase
  const activeSource =
    shownPhase === runningPhase ? script.tasks[taskIndex].source : null
  const finishedMs = script.tasks.reduce((total, task) => total + task.ms, 0)

  function taskState(index: number): TaskState {
    if (shownPhase > runningPhase) return "done"
    if (shownPhase < runningPhase) return "queued"
    if (index < taskIndex) return "done"
    return index === taskIndex ? "running" : "queued"
  }

  const doneCount = script.tasks.filter(
    (_, index) => taskState(index) === "done"
  ).length

  return (
    <figure
      ref={frameRef}
      className="visual-frame relative min-h-[520px] overflow-hidden bg-card text-card-foreground dark:border-white/12 dark:bg-deep dark:text-white"
      aria-label="A conversation with the lab: ask a question, tell it what needs to happen, or let it tell you when something is off. PixeSci works through each task, links the source records, and waits for a qualified reviewer."
    >
      <div
        className="workflow-grid absolute inset-0 opacity-65 dark:hidden"
        aria-hidden="true"
      />
      <div
        className="workflow-grid-dark absolute inset-0 hidden opacity-70 dark:block"
        aria-hidden="true"
      />

      <figcaption className="visual-toolbar relative z-10 bg-muted/45 text-foreground dark:border-white/10 dark:bg-white/[0.035] dark:text-white">
        <span className="flex min-w-0 items-center gap-2">
          <span className="hero-agent-status-dot size-2 shrink-0 rounded-full bg-emerald-400" />
          <span className="truncate">
            <BrandName />
            <span className="hidden sm:inline"> Lab console</span>
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <span
            role="tablist"
            aria-label="Conversation mode"
            className="flex rounded-md border border-border bg-background/80 p-0.5 dark:border-white/12 dark:bg-black/20"
          >
            {labScripts.map((item, index) => {
              const selected = index === modeIndex
              return (
                <button
                  key={item.mode}
                  ref={(node) => {
                    tabRefs.current[index] = node
                  }}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${item.mode}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => selectMode(index)}
                  onKeyDown={onTabKeyDown}
                  className={cn(
                    "rounded-[5px] px-2.5 py-1 text-[10px] font-medium transition-colors",
                    selected
                      ? "bg-primary text-primary-foreground dark:bg-icy dark:text-deep"
                      : "text-muted-foreground hover:text-foreground dark:text-white/55 dark:hover:text-white"
                  )}
                >
                  {item.tab}
                </button>
              )
            })}
          </span>
          {reduceMotion ? null : (
            <PauseToggle
              paused={paused}
              onToggle={() => setPaused((current) => !current)}
              label="lab conversation"
            />
          )}
        </span>
      </figcaption>

      <div
        key={script.mode}
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${script.mode}`}
        className="relative z-10 flex min-h-[611px] flex-col p-4 sm:min-h-[567px] sm:p-5"
      >
        <div className="rounded-lg border bg-background/80 p-4 dark:border-white/10 dark:bg-black/20">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[9px] font-semibold tracking-[0.14em] text-muted-foreground uppercase dark:text-white/45">
              {script.speaker === "lab" ? (
                <>
                  <BrandName /> to you
                </>
              ) : (
                "You to your lab"
              )}
            </p>
            <p className="font-mono text-[9px] text-muted-foreground dark:text-white/45">
              {statusLine(script, shownPhase, taskIndex)}
            </p>
          </div>
          <div className="mt-3 flex min-h-[84px] flex-col items-start gap-2 sm:min-h-12 sm:flex-row sm:items-center sm:gap-3">
            <VoiceWaveform
              active={speaking && !paused && !reduceMotion}
              className={cn(
                "shrink-0 transition-colors duration-500",
                speaking
                  ? "text-primary dark:text-icy"
                  : "text-muted-foreground/40 dark:text-white/25"
              )}
            />
            <p className="min-w-0 text-sm leading-6 font-medium sm:text-base">
              <span className="sr-only">{script.prompt}</span>
              <span aria-hidden="true">
                {script.prompt.slice(0, shownTyped)}
                {shownPhase === 1 ? (
                  <span className="hero-agent-typing-cursor ml-0.5 inline-block h-4 w-px bg-current align-middle" />
                ) : null}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {script.sources.map((source, index) => {
            const Icon = source.icon
            const active = activeSource === index
            return (
              <div
                key={source.label}
                className={cn(
                  "rounded-md border px-2.5 py-2 transition-colors duration-500",
                  active && "hero-agent-running",
                  active
                    ? "border-primary/60 bg-primary/[0.09] dark:border-icy/60 dark:bg-icy/[0.1]"
                    : planned
                      ? "border-primary/30 bg-primary/[0.05] dark:border-icy/30 dark:bg-icy/[0.06]"
                      : "border-border bg-background/60 dark:border-white/10 dark:bg-black/15"
                )}
                style={{
                  transitionDelay: planned && activeSource === null
                    ? `${index * sourceStaggerMs}ms`
                    : "0ms",
                }}
              >
                <p className="flex items-center gap-1.5 text-[11px] font-medium">
                  <Icon
                    className={cn(
                      "size-3 shrink-0 transition-colors duration-500",
                      planned
                        ? "text-primary dark:text-icy"
                        : "text-muted-foreground/60"
                    )}
                  />
                  <span className="truncate">{source.label}</span>
                </p>
                <p className="mt-0.5 truncate font-mono text-[9px] text-muted-foreground dark:text-white/40">
                  {source.detail}
                </p>
              </div>
            )
          })}
        </div>

        <svg
          viewBox="0 0 300 40"
          preserveAspectRatio="none"
          className="h-8 w-full text-primary dark:text-icy"
          aria-hidden="true"
        >
          {sourceLinePaths.map((path, index) => (
            <path
              key={path}
              d={path}
              fill="none"
              stroke="currentColor"
              strokeWidth={activeSource === index ? 2 : 1.25}
              strokeOpacity={activeSource === index ? 1 : 0.55}
              vectorEffect="non-scaling-stroke"
              className="lab-console-line"
              data-drawn={planned}
              style={{ transitionDelay: `${index * sourceStaggerMs + 200}ms` }}
            />
          ))}
        </svg>

        <div className="relative flex-1 rounded-lg border bg-background/80 p-4 dark:border-white/10 dark:bg-black/20">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[9px] font-semibold tracking-[0.14em] text-muted-foreground uppercase dark:text-white/45">
              {summarized
                ? script.speaker === "lab"
                  ? "Recommendation"
                  : "Answer"
                : "Working"}
            </p>
            <p
              className={cn(
                "font-mono text-[9px] text-muted-foreground transition-opacity duration-300 dark:text-white/45",
                planned ? "opacity-100" : "opacity-0"
              )}
            >
              {summarized
                ? `${taskCount} tasks · ${seconds(finishedMs)}`
                : `${doneCount}/${taskCount} done`}
            </p>
          </div>

          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-x-4 top-10 space-y-2.5 transition-opacity duration-300",
              planned ? "opacity-0" : "opacity-100"
            )}
          >
            {["w-11/12", "w-3/4", "w-1/2", "w-2/3"].map((width) => (
              <div
                key={width}
                className={cn(
                  "h-2.5 rounded-full bg-muted dark:bg-white/[0.06]",
                  width,
                  shownPhase === 1 && "hero-agent-progress"
                )}
              />
            ))}
          </div>

          <ol className="mt-3 space-y-1.5">
            {script.tasks.map((task, index) => {
              const state = taskState(index)
              return (
                <li
                  key={task.label}
                  className={cn(
                    "relative grid grid-cols-[22px_minmax(0,1fr)_auto] items-center gap-2.5 transition-[opacity,transform] duration-500",
                    planned
                      ? "translate-y-0 opacity-100"
                      : "translate-y-1 opacity-0"
                  )}
                  style={{
                    transitionDelay: planned ? `${index * 90}ms` : "0ms",
                  }}
                >
                  <span
                    className={cn(
                      "flex size-[22px] items-center justify-center rounded-full border transition-colors duration-300",
                      state === "done"
                        ? doneStyles[task.status]
                        : state === "running"
                          ? "border-primary/40 bg-primary/[0.08] text-primary dark:border-icy/40 dark:bg-icy/[0.1] dark:text-icy"
                          : "border-dashed border-border text-muted-foreground/60 dark:border-white/15 dark:text-white/30"
                    )}
                    aria-hidden="true"
                  >
                    <TaskIcon state={state} status={task.status} index={index} />
                  </span>
                  <span className="min-w-0 truncate">
                    <span className="sr-only">
                      {doneLabels[task.status]}: {task.label}, {task.detail}
                    </span>
                    {state === "done" ? (
                      <span aria-hidden="true">
                        <span className="text-[11px] font-medium text-foreground/80 dark:text-white/78">
                          {task.label}
                        </span>
                        <span className="ml-2 font-mono text-[9px] text-muted-foreground dark:text-white/40">
                          {task.detail}
                        </span>
                      </span>
                    ) : (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "text-[11px]",
                          state === "running"
                            ? "font-medium text-foreground/85 dark:text-white/85"
                            : "text-muted-foreground/70 dark:text-white/35"
                        )}
                      >
                        {task.working}
                        {state === "running" ? (
                          <span className="hero-agent-typing-cursor ml-1">…</span>
                        ) : null}
                      </span>
                    )}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "font-mono text-[9px]",
                      state === "done"
                        ? "text-muted-foreground dark:text-white/40"
                        : state === "running"
                          ? "text-primary dark:text-icy"
                          : "text-muted-foreground/50 dark:text-white/25"
                    )}
                  >
                    {state === "done"
                      ? seconds(task.ms)
                      : state === "running"
                        ? "running"
                        : "queued"}
                  </span>
                  {state === "running" ? (
                    <span
                      aria-hidden="true"
                      className="hero-agent-progress absolute right-0 -bottom-1 left-8 h-0.5 rounded-full bg-primary/20 dark:bg-icy/20"
                    />
                  ) : null}
                </li>
              )
            })}
          </ol>

          <p
            className={cn(
              "mt-3 min-h-10 text-[13px] leading-5 text-foreground/85 transition-opacity duration-500 dark:text-white/82",
              summarized ? "opacity-100" : "opacity-0"
            )}
          >
            {script.reply}
          </p>
          <p
            className={cn(
              "mt-3 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/[0.06] px-2.5 py-1 text-[10px] font-medium text-primary transition-opacity duration-500 dark:border-icy/20 dark:bg-icy/[0.08] dark:text-icy",
              shownPhase >= finalPhase ? "opacity-100" : "opacity-0"
            )}
          >
            <UserCheck className="size-3" aria-hidden="true" />
            {script.outcome}
          </p>
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-md border border-primary/15 bg-primary/[0.035] px-3 py-2.5 dark:border-icy/12 dark:bg-icy/[0.035]">
          <LockKeyhole className="mt-0.5 size-3.5 shrink-0 text-primary dark:text-icy" />
          <p className="text-[10px] leading-4 text-foreground/75 dark:text-white/62">
            {labBoundary}
          </p>
        </div>
      </div>
    </figure>
  )
}
