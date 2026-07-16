"use client"

import * as React from "react"
import { Copy, Download } from "lucide-react"

import { Button } from "@/components/ui/button"

import type { PortalSeatActivation } from "../types/portal"
import { formatPortalTimestamp } from "./metrics-and-status"

export function SeatActivationPanel({
  activation,
}: {
  activation: PortalSeatActivation
}) {
  const [message, setMessage] = React.useState("")

  async function copyActivation() {
    try {
      await navigator.clipboard.writeText(activation.armoredActivation)
      setMessage("Activation copied.")
    } catch {
      setMessage("Copy is unavailable in this browser.")
    }
  }

  function downloadActivation() {
    const blob = new Blob([activation.armoredActivation], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `${activation.seatId}-activation.pixesci-seat.txt`
    anchor.click()
    URL.revokeObjectURL(url)
    setMessage("Activation download prepared.")
  }

  return (
    <div className="border-t border-border bg-background p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h4 className="text-sm font-semibold">Seat activation export</h4>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Import this signed file in the local PixeSci app for the invited
            user. The portal seat remains pending until a future return file or
            connected acceptance flow confirms activation.
          </p>
        </div>
        <div className="grid gap-1 text-xs text-muted-foreground sm:text-right">
          <span>
            Seat <span className="font-mono text-foreground">{activation.seatId}</span>
          </span>
          <span>
            Expires{" "}
            <span className="text-foreground">
              {formatPortalTimestamp(activation.expiresAt)}
            </span>
          </span>
        </div>
      </div>
      <textarea
        readOnly
        className="mt-3 min-h-32 w-full resize-y rounded-md border border-border bg-muted/30 p-3 font-mono text-xs leading-5 outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
        value={activation.armoredActivation}
        aria-label={`Armored seat activation for ${activation.seatId}`}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            void copyActivation()
          }}
        >
          <Copy className="size-4" />
          Copy
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={downloadActivation}
        >
          <Download className="size-4" />
          Download text
        </Button>
      </div>
      {message ? (
        <p role="status" className="mt-3 text-sm text-primary">
          {message}
        </p>
      ) : null}
    </div>
  )
}
