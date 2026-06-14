import Link from "next/link"

import { primaryNavigation } from "@/content/site"

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
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden lg:flex">
          <Link href="/contact" className="button button-primary">
            Request a demo
          </Link>
        </div>
        <MobileNav />
      </div>
    </header>
  )
}
