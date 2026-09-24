import type { CSSProperties } from "react"

import { cn } from "@/lib/utils"

// Peaks are grouped into syllable-like bursts so the motion reads as speech.
const consolePeaks = [
  0.25, 0.45, 0.8, 1, 0.7, 0.35, 0.2, 0.5, 0.9, 0.65, 0.3, 0.55, 0.85, 1, 0.6,
  0.25, 0.4, 0.75, 0.5, 0.3, 0.6, 0.95, 0.7, 0.35,
]
const markPeaks = [0.35, 0.7, 1, 0.55, 0.3, 0.65, 0.9, 0.5, 0.3]

type VoiceWaveformProps = {
  active?: boolean
  size?: "mark" | "console"
  className?: string
}

export function VoiceWaveform({
  active = true,
  size = "console",
  className,
}: VoiceWaveformProps) {
  const peaks = size === "mark" ? markPeaks : consolePeaks

  return (
    <span
      aria-hidden="true"
      data-active={active}
      className={cn(
        "voice-waveform inline-flex items-center",
        size === "mark" ? "voice-waveform-mark h-3 gap-[1.5px]" : "h-7 gap-[2px]",
        className
      )}
    >
      {peaks.map((peak, index) => (
        <span
          key={index}
          className={cn(
            "voice-bar h-full rounded-full bg-current",
            size === "mark" ? "w-[2px]" : "w-[3px]"
          )}
          style={
            {
              "--peak": peak,
              "--dur": `${520 + ((index * 137) % 380)}ms`,
              "--delay": `${-((index * 173) % 900)}ms`,
            } as CSSProperties
          }
        />
      ))}
    </span>
  )
}
