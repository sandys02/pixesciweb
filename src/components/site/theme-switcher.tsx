"use client"

import { Monitor, Moon, Sun } from "lucide-react"

import { useTheme } from "@/components/theme-provider"

const themes = ["light", "dark", "system"] as const

type ThemeName = (typeof themes)[number]

const themeDetails = {
  light: {
    label: "Light",
    icon: Sun,
  },
  dark: {
    label: "Dark",
    icon: Moon,
  },
  system: {
    label: "System",
    icon: Monitor,
  },
} satisfies Record<ThemeName, { label: string; icon: typeof Sun }>

function isThemeName(value: string | undefined): value is ThemeName {
  return themes.includes(value as ThemeName)
}

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const currentTheme = isThemeName(theme) ? theme : "system"
  const currentIndex = themes.indexOf(currentTheme)
  const nextTheme = themes[(currentIndex + 1) % themes.length]
  const { icon: ThemeIcon, label } = themeDetails[currentTheme]
  const nextLabel = themeDetails[nextTheme].label

  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        onClick={() => setTheme(nextTheme)}
        aria-label={`${label} theme active. Switch to ${nextLabel} theme`}
        aria-describedby="footer-theme-tooltip"
        className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <ThemeIcon aria-hidden="true" className="size-4" />
      </button>
      <span
        id="footer-theme-tooltip"
        role="tooltip"
        className="pointer-events-none absolute bottom-full right-0 z-20 mb-2 w-max max-w-48 translate-y-1 rounded-md bg-foreground px-2.5 py-1.5 text-[11px] font-medium text-background opacity-0 shadow-md transition-[opacity,transform] group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
      >
        {label} theme. Switch to {nextLabel.toLowerCase()}.
      </span>
    </span>
  )
}
