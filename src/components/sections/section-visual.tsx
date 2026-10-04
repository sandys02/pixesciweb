// @/components/sections/section-visual.tsx

import type { PageSection } from "@/content/pages"
import { visualPrompts, type VisualKey } from "@/content/visual-prompts"

import {
  AgentOrchestratorVisual,
  AuditTimeline,
  BatchRecordVisual,
  CatalogVisual,
  DashboardVisual,
  DocumentLifecycleVisual,
  EnvironmentControls,
  EquipmentLifecycleVisual,
  ExecutionConsole,
  GenealogyVisual,
  LimsVisual,
  QualityRecordVisual,
  TemplateVisual,
  TrainingRecordVisual,
  VisualPrompt,
  WorkflowVisual,
} from "@/components/visuals"

function renderVisual(visual: VisualKey) {
  switch (visual) {
    case "workflow":
      return <WorkflowVisual compact />
    case "audit":
      return <AuditTimeline />
    case "architecture":
      return <EnvironmentControls />
    case "catalog":
      return <CatalogVisual />
    case "console":
      return <ExecutionConsole />
    case "templates":
      return <TemplateVisual />
    case "lims":
      return <LimsVisual />
    case "quality-record":
      return <QualityRecordVisual />
    case "genealogy":
      return <GenealogyVisual />
    case "batch-record":
      return <BatchRecordVisual />
    case "equipment-lifecycle":
      return <EquipmentLifecycleVisual />
    case "document-lifecycle":
      return <DocumentLifecycleVisual />
    case "dashboard":
      return <DashboardVisual />
    case "agent-orchestrator":
      return <AgentOrchestratorVisual />
    case "training-record":
      return <TrainingRecordVisual />
    default:
      return null
  }
}

export function SectionVisual({ visual }: Pick<PageSection, "visual">) {
  if (!visual) return null
  const content = renderVisual(visual)
  if (!content) return null

  return (
    <div className="reveal-on-scroll">
      <VisualPrompt prompt={visualPrompts[visual]} />
      {content}
    </div>
  )
}
