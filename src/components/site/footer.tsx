import Link from "next/link"

import { complianceDisclaimer, footerNavigation } from "@/content/site"

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
              Local-first integration, automation, and traceability for
              fragmented scientific software.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex text-sm font-medium text-primary hover:underline"
            >
              Contact Pixesci
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerNavigation.map((group) => (
              <div key={group.title}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground">
                  {group.title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
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
            <p>© {new Date().getFullYear()} Pixesci. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <p>Scientific workflow orchestration infrastructure.</p>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
