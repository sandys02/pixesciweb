import {
  Building2,
  CheckCircle2,
  ClipboardCheck,
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
              <h1 className="mt-5 text-4xl leading-[1.05] font-semibold sm:text-6xl">
                Evaluate Pixesci for your scientific operation.
              </h1>
              <p className="mt-6 text-base leading-7 text-muted-foreground sm:text-lg">
                Tell us what you are evaluating. We can map a workflow, review
                deployment and compliance needs, or discuss a pilot and
                commercial fit in the same conversation.
              </p>
              <div className="mt-8 space-y-5 border-t border-border pt-6">
                {[
                  {
                    title: "Use case and workflow",
                    description:
                      "Review the software, handoffs, teams, and evidence requirements in scope.",
                    icon: Building2,
                  },
                  {
                    title: "Deployment and compliance",
                    description:
                      "Discuss local, on-prem, controlled, and airgapped requirements.",
                    icon: ShieldCheck,
                  },
                  {
                    title: "Evaluation and rollout",
                    description:
                      "Define pilot goals, technical stakeholders, security review, and next steps.",
                    icon: ClipboardCheck,
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
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
      <section className="border-b border-border bg-muted/25">
        <div className="site-container grid gap-6 py-8 sm:grid-cols-3">
          {[
            "Workflow and stakeholder alignment",
            "Security and deployment review",
            "Pilot scope and success criteria",
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
