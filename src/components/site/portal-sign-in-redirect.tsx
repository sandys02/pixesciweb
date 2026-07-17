"use client"

import * as React from "react"
import { toast } from "sonner"

import { SignInPortalDialog } from "./download-pixesci-button"

export function PortalSignInRedirect() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const url = new URL(window.location.href)
    const shouldOpenPortalSignIn = url.searchParams.get("portal") === "sign-in"
    const passwordChanged = url.searchParams.get("passwordChanged") === "1"

    if (!shouldOpenPortalSignIn) return

    const openTimeout = window.setTimeout(() => {
      setOpen(true)
    }, 0)
    const toastTimeout = passwordChanged
      ? window.setTimeout(() => {
          toast.success(
            "Password changed. Sign in with your registered email and new password."
          )
        }, 100)
      : undefined

    url.searchParams.delete("portal")
    url.searchParams.delete("passwordChanged")
    const nextUrl = `${url.pathname}${url.search}${url.hash}`
    window.history.replaceState(window.history.state, "", nextUrl || "/")

    return () => {
      window.clearTimeout(openTimeout)
      if (toastTimeout) window.clearTimeout(toastTimeout)
    }
  }, [])

  return (
    <SignInPortalDialog
      open={open}
      source="password_reset_redirect"
      onOpenChange={setOpen}
    />
  )
}
