"use client"

import * as React from "react"
import { Copy, Download, FileSignature } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import type { PortalLicense, PortalLicenseBundle } from "../types/portal"
import { formatPortalTimestamp } from "./metrics-and-status"

export function LicenseBundlePanel({
  bundle,
  license,
  loading,
  onGenerate,
  onRefreshLatest,
}: {
  bundle: PortalLicenseBundle | null
  license: PortalLicense
  loading: boolean
  onGenerate: (licenseId: string) => Promise<PortalLicenseBundle>
  onRefreshLatest: (licenseId: string) => Promise<void>
}) {
  const [message, setMessage] = React.useState("")
  const [pending, setPending] = React.useState(false)

  async function generateBundle() {
    setPending(true)
    setMessage("")

    try {
      await onGenerate(license.id)
      setMessage("Offline bundle generated.")
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Offline bundle generation is temporarily unavailable."
      )
    } finally {
      setPending(false)
    }
  }

  async function refreshLatest() {
    setPending(true)
    setMessage("")

    try {
      await onRefreshLatest(license.id)
      setMessage("Latest bundle refreshed.")
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Latest bundle is temporarily unavailable."
      )
    } finally {
      setPending(false)
    }
  }

  async function copyBundle() {
    if (!bundle) return

    try {
      await navigator.clipboard.writeText(bundle.armoredBundle)
      setMessage("Bundle copied.")
    } catch {
      setMessage("Copy is unavailable in this browser.")
    }
  }

  function downloadBundle() {
    if (!bundle) return

    const blob = new Blob([bundle.armoredBundle], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `${license.id}-bundle-v${bundle.bundleVersion}.pixesci-license.txt`
    anchor.click()
    URL.revokeObjectURL(url)
    setMessage("Bundle download prepared.")
  }

  const disabled = pending || loading

  return (
    // TODO: Unhide and finish the flow later when it is ready to be used for enterprise and organizations that require a tight air-gapped/offline environment. Academia does not have too many security requirements.
    <div className="hidden mt-4 min-w-0 rounded-lg border border-border bg-background p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold">Offline license bundle</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Generate a signed license bundle for customer-controlled operation.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={disabled}
            onClick={() => {
              void refreshLatest()
            }}
          >
            {loading ? "Loading..." : "Latest"}
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={disabled}
            onClick={() => {
              void generateBundle()
            }}
          >
            <FileSignature className="size-4" />
            {pending ? "Generating..." : "Generate"}
          </Button>
        </div>
      </div>

      {bundle ? (
        <div className="mt-4 grid gap-3">
          <div className="grid gap-3 text-xs text-muted-foreground sm:grid-cols-3">
            <p>
              Version{" "}
              <span className="font-mono text-foreground">
                {bundle.bundleVersion}
              </span>
            </p>
            <p>
              Key{" "}
              <span className="font-mono text-foreground">{bundle.keyId}</span>
            </p>
            <p>
              Issued{" "}
              <span className="text-foreground">
                {formatPortalTimestamp(bundle.generatedAt)}
              </span>
            </p>
          </div>
          <textarea
            readOnly
            className="min-h-36 w-full resize-y rounded-md border border-border bg-muted/30 p-3 font-mono text-xs leading-5 outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
            value={bundle.armoredBundle}
            aria-label={`Armored offline bundle for ${license.id}`}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                void copyBundle()
              }}
            >
              <Copy className="size-4" />
              Copy
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={downloadBundle}
            >
              <Download className="size-4" />
              Download text
            </Button>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          No signed offline bundle has been generated for this license.
        </p>
      )}

      {message ? (
        <p
          role={message.includes("unavailable") ? "alert" : "status"}
          className={cn(
            "mt-3 text-sm",
            message.includes("unavailable") ? "text-destructive" : "text-primary"
          )}
        >
          {message}
        </p>
      ) : null}
    </div>
  )
}
