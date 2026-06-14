"use client"

import * as React from "react"
import { track } from "@vercel/analytics"
import Link from "next/link"

import { demoBookingUrl } from "@/content/site"

type DemoBookingLinkProps = Omit<
  React.ComponentPropsWithoutRef<typeof Link>,
  "href" | "rel" | "target"
> & {
  source: string
}

export const DemoBookingLink = React.forwardRef<
  HTMLAnchorElement,
  DemoBookingLinkProps
>(function DemoBookingLink(
  { children, onClick, source, ...props },
  ref
) {
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    try {
      track("demo_booking_clicked", {
        source,
        label:
          typeof children === "string"
            ? children
            : event.currentTarget.innerText,
        path: window.location.pathname,
      })
    } catch {
      // Analytics must never block access to the booking calendar.
    }

    onClick?.(event)
  }

  return (
    <Link
      ref={ref}
      href={demoBookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  )
})
