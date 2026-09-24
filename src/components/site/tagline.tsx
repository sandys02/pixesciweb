import { tagline } from "@/content/site"
import { cn } from "@/lib/utils"

import { VoiceWaveform } from "@/components/visuals/voice-waveform"

type TaglineProps = {
  trademark?: boolean
  waveform?: "mark" | "console"
  onDark?: boolean
  className?: string
}

export function Tagline({
  trademark = false,
  waveform = "mark",
  onDark = false,
  className,
}: TaglineProps) {
  return (
    <span
      className={cn(
        "inline-flex flex-wrap items-center",
        waveform === "mark" ? "gap-2.5" : "gap-x-4 gap-y-2",
        className
      )}
    >
      <VoiceWaveform
        size={waveform}
        className={onDark ? "text-icy" : "text-primary dark:text-icy"}
      />
      <span>
        {tagline}
        {trademark ? "™" : null}
      </span>
    </span>
  )
}
