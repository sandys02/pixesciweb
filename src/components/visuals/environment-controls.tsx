import {
  Check,
  CloudOff,
  FileClock,
  FolderLock,
  KeyRound,
  ShieldCheck,
  UserCheck,
} from "lucide-react"

const controls = [
  {
    title: "Data location",
    value: "Approved local folders",
    icon: FolderLock,
  },
  {
    title: "Public internet",
    value: "Blocked",
    icon: CloudOff,
  },
  {
    title: "Controlled actions",
    value: "Approval required",
    icon: UserCheck,
  },
  {
    title: "Credentials",
    value: "Stored locally",
    icon: KeyRound,
  },
  {
    title: "Run records",
    value: "Audit logging on",
    icon: FileClock,
  },
  {
    title: "Backup policy",
    value: "Customer managed",
    icon: ShieldCheck,
  },
]

const reviewChecks = [
  "Software access follows approved policy",
  "High-risk steps pause for a person",
  "Run records stay with the workflow",
]

export function EnvironmentControls() {
  return (
    <figure
      className="visual-frame overflow-hidden border-white/12 bg-white/[0.035]"
      aria-label="PixeSci TM environment controls showing local data, blocked public internet, required approvals, local credentials, audit logging, and customer-managed backups"
    >
      <figcaption className="visual-toolbar border-white/10 bg-white/[0.025] text-white">
        <span>Environment controls</span>
        <span className="inline-flex items-center gap-1.5 text-cyan-300">
          <ShieldCheck className="size-3.5" />
          Policy active
        </span>
      </figcaption>
      <div className="workflow-grid-dark p-5 sm:p-8">
        <div className="grid gap-3 sm:grid-cols-2">
          {controls.map((control) => {
            const Icon = control.icon

            return (
              <div
                key={control.title}
                className="rounded-md border border-white/12 bg-[#0d1418] p-4 sm:p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[9px] tracking-[0.12em] text-white/35 uppercase">
                      {control.title}
                    </p>
                    <p className="mt-2 text-sm font-medium text-white">
                      {control.value}
                    </p>
                  </div>
                  <span className="grid size-8 shrink-0 place-items-center rounded-md border border-cyan-300/20 bg-cyan-300/[0.07] text-cyan-300">
                    <Icon className="size-4" />
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 rounded-md border border-cyan-300/20 bg-cyan-300/[0.06] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-medium text-white">
              Before a run starts
            </p>
            <span className="font-mono text-[9px] text-cyan-300">
              3 / 3 checked
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {reviewChecks.map((check) => (
              <div
                key={check}
                className="flex items-center gap-2.5 text-[10px] text-white/60"
              >
                <span className="grid size-4 shrink-0 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
                  <Check className="size-2.5" />
                </span>
                {check}
              </div>
            ))}
          </div>
        </div>
      </div>
    </figure>
  )
}
