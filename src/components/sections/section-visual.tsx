// @/components/sections/section-visual.tsx

import type { PageSection } from "@/content/pages"

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
  WorkflowVisual,
} from "@/components/visuals"

export function SectionVisual({ visual }: Pick<PageSection, "visual">) {
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
