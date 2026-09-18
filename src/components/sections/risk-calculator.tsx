"use client"

import { useState } from "react"

import { AlertTriangle, Calculator } from "lucide-react"

import { TrademarkText } from "@/components/site/brand-name"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { calculatorDisclaimer, remediationScenarios } from "@/content/site"

const defaults = {
  investigationsPerMonth: 4,
  avgInvestigationHours: 12,
  reconciliationHoursPerMonth: 20,
  loadedHourlyCost: 85,
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

function parseInput(value: string): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
}

export function RiskCalculator() {
  const [investigationsPerMonth, setInvestigationsPerMonth] = useState(
    defaults.investigationsPerMonth
  )
  const [avgInvestigationHours, setAvgInvestigationHours] = useState(
    defaults.avgInvestigationHours
  )
  const [reconciliationHoursPerMonth, setReconciliationHoursPerMonth] =
    useState(defaults.reconciliationHoursPerMonth)
  const [loadedHourlyCost, setLoadedHourlyCost] = useState(
    defaults.loadedHourlyCost
  )

  const monthlyHours =
    investigationsPerMonth * avgInvestigationHours + reconciliationHoursPerMonth
  const annualHours = monthlyHours * 12
  const annualCost = annualHours * loadedHourlyCost

  return (
    <div className="visual-frame overflow-hidden">
      <div className="visual-toolbar">
        <span className="flex items-center gap-2">
          <Calculator className="size-3.5" />
          Cost of fragmented QC
        </span>
        <span className="text-muted-foreground">Illustrative</span>
      </div>
      <div className="grid gap-8 p-5 sm:p-6 lg:grid-cols-2 lg:gap-10">
        <div>
          <p className="text-[9px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            Your operation
          </p>
          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="investigationsPerMonth">
                Investigations or deviations per month
              </Label>
              <Input
                id="investigationsPerMonth"
                type="number"
                min={0}
                inputMode="numeric"
                className="mt-1.5"
                value={investigationsPerMonth}
                onChange={(event) =>
                  setInvestigationsPerMonth(parseInput(event.target.value))
                }
              />
            </div>
            <div>
              <Label htmlFor="avgInvestigationHours">
                Average investigation time (hours)
              </Label>
              <Input
                id="avgInvestigationHours"
                type="number"
                min={0}
                inputMode="numeric"
                className="mt-1.5"
                value={avgInvestigationHours}
                onChange={(event) =>
                  setAvgInvestigationHours(parseInput(event.target.value))
                }
              />
            </div>
            <div>
              <Label htmlFor="reconciliationHoursPerMonth">
                Hours per month on manual reconciliation &amp; audit prep
              </Label>
              <Input
                id="reconciliationHoursPerMonth"
                type="number"
                min={0}
                inputMode="numeric"
                className="mt-1.5"
                value={reconciliationHoursPerMonth}
                onChange={(event) =>
                  setReconciliationHoursPerMonth(parseInput(event.target.value))
                }
              />
            </div>
            <div>
              <Label htmlFor="loadedHourlyCost">
                Loaded hourly cost (USD)
              </Label>
              <Input
                id="loadedHourlyCost"
                type="number"
                min={0}
                inputMode="numeric"
                className="mt-1.5"
                value={loadedHourlyCost}
                onChange={(event) =>
                  setLoadedHourlyCost(parseInput(event.target.value))
                }
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                An estimate — adjust to your own fully-loaded QA/QC analyst
                cost.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-[9px] font-semibold tracking-[0.14em] text-primary uppercase">
              Based on your inputs
            </p>
            <p className="mt-2 text-sm font-medium text-foreground/80">
              Estimated annual compliance tax
            </p>
            <p
              className="mt-1 font-mono text-3xl font-semibold"
              aria-live="polite"
            >
              {currencyFormatter.format(annualCost)}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {investigationsPerMonth} investigations × {avgInvestigationHours}{" "}
              hours + {reconciliationHoursPerMonth} reconciliation hours per
              month × 12 months × {currencyFormatter.format(loadedHourlyCost)}
              /hour
            </p>
          </div>

          <div className="border-t border-border pt-6">
            <p className="text-[9px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              Reference — not computed from your inputs
            </p>
            <p className="mt-2 text-sm font-medium text-foreground/80">
              Remediation exposure if a gap reaches inspection
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {remediationScenarios.map((scenario) => (
                <div
                  key={scenario.label}
                  className="rounded-md border border-border p-3.5"
                >
                  <p className="text-xs font-semibold">{scenario.label}</p>
                  <p className="mt-1 font-mono text-lg font-semibold">
                    {scenario.range}
                  </p>
                  <p className="mt-1.5 text-[11px] leading-4 text-muted-foreground">
                    {scenario.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-start gap-2.5 border-t border-border bg-muted/30 px-5 py-4 sm:px-6">
        <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-600" />
        <p className="text-xs leading-5 text-muted-foreground">
          <TrademarkText text={calculatorDisclaimer} />
        </p>
      </div>
    </div>
  )
}
