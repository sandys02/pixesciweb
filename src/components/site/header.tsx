import Link from "next/link"

import { Button } from "@/components/ui/button"
import { primaryNavigation } from "@/content/site"

import { DemoBookingLink } from "./demo-booking-link"
import { SignInPortalButton } from "./download-pixesci-button"
import { Logo } from "./logo"
import { MobileNav } from "./mobile-nav"
import { PlatformNavDropdown } from "./platform-nav-dropdown"

export function SiteHeader() {
  return (
    <header className="metal-edge metal-edge-bottom sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
      <div className="site-container flex h-16 items-center justify-between gap-5">
        <Logo />
        <nav aria-label="Primary navigation" className="hidden xl:block">
          <ul className="flex items-center gap-0.5">
            {primaryNavigation.map((item) =>
              item.label === "Solutions" ? (
                <li key={item.href}>
                  <PlatformNavDropdown />
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="rounded-md px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                  >
                    {item.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>
        <div className="hidden items-center gap-2 xl:flex">
          <SignInPortalButton source="header" />
          <Button asChild size="lg" className="px-4">
            <DemoBookingLink source="header">Request a demo</DemoBookingLink>
          </Button>
        </div>
        <MobileNav />
      </div>
    </header>
  )
}
