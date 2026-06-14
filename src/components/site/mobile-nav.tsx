"use client"

import * as React from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { primaryNavigation } from "@/content/site"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
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
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="grid size-10 place-items-center rounded-md border border-border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Open navigation"
      >
        <Menu className="size-4" />
      </button>
      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        className="m-0 ml-auto h-dvh max-h-none w-[min(92vw,420px)] max-w-none border-0 border-l border-border bg-background p-0 text-foreground backdrop:bg-foreground/35"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-border px-5">
            <span className="text-sm font-semibold">Navigation</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid size-10 place-items-center rounded-md border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Close navigation"
            >
              <X className="size-4" />
            </button>
          </div>
          <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto p-5">
            <ul className="divide-y divide-border border-y border-border">
              {primaryNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      pathname === item.href && "text-primary",
                    )}
                  >
                    <span className="block text-base font-medium">{item.label}</span>
                    <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="border-t border-border p-5">
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="button button-primary w-full"
            >
              Request a demo
            </Link>
          </div>
        </div>
      </dialog>
    </div>
  )
}
