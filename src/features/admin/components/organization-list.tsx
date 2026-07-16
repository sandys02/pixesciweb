"use client"

import { cn } from "@/lib/utils"

import type { OrganizationListItem } from "../types/admin"

export function OrganizationList({
  organizations,
  selectedId,
  onSelect,
}: {
  organizations: OrganizationListItem[]
  selectedId: number | null
  onSelect: (id: number) => void
}) {
  return (
    <section className="rounded-lg border border-border bg-background shadow-sm">
      <div className="border-b border-border p-4">
        <p className="eyebrow">Organizations</p>
        <h2 className="mt-1 font-semibold">Customer organizations</h2>
      </div>
      <div className="max-h-[36rem] overflow-y-auto">
        {organizations.map((organization) => (
          <button
            key={organization.id}
            type="button"
            className={cn(
              "block w-full border-b border-border/70 p-4 text-left text-sm hover:bg-muted/40",
              selectedId === organization.id && "bg-muted"
            )}
            onClick={() => onSelect(organization.id)}
          >
            <span className="font-medium">{organization.name}</span>
            <span className="mt-1 block text-xs text-muted-foreground">
              {organization.domain} / {organization.status}
            </span>
          </button>
        ))}
        {organizations.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">
            No organizations are available.
          </p>
        ) : null}
      </div>
    </section>
  )
}
