import Link from "next/link"

import {
  categoryLine,
  complianceDisclaimer,
  demoBookingUrl,
  footerNavigation,
} from "@/content/site"

import { BrandName, TrademarkText } from "./brand-name"
import { DemoBookingLink } from "./demo-booking-link"
import { SignInPortalButton } from "./download-pixesci-button"
import { Logo } from "./logo"
import { ThemeSwitcher } from "./theme-switcher"

export function SiteFooter() {
  return (
    <footer className="metal-edge metal-edge-top border-t border-border bg-[linear-gradient(180deg,#eef2f8,#e2e9f3)] dark:bg-[linear-gradient(180deg,#14223a,#0e1826)]">
      <div className="site-container py-14 sm:py-18">
        <div className="space-y-12">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-start sm:gap-12">
            <div className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
              <Logo />
              <p className="text-sm leading-6 text-muted-foreground">
                <TrademarkText text={categoryLine} />
              </p>
              <p className="tech-label">
                Data · Quality · Compliance · Confidence
              </p>
            </div>
            <div className=" space-y-4 sm:space-y-0 sm:space-x-6">
              <DemoBookingLink
                source="footer_primary"
                className="mt-6 inline-flex text-sm font-medium text-primary hover:underline"
              >
                Request a demo
              </DemoBookingLink>
              <SignInPortalButton
                source="footer"
                variant="outline"
                size="lg"
                buttonClassName="px-4"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:max-w-3xl">
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
          <p className="text-xs leading-5 text-muted-foreground">
            {complianceDisclaimer}
          </p>
          <div className="mt-5 flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} <BrandName />. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <p>Change Theme</p>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
