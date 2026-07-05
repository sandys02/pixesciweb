// @/app/portal/page.tsx

import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Download } from "lucide-react"

import { DownloadPixeSciButton } from "@/components/site/download-pixesci-button"
import { PortalLogoutButton } from "@/components/site/portal-logout-button"
import { ThemeSwitcher } from "@/components/site/theme-switcher"
import {
  DOWNLOAD_SESSION_COOKIE,
  requireDownloadSession,
} from "@/backend/download-auth/auth"

export const metadata: Metadata = {
  title: "Portal",
  description: "Sign in to download PixeSci.",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function PortalPage() {
  const cookieStore = await cookies()
  const session = await requireDownloadSession(
    cookieStore.get(DOWNLOAD_SESSION_COOKIE)?.value
  )

  if (!session.ok) {
    redirect("/")
  }

  return (
    <main id="main-content" className="min-h-dvh bg-muted/20">
      <section className="site-container py-8 sm:py-10">
        <div className="flex gap-5 border-b border-border pb-6 flex-row justify-between items-end">
          <div>
            <p className="eyebrow">PixeSci Portal</p>
            <h1 className="mt-2 text-2xl leading-tight font-semibold sm:text-3xl">
              Download access
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Signed in as {session.user.email}
            </p>
          </div>
          <div className="flex items-start gap-2 sm:items-center justify-end">
            <ThemeSwitcher />
            <PortalLogoutButton className="items-start sm:items-end" />
          </div>
        </div>

        <div className="flex min-h-[calc(100dvh-11rem)] items-center justify-center py-12 lg:py-16">
          <div className="grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[0.86fr_1.14fr]">
            <div>
              <p className="eyebrow">Application installer</p>
              <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
                Download PixeSci
              </h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground">
                PixeSci connects and automates scientific software. Use it to
                describe work in plain language, review the steps, run workflows
                locally, and track actions, files, decisions, and results.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-background p-6 text-center shadow-sm sm:p-8">
              <div className="mx-auto flex size-12 items-center justify-center rounded-md border border-border bg-muted/40">
                <Download className="size-5 text-primary" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">
                PixeSci application installer
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                The installer remains protected by your portal session. Sign out
                when you are finished.
              </p>
              <div className="mt-6 flex justify-center">
                <DownloadPixeSciButton source="portal" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
