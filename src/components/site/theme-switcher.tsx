"use client"

import * as React from "react"
import { Monitor, Moon, Sun } from "lucide-react"

import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

const themes = ["light", "dark", "system"] as const
const subscribe = () => () => {}

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
  const mounted = React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )

  if (!mounted) {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Select color theme"
        className="text-muted-foreground"
        disabled
      >
        <Monitor aria-hidden="true" className="size-4" />
      </Button>
    )
  }

  const currentTheme = isThemeName(theme) ? theme : "system"
  const currentIndex = themes.indexOf(currentTheme)
  const nextTheme = themes[(currentIndex + 1) % themes.length]
  const { icon: ThemeIcon, label } = themeDetails[currentTheme]
  const nextLabel = themeDetails[nextTheme].label

  return (
    <span className="group relative inline-flex">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setTheme(nextTheme)}
        aria-label={`${label} theme active. Switch to ${nextLabel} theme`}
        aria-describedby="footer-theme-tooltip"
        className="text-muted-foreground"
      >
        <ThemeIcon aria-hidden="true" className="size-4" />
      </Button>
      <span
        id="footer-theme-tooltip"
        role="tooltip"
        className="pointer-events-none absolute right-0 bottom-full z-20 mb-2 w-max max-w-48 translate-y-1 rounded-md bg-foreground px-2.5 py-1.5 text-[11px] font-medium text-background opacity-0 shadow-md transition-[opacity,transform] group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
      >
        {label} theme. Switch to {nextLabel.toLowerCase()}.
      </span>
    </span>
  )
}
