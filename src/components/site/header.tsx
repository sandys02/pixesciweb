import Link from "next/link"

import { Button } from "@/components/ui/button"
import { primaryNavigation } from "@/content/site"

import { DemoBookingLink } from "./demo-booking-link"
import { Logo } from "./logo"
import { MobileNav } from "./mobile-nav"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/92 backdrop-blur-xl">
      <div className="site-container flex h-16 items-center justify-between gap-5">
        <Logo />
        <nav aria-label="Primary navigation" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {primaryNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden lg:flex">
          <Button asChild size="lg" className="px-4">
            <DemoBookingLink source="header">
              Request a demo
            </DemoBookingLink>
          </Button>
        </div>
        <MobileNav />
      </div>
    </header>
  )
}
