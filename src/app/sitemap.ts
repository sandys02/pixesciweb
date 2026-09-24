import type { MetadataRoute } from "next"

import { siteUrl } from "@/content/site"

const routes = [
  "",
  "/solutions",
  "/platform/agents",
  "/platform/workflow-automation",
  "/solutions/regulated-life-sciences",
  "/integrations",
  "/security",
  "/resources",
  "/company",
  "/privacy",
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route, index) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date("2026-06-14"),
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : index < 7 ? 0.8 : 0.6,
  }))
}
