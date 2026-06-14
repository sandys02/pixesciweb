// @/app/layout.tsx

import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
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
import { Toaster } from "sonner"

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
    default: "PixeSci | Connect and automate scientific software",
    template: "%s | PixeSci",
  },
  description:
    "Connect and automate scientific software. Talk to your lab in natural language, run workflows locally, and track every step for review.",
  applicationName: "PixeSci",
  creator: "PixeSci",
  publisher: "PixeSci",
  category: "Scientific workflow automation",
  keywords: [
    "compliance-first AI",
    "scientific workflow automation",
    "lab software integration",
    "local-first workflow automation",
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
      className={cn(
        geist.variable,
        geistMono.variable,
        "font-sans antialiased"
      )}
    >
      <body>
        <JsonLd data={[organizationJsonLd, websiteJsonLd]} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="pixesci-theme"
        >
          <a
            href="#main-content"
            className="sr-only z-[100] bg-background px-4 py-3 focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
          >
            Skip to content
          </a>
          <SiteHeader />
          <div id="main-content">
            {children}
            <Toaster position="bottom-right" />
          </div>
          <SiteFooter />
          <SpeedInsights />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
