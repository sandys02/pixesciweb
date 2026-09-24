import type { PageSection } from "@/content/pages"

export type VisualPromptData = {
  kind: "ask" | "tell"
  text: string
}

export type VisualKey = NonNullable<PageSection["visual"]>

export const visualPrompts: Record<VisualKey, VisualPromptData> = {
  workflow: {
    kind: "tell",
    text: "Review today's HPLC results and prepare the record.",
  },
  audit: { kind: "ask", text: "Who changed this result, and when?" },
  architecture: { kind: "ask", text: "Does any of our data leave the site?" },
  catalog: { kind: "ask", text: "Which of our tools can run this workflow?" },
  console: { kind: "ask", text: "Where is this run right now?" },
  templates: {
    kind: "tell",
    text: "Set up last month's stability review again.",
  },
  lims: { kind: "ask", text: "Is sample SMP-2026-0198 ready for release?" },
  "quality-record": {
    kind: "ask",
    text: "What's still open on DEV-2026-0142?",
  },
  genealogy: {
    kind: "ask",
    text: "Which product lots used material MAT-2026-0417?",
  },
  "batch-record": {
    kind: "ask",
    text: "What's left before BR-2026-0087 can be dispositioned?",
  },
  "equipment-lifecycle": {
    kind: "ask",
    text: "When is EQ-0142 due for calibration?",
  },
  "document-lifecycle": {
    kind: "ask",
    text: "Where is SOP-101-014 in review?",
  },
  dashboard: { kind: "ask", text: "Where are our evidence gaps this week?" },
  "agent-orchestrator": {
    kind: "ask",
    text: "Which runs were repeated without a reason?",
  },
  "training-record": {
    kind: "ask",
    text: "Who still needs training on SOP-105?",
  },
}

export const monitoringPrompt: VisualPromptData = {
  kind: "ask",
  text: "Is anything off in the lab right now?",
}
