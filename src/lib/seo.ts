import type { Metadata } from "next"

import { siteUrl } from "@/content/site"

type SeoMetadata = {
  title: string
  description: string
  path: `/${string}` | "/"
}

export function createMetadata({
  title,
  description,
  path,
}: SeoMetadata): Metadata {
  const brandedTitle = `${title} | PixeSci`

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "PixeSci",
      title: brandedTitle,
      description,
      url: path,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "PixeSci scientific workflow automation",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: brandedTitle,
      description,
      images: ["/opengraph-image"],
    },
  }
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "PixeSci",
  url: siteUrl,
  description:
    "Connect and automate scientific software. Teams describe work in plain language, run it locally, and track every step for review.",
}

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: "PixeSci",
  alternateName: "PixeSci Scientific Workflow Automation",
  description: "Connect, automate, and track scientific software workflows.",
  inLanguage: "en-US",
  publisher: {
    "@id": `${siteUrl}/#organization`,
  },
}

export const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${siteUrl}/product#software`,
  name: "PixeSci",
  url: `${siteUrl}/product`,
  applicationCategory: "ScientificApplication",
  applicationSubCategory: "Scientific workflow automation",
  operatingSystem: "Windows, macOS, Linux",
  description:
    "Connect scientific software, automate workflows, run work locally, and track each action, file, review, and result.",
  featureList: [
    "Visual scientific workflows",
    "Scientific software connections",
    "Local workflow execution",
    "Run history and output files",
    "Audit records and review checkpoints",
    "Local AI-assisted workflow planning",
  ],
  provider: {
    "@id": `${siteUrl}/#organization`,
  },
}

export function createFaqJsonLd(
  entries: readonly (readonly [string, string])[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  }
}
