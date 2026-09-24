"use client"

import * as React from "react"
import { Pause, Play } from "lucide-react"

import { useReducedMotion } from "@/lib/use-motion"
import { cn } from "@/lib/utils"

const rotateEveryMs = 6500

type HeroRotatorProps = {
  messages: readonly string[]
}

export function HeroRotator({ messages }: HeroRotatorProps) {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = React.useState(0)
  const [paused, setPaused] = React.useState(false)
  const [hovered, setHovered] = React.useState(false)
  const [focused, setFocused] = React.useState(false)

  const count = messages.length
  const rotating =
    count > 1 && !reduceMotion && !paused && !hovered && !focused

  React.useEffect(() => {
    if (!rotating) return
    const timer = window.setTimeout(
      () => setIndex((current) => (current + 1) % count),
      rotateEveryMs
    )
    return () => window.clearTimeout(timer)
  }, [rotating, index, count])

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <div className="grid">
        {messages.map((message, position) => (
          <p
            key={message}
            aria-hidden={position !== index}
            className={cn(
              "col-start-1 row-start-1 max-w-2xl text-base leading-7 text-muted-foreground transition-opacity duration-700 sm:text-lg sm:leading-8",
              position === index
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            )}
          >
            {message}
          </p>
        ))}
      </div>

      {count > 1 ? (
        <div className="mt-3 flex items-center gap-2">
          <div
            role="group"
            aria-label="Choose message"
            className="flex items-center"
          >
            {messages.map((message, position) => (
              <button
                key={message}
                type="button"
                aria-label={`Show message ${position + 1} of ${count}`}
                aria-current={position === index}
                onClick={() => setIndex(position)}
                className="flex size-6 items-center justify-center rounded-full"
              >
                <span
                  className={cn(
                    "block h-1.5 rounded-full transition-all duration-300",
                    position === index
                      ? "w-6 bg-primary"
                      : "w-1.5 bg-muted-foreground/35"
                  )}
                />
              </button>
            ))}
          </div>
          {reduceMotion ? null : (
            <button
              type="button"
              aria-label={
                paused ? "Play rotating messages" : "Pause rotating messages"
              }
              onClick={() => setPaused((current) => !current)}
              className="flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
            >
              {paused ? (
                <Play className="size-3.5" aria-hidden="true" />
              ) : (
                <Pause className="size-3.5" aria-hidden="true" />
              )}
            </button>
          )}
        </div>
      ) : null}
    </div>
  )
}
