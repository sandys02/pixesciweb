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
  const brandedTitle = `${title} | Pixesci`

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "Pixesci",
      title: brandedTitle,
      description,
      url: path,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Pixesci scientific workflow orchestration",
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
  name: "Pixesci",
  url: siteUrl,
  description:
    "PixeSci is a compliance-first AI platform that automates regulated biotech workflows, integrates QC software, and delivers reproducible, audit-ready scientific operations through natural language commands.",
}

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: "Pixesci",
  alternateName: "Pixesci Scientific Workflow Orchestration",
  description:
    "Scientific workflow orchestration for regulated life sciences, secure research, and core facilities.",
  inLanguage: "en-US",
  publisher: {
    "@id": `${siteUrl}/#organization`,
  },
}

export const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${siteUrl}/product#software`,
  name: "Pixesci",
  url: `${siteUrl}/product`,
  applicationCategory: "ScientificApplication",
  applicationSubCategory: "Scientific workflow orchestration",
  operatingSystem: "Windows, macOS, Linux",
  description:
    "A compliance-first orchestration and execution layer that connects scientific software into reusable, traceable workflows.",
  featureList: [
    "Graph-native scientific workflows",
    "Scientific software capability profiles",
    "Local workflow execution",
    "Run history and artifacts",
    "Audit records and review checkpoints",
    "Local AI-assisted workflow planning",
  ],
  provider: {
    "@id": `${siteUrl}/#organization`,
  },
}

export function createFaqJsonLd(
  entries: readonly (readonly [string, string])[],
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
