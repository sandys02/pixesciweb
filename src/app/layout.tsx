import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { SiteFooter } from "@/components/site/footer"
import { SiteHeader } from "@/components/site/header"
import { JsonLd } from "@/components/seo/json-ld"
import { ThemeProvider } from "@/components/theme-provider"
import { siteUrl } from "@/content/site"
import { cn } from "@/lib/utils"
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo"

import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pixesci | Scientific workflow orchestration",
    template: "%s | Pixesci",
  },
  description:
    "PixeSci is a compliance-first AI platform that automates regulated biotech workflows, integrates QC software, and delivers reproducible, audit-ready scientific operations through natural language commands.",
  applicationName: "Pixesci",
  creator: "Pixesci",
  publisher: "Pixesci",
  category: "Scientific workflow orchestration",
  keywords: [
    "compliance-first AI",
    "scientific workflow automation",
    "lab software integration",
    "local-first orchestration",
    "audit trail",
    "on-prem scientific software",
    "reproducible workflows",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(geist.variable, geistMono.variable, "font-sans antialiased")}
    >
      <body>
        <JsonLd data={[organizationJsonLd, websiteJsonLd]} />
        <ThemeProvider defaultTheme="light" enableSystem>
          <a
            href="#main-content"
            className="sr-only z-[100] bg-background px-4 py-3 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          >
            Skip to content
          </a>
          <SiteHeader />
          <div id="main-content">{children}</div>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  )
}
