import type { AuditEvent } from "../types/admin"

export function AuditPanel({ events }: { events: AuditEvent[] }) {
  return (
    <section className="rounded-lg border border-border bg-background p-5 shadow-sm">
      <p className="eyebrow">Audit</p>
      <h2 className="mt-1 font-semibold">Recent events</h2>
      <div className="mt-4 divide-y divide-border">
        {events.slice(0, 12).map((event) => (
          <div key={event.id} className="py-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">{event.eventType}</p>
              <time className="text-xs text-muted-foreground">{event.createdAt}</time>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {event.actorType} / {event.targetType} / {event.targetId}
            </p>
          </div>
        ))}
        {events.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">No audit events.</p>
        ) : null}
      </div>
    </section>
  )
}
