import type { MetadataRoute } from "next"

import { siteUrl } from "@/content/site"

const routes = [
  "",
  "/product",
  "/solutions/regulated-life-sciences",
  "/solutions/secure-research",
  "/solutions/core-facilities",
  "/integrations",
  "/compliance",
  "/security",
  "/workflow-automation",
  "/resources",
  "/company",
  "/privacy",
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route, index) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date("2026-06-14"),
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : index < 9 ? 0.8 : 0.6,
  }))
}
