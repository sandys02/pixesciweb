"use client"

import * as React from "react"
import { ChevronDown, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { platformNavigation, primaryNavigation } from "@/content/site"
import { cn } from "@/lib/utils"

import { DemoBookingLink } from "./demo-booking-link"
import { SignInPortalDialog } from "./download-pixesci-button"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const [portalSignInOpen, setPortalSignInOpen] = React.useState(false)
  const pathname = usePathname()
  const dialogRef = React.useRef<HTMLDialogElement>(null)

  React.useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <div className="lg:hidden">
      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="size-4" />
      </Button>
      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        className="m-0 ml-auto h-dvh max-h-none w-[min(92vw,420px)] max-w-none border-0 border-l border-border bg-background p-0 text-foreground backdrop:bg-foreground/35"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-border px-5">
            <span className="text-sm font-semibold">Navigation</span>
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
            >
              <X className="size-4" />
            </Button>
          </div>
          <nav
            aria-label="Mobile navigation"
            className="flex-1 overflow-y-auto p-5"
          >
            <ul className="divide-y divide-border border-y border-border">
              {primaryNavigation.map((item) =>
                item.label === "Platform" ? (
                  <li key={item.href}>
                    <details className="group py-5">
                      <summary className="flex cursor-pointer list-none items-center justify-between focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
                        <span>
                          <span className="block text-base font-medium">
                            {item.label}
                          </span>
                          <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                            {item.description}
                          </span>
                        </span>
                        <ChevronDown
                          className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                          aria-hidden="true"
                        />
                      </summary>
                      <ul className="mt-3 space-y-3 border-l border-border pl-4">
                        {platformNavigation.map((platformItem) => (
                          <li key={platformItem.href}>
                            <Link
                              href={platformItem.href}
                              onClick={() => setOpen(false)}
                              className={cn(
                                "block py-1 text-sm font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                                pathname === platformItem.href && "text-primary"
                              )}
                            >
                              {platformItem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block py-5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                        pathname === item.href && "text-primary"
                      )}
                    >
                      <span className="block text-base font-medium">
                        {item.label}
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </span>
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>
          <div className="grid gap-3 border-t border-border p-5">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full px-4"
              onClick={() => {
                setOpen(false)
                setPortalSignInOpen(true)
              }}
            >
              Sign In
            </Button>
            <Button asChild size="lg" className="w-full px-4">
              <DemoBookingLink
                source="mobile_navigation"
                onClick={() => setOpen(false)}
              >
                Request a demo
              </DemoBookingLink>
            </Button>
          </div>
        </div>
      </dialog>
      <SignInPortalDialog
        open={portalSignInOpen}
        source="mobile_navigation"
        onOpenChange={setPortalSignInOpen}
      />
    </div>
  )
}
