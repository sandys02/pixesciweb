"use client"

import { Settings, ShieldCheck } from "lucide-react"

import { DownloadPixeSciButton } from "@/components/site/download-pixesci-button"
import { PortalLogoutButton } from "@/components/site/portal-logout-button"
import { ThemeSwitcher } from "@/components/site/theme-switcher"
import { Button } from "@/components/ui/button"

import type { PortalView } from "../types/shell"

export function PortalFrame({
  children,
  sessionEmail,
}: {
  children: React.ReactNode
  sessionEmail: string
}) {
  return (
    <main id="main-content" className="min-h-dvh bg-muted/20">
      <section className="site-container py-8 sm:py-10">
        <div className="flex flex-row items-end justify-between gap-5 border-b border-border pb-6">
          <div>
            <p className="eyebrow">PixeSci Portal</p>
            <h1 className="mt-2 text-2xl leading-tight font-semibold sm:text-3xl">
              Organization Portal
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Organization portal account: {sessionEmail}
            </p>
          </div>
          <div className="flex items-start justify-end gap-2 sm:items-center">
            <ThemeSwitcher />
            <PortalLogoutButton className="items-start sm:items-end" />
          </div>
        </div>
        {children}
      </section>
    </main>
  )
}

export function PortalTabs({
  onViewChange,
  view,
}: {
  onViewChange: (view: PortalView) => void
  view: PortalView
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={view === "licenses" ? "default" : "outline"}
          onClick={() => onViewChange("licenses")}
        >
          <ShieldCheck className="size-4" />
          Licenses
        </Button>
        <Button
          type="button"
          variant={view === "settings" ? "default" : "outline"}
          onClick={() => onViewChange("settings")}
        >
          <Settings className="size-4" />
          Settings
        </Button>
      </div>
      <DownloadPixeSciButton source="portal" />
    </div>
  )
}
