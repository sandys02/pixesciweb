import Link from "next/link"

import {
  complianceDisclaimer,
  demoBookingUrl,
  footerNavigation,
} from "@/content/site"

import { DemoBookingLink } from "./demo-booking-link"
import { Logo } from "./logo"
import { ThemeSwitcher } from "./theme-switcher"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="site-container py-14 sm:py-18">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div className="max-w-md">
            <Logo />
            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              Connect scientific software, automate workflows, and track every
              step.
            </p>
            <DemoBookingLink
              source="footer_primary"
              className="mt-6 inline-flex text-sm font-medium text-primary hover:underline"
            >
              Request a demo
            </DemoBookingLink>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerNavigation.map((group) => (
              <div key={group.title}>
                <h2 className="text-xs font-semibold tracking-[0.12em] text-foreground uppercase">
                  {group.title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href + link.label}>
                      {link.href === demoBookingUrl ? (
                        <DemoBookingLink
                          source="footer_navigation"
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </DemoBookingLink>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-6">
          <p className="max-w-4xl text-xs leading-5 text-muted-foreground">
            {complianceDisclaimer}
          </p>
          <div className="mt-5 flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} PixeSci. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <p>Scientific software integration and automation.</p>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
