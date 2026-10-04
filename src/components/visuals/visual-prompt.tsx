"use client"

import * as React from "react"

import type { VisualPromptData } from "@/content/visual-prompts"
import { useReducedMotion } from "@/lib/use-motion"
import { cn } from "@/lib/utils"

import { VoiceWaveform } from "./voice-waveform"

const speakMs = 1600
const typeEveryMs = 28

type VisualPromptProps = {
  prompt: VisualPromptData
  className?: string
}

export function VisualPrompt({ prompt, className }: VisualPromptProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const [started, setStarted] = React.useState(false)
  const [spoken, setSpoken] = React.useState(false)
  const [typed, setTyped] = React.useState(0)

  React.useEffect(() => {
    const element = ref.current
    if (!element || started || typeof IntersectionObserver === "undefined") {
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.6 }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [started])

  React.useEffect(() => {
    if (!started || reduceMotion) return
    if (!spoken) {
      const timer = window.setTimeout(() => setSpoken(true), speakMs)
      return () => window.clearTimeout(timer)
    }
    if (typed < prompt.text.length) {
      const timer = window.setTimeout(() => setTyped(typed + 1), typeEveryMs)
      return () => window.clearTimeout(timer)
    }
  }, [started, spoken, typed, reduceMotion, prompt.text.length])

  const shownTyped = reduceMotion ? prompt.text.length : typed
  const speaking = started && !spoken && !reduceMotion
  const typing = spoken && shownTyped < prompt.text.length

  return (
    <div
      ref={ref}
      className={cn(
        "mb-3 flex items-center gap-3 rounded-md border border-border bg-background/80 px-3 py-2.5 dark:border-white/10 dark:bg-white/[0.03]",
        className
      )}
    >
      <VoiceWaveform
        size="mark"
        active={speaking}
        className={cn(
          "shrink-0 transition-colors duration-500",
          speaking || !started
            ? "text-primary dark:text-icy"
            : "text-muted-foreground/50 dark:text-white/35"
        )}
      />
      <span className="tech-label hidden shrink-0 sm:inline">
        {prompt.kind === "ask" ? "You asked" : "You said"}
      </span>
      <span className="grid min-w-0 text-sm leading-5 font-medium text-foreground/85 dark:text-white/85">
        <span className="sr-only">
          {prompt.kind === "ask" ? "You asked: " : "You said: "}
          {prompt.text}
        </span>
        <span aria-hidden="true" className="invisible col-start-1 row-start-1">
          {prompt.text}
        </span>
        <span aria-hidden="true" className="col-start-1 row-start-1">
          {prompt.text.slice(0, shownTyped)}
          {typing ? (
            <span className="hero-agent-typing-cursor ml-0.5 inline-block h-3.5 w-px bg-current align-middle" />
          ) : null}
        </span>
      </span>
    </div>
  )
}
