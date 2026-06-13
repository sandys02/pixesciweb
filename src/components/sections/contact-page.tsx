import {
  CheckCircle2,
  ClipboardList,
  MapPinned,
  ShieldCheck,
} from "lucide-react"

import { ContactForm } from "./contact-form"

export function ContactPage() {
  return (
    <main>
      <section className="hero-grid border-b border-border">
        <div className="site-container py-18 sm:py-24 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <p className="eyebrow">Request a demo</p>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.05] sm:text-6xl">
                Map a scientific workflow with Pixesci.
              </h1>
              <p className="mt-6 text-base leading-7 text-muted-foreground sm:text-lg">
                Tell us which software, files, manual handoffs, review points,
                and deployment constraints define the process.
              </p>
              <div className="mt-8 space-y-5 border-t border-border pt-6">
                {[
                  {
                    title: "Workflow mapping",
                    description:
                      "Identify capability nodes, data flow, variables, and human checkpoints.",
                    icon: MapPinned,
                  },
                  {
                    title: "Deployment review",
                    description:
                      "Discuss workstation, on-prem, controlled, and airgapped requirements.",
                    icon: ShieldCheck,
                  },
                  {
                    title: "Evidence requirements",
                    description:
                      "Clarify run history, metadata, audit records, artifacts, and reviewer needs.",
                    icon: ClipboardList,
                  },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.title} className="flex gap-3">
                      <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                      <div>
                        <h2 className="text-sm font-semibold">{item.title}</h2>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="visual-frame p-5 sm:p-8">
              {/* TODO: Connect to an approved CRM, email, or backend endpoint. */}
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
      <section className="border-b border-border bg-muted/25">
        <div className="site-container grid gap-6 py-8 sm:grid-cols-3">
          {[
            "No cloud control plane assumed",
            "No unsupported compliance claims",
            "Connector readiness reviewed per stack",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
