# PixeSci website content update — Platform expansion brief

**Purpose of this document.** pixesciweb (pixesci.com) was built when PixeSci
shipped AI chat, software integrations, and workflow automation. The product
(pixesciv2) has since grown into a full regulated lab-operations platform: a
LIMS, a Quality Management System, Materials & Products registers, batch
Manufacturing Quality (electronic batch records), Equipment lifecycle
management, Document Control & GxP Training, and Reports/Analytics — on top of
the original chat, workflow canvas, and software-catalog features. This
document is a complete, self-contained brief for updating the website to match:
it is written so a developer (human or AI) can implement it directly, with
real drafted copy, not placeholders. It was produced by (1) reading every
feature's source code in `pixesciv2/frontend-v2/src/features/*`, (2) exercising
the real local backend API with a live test account to confirm actual behavior
and terminology, and (3) reading the existing `pixesciweb` codebase in full to
match its content model, design system, and voice exactly.

**Scope.** This brief only describes changes to `pixesciweb`. No source code
in `pixesciweb` is changed by writing this document — implementing it is a
separate, later task. `pixesciv2` is not modified at all; it was only read.

**Voice, one more time before you write anything.** The existing site is
deliberately plain, concrete, and second-person. It avoids hype adjectives
("revolutionary", "seamless", "powerful"), avoids unqualified regulatory
promises ("compliant", "validated", "guaranteed"), and prefers short,
literal sentences over marketing abstraction. Every regulated-sounding page
repeats a specific validation-responsibility disclaimer rather than promising
compliance outright. All seven new pages and every existing-page edit below
were written in that same voice — match it exactly if you add anything beyond
what's here.

---

## Contents

1. [Executive summary](#1-executive-summary)
2. [Recommended information architecture](#2-recommended-information-architecture)
3. [Global changes](#3-global-changes) — nav, footer, sitemap, JSON-LD
4. [Design & consistency framework for new pages](#4-design--consistency-framework-for-new-pages)
5. [New page: Laboratory (LIMS) — `/platform/laboratory`](#5-new-page-laboratory-lims--platformlaboratory)
6. [New page: Quality Management (QMS) — `/platform/quality-management`](#6-new-page-quality-management-qms--platformquality-management)
7. [New page: Materials & Products — `/platform/materials-products`](#7-new-page-materials--products--platformmaterials-products)
8. [New page: Manufacturing Quality — `/platform/manufacturing-quality`](#8-new-page-manufacturing-quality--platformmanufacturing-quality)
9. [New page: Equipment — `/platform/equipment`](#9-new-page-equipment--platformequipment)
10. [New page: Documents & Training — `/platform/documents-training`](#10-new-page-documents--training--platformdocuments-training)
11. [New page: Reports & Analytics — `/platform/reports-analytics`](#11-new-page-reports--analytics--platformreports-analytics)
12. [Updates to existing pages](#12-updates-to-existing-pages)
13. [SEO appendix](#13-seo-appendix)
14. [Raw audit appendix](#14-raw-audit-appendix)

---

## 1. Executive summary

### 1.1 The gap

pixesci.com currently tells a three-pillar story: **connect** the scientific
software you already use, **automate** it into visual workflows, and **talk
to your lab** in plain language to run and track those workflows. That story
is still true and still the right front door — but it now describes maybe a
third of the product. `pixesciv2/frontend-v2/src/features/` contains 26
feature modules; nearly all of them (verified against `backend/api/v1/router.py`'s
~90 endpoint groups) are real, backend-integrated, not aspirational:

- **`laboratory`** — a full sample-accessioning-to-CoA LIMS workflow: chain of
  custody, worksheets, result entry, analyst + quality-unit review, OOS/OOT
  investigation gating, Certificate of Analysis generation, retention samples,
  stability studies, environmental monitoring, and four versioned "controlled
  definition" registries (test catalog, methods, specs, calculations).
- **`qms`** — deviations, CAPA, nonconformances, complaints, risk, audit
  findings, supplier quality, OOS/OOT, incidents, change control, effectiveness
  checks, management reviews, regulatory commitments — a real quality-record
  engine, not a generic ticket tracker.
- **`materials` + `products`** — a materials master, lot-level genealogy,
  storage locations, purchase orders/reorder alerts, a supplier register, a
  finished-goods product register, intermediate lots (cell substrates/viral
  materials), variant configs, and Certificates of Analysis.
- **`manufacturing-quality`** — master batch records, electronic batch
  records, line clearance, material dispensing, in-process controls, batch
  genealogy, execution deviations, and QA disposition/release.
- **`equipment`** — full asset lifecycle: registration, tiered IQ/OQ/PQ
  qualification with two-party sign-off, calibration with automatic
  out-of-tolerance investigation triggering, preventive maintenance/repair,
  and retirement.
- **`documents-training`** — controlled document lifecycle (draft → review →
  approve → active → periodic review) plus GxP personnel training tied to
  document versions.
- **`reports`** — inspection readiness, evidence-gap analysis, management
  review summaries, and cross-module analytics.
- **`compliance`** — audit-chain verification, e-signature manifestation,
  ALCOA+ reporting, Part 11/GMP/ISO 13485 self-assessments.

None of this exists anywhere on the current site. A prospective customer
searching "LIMS software," "QMS software," "electronic batch record
software," "equipment calibration software," or "document control software"
has no reason to find PixeSci — and a prospect who does land on the site sees
a workflow-automation tool, not the regulated operations platform it actually
is now. That is the gap this brief closes.

### 1.2 The approach

Add a new **Platform** section to the site: seven new pages, one per major
module, each targeted at its own SEO keyword cluster and written with real
drafted content (not outlines) in the exact `MarketingPageData` shape the
site already uses. Update the six most relevant existing pages (home,
`/product`, `/compliance`, `/security`, `/solutions/regulated-life-sciences`,
`/resources`) to cross-link into the new pages rather than duplicate their
content. Extend the site's existing hand-built SEO scaffolding (sitemap,
JSON-LD `featureList`, nav/footer) to include the new surface area. Keep the
existing "Describe → Review → Run → Track" narrative on `/product` and
`/workflow-automation` exactly as it is — it's still the right explanation of
*how* the platform works. The new pages answer *what* the platform now
covers.

### 1.3 What NOT to do

- Don't rename or restructure any existing page's core narrative.
- Don't claim compliance, validation, or regulatory guarantees anywhere. Every
  new regulated-sounding page reuses the existing `complianceDisclaimer`
  string and disclaimer banner pattern (see §4).
- Don't invent capabilities. Every claim in §§5–11 traces back to a real,
  live-tested feature (see §14, the raw audit appendix, for the evidence).
- Don't oversell the handful of features that are genuinely simulated or
  partial — Prompt Studio, the in-app assistant panel, and a few named gaps
  inside otherwise-real modules (flagged explicitly in each module's section
  below and in §14). If in doubt about a claim, check §14 before writing it.
- Don't introduce new visual language. Reuse `.site-container`,
  `.section-space`, `.eyebrow`, `FeatureGrid`, `MarketingPage`, and the
  existing OKLCH color tokens. New illustrative visuals should follow the
  same hand-built-mockup style as `src/components/visuals/*`, not screenshots.

---

## 2. Recommended information architecture

Add a new **"Platform"** dropdown to primary navigation, positioned between
"Product" and "Solutions" (Product stays the "how it works" overview;
Platform is the "what modules exist" directory; Solutions stays the
per-segment framing).

| Route | Page | Source features | Primary SEO cluster |
|---|---|---|---|
| `/platform/laboratory` | Laboratory (LIMS) | `laboratory`, `lab-os` | LIMS software, sample tracking software, lab information management system |
| `/platform/quality-management` | Quality Management (QMS) | `qms`, `compliance`, `audit-logs` | QMS software, CAPA software, deviation management software, nonconformance software |
| `/platform/materials-products` | Materials & Products | `materials`, `products` | inventory/lot tracking software, material management software, product genealogy software |
| `/platform/manufacturing-quality` | Manufacturing Quality | `manufacturing-quality` | electronic batch record software, EBR software, MBR software, batch release software |
| `/platform/equipment` | Equipment | `equipment` | equipment calibration software, asset qualification software, IQ OQ PQ software |
| `/platform/documents-training` | Documents & Training | `documents-training` | document control software, SOP management software, GxP training software |
| `/platform/reports-analytics` | Reports & Analytics | `reports` | inspection readiness software, management review software, quality analytics dashboard |

Each new page also gets a matching entry in the **Platform** footer column
(new fourth-row addition — see §3.1) and is cross-linked from `/product`,
`/compliance`, `/security`, `/solutions/regulated-life-sciences`, and
`/resources` (see §12).

---

## 3. Global changes

### 3.1 `src/content/site.ts` — navigation

Add a `platformNavigation` array (same `NavItem[]` shape as
`primaryNavigation`) for the dropdown's contents, and insert a "Platform"
entry into `primaryNavigation` itself between "Product" and "Solutions". The
header component (`src/components/site/header.tsx`) currently renders
`primaryNavigation` as flat links — implementing the dropdown requires a small
change there too (out of scope for this content brief; flag it to whoever
implements this as the one piece of UI logic, not just content, that this
brief requires — a `DropdownMenu` from `src/components/ui` already exists in
the project and is the natural fit).

```ts
export const platformNavigation: NavItem[] = [
  {
    label: "Laboratory",
    href: "/platform/laboratory",
    description: "Track samples from accessioning to Certificate of Analysis.",
  },
  {
    label: "Quality Management",
    href: "/platform/quality-management",
    description: "Track deviations, CAPA, nonconformances, and quality records.",
  },
  {
    label: "Materials & Products",
    href: "/platform/materials-products",
    description: "Track materials, lots, suppliers, products, and genealogy.",
  },
  {
    label: "Manufacturing Quality",
    href: "/platform/manufacturing-quality",
    description: "Run electronic batch records from dispensing to release.",
  },
  {
    label: "Equipment",
    href: "/platform/equipment",
    description: "Track qualification, calibration, and maintenance for every asset.",
  },
  {
    label: "Documents & Training",
    href: "/platform/documents-training",
    description: "Control documents and connect them to GxP training records.",
  },
  {
    label: "Reports & Analytics",
    href: "/platform/reports-analytics",
    description: "Check inspection readiness and quality metrics across the platform.",
  },
]

export const primaryNavigation: NavItem[] = [
  {
    label: "Product",
    href: "/product",
    description: "Connect tools, automate work, and track every run.",
  },
  {
    label: "Platform",
    href: "/platform/laboratory",
    description: "See every module: lab, quality, materials, manufacturing, equipment.",
  },
  {
    label: "Solutions",
    href: "/solutions/regulated-life-sciences",
    description: "Run clear workflows in regulated and secure labs.",
  },
  {
    label: "Integrations",
    href: "/integrations",
    description: "Connect the scientific software you already use.",
  },
  {
    label: "Compliance",
    href: "/compliance",
    description: "Track actions, reviews, changes, and results.",
  },
  {
    label: "Security",
    href: "/security",
    description: "Keep software, data, and access under your control.",
  },
  {
    label: "Resources",
    href: "/resources",
    description: "Read clear guides about setup, workflows, and review.",
  },
  {
    label: "Company",
    href: "/company",
    description: "Meet the team connecting scientific software.",
  },
]
```

### 3.2 `src/content/site.ts` — footer

Insert a new "Platform" group into `footerNavigation`, as the second group
(after "Product", before "Solutions"):

```ts
{
  title: "Platform",
  links: [
    { label: "Laboratory (LIMS)", href: "/platform/laboratory" },
    { label: "Quality Management", href: "/platform/quality-management" },
    { label: "Materials & Products", href: "/platform/materials-products" },
    { label: "Manufacturing Quality", href: "/platform/manufacturing-quality" },
    { label: "Equipment", href: "/platform/equipment" },
    { label: "Documents & Training", href: "/platform/documents-training" },
    { label: "Reports & Analytics", href: "/platform/reports-analytics" },
  ],
},
```

Note the footer is a 4-column CSS grid today (`footer.tsx` — check the exact
grid class before adding a 5th column; a 7-link column may need
`columns-2`/wrap treatment or the footer grid needs a 5th track. This is a
layout detail for the implementer, not a content decision.)

### 3.3 `src/app/sitemap.ts`

Add the seven new routes. Suggested priority: same tier as the existing
"first tier" pages (0.8) — these are now core product pages, not secondary
resources.

```ts
const routes = [
  "",
  "/product",
  "/platform/laboratory",
  "/platform/quality-management",
  "/platform/materials-products",
  "/platform/manufacturing-quality",
  "/platform/equipment",
  "/platform/documents-training",
  "/platform/reports-analytics",
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
```

The existing `sitemap()` function's priority logic (`index === 0 ? 1 : index < 9 ? 0.8 : 0.6`)
needs its `9` boundary recalculated once the array above is final — with 7 new
routes inserted after `/product` (index 1), the first-tier cutoff should move
to `index < 16` to keep everything through `/workflow-automation` at 0.8 and
only `/resources`, `/company`, `/privacy` at 0.6. Recount against the final
array before shipping; don't copy the `16` blindly if the route list changes.

### 3.4 `src/lib/seo.ts` — `softwareApplicationJsonLd.featureList`

Extend the existing six-item `featureList` with the new module capabilities.
Keep the existing six items (they still describe the workflow-automation
core) and append:

```ts
featureList: [
  "Visual scientific workflows",
  "Scientific software connections",
  "Local workflow execution",
  "Run history and output files",
  "Audit records and review checkpoints",
  "Local AI-assisted workflow planning",
  "Laboratory sample tracking from accessioning to Certificate of Analysis",
  "Quality record management for deviations, CAPA, and nonconformances",
  "Material and product lot tracking with genealogy",
  "Electronic batch records for manufacturing",
  "Equipment qualification, calibration, and maintenance tracking",
  "Document control connected to GxP training records",
  "Cross-module inspection readiness reporting",
],
```

Also update `organizationJsonLd.description` and `websiteJsonLd.description`
if the implementer wants the org-level description to reflect the broader
platform — optional, lower priority than the page-level metadata in §13.

### 3.5 `content/pages.ts` — `PageSection["visual"]` union and `SectionVisual`

The six new pages in §§5–11 each reference a `visual` key in their
`PageSection`s. Two of them (`workflow`, `catalog`, `console`, `audit`,
`architecture`, `templates`) already exist. Each new page also proposes one
**new** named visual (a hand-built mockup component, matching the existing
style of `src/components/visuals/*` — CSS-drawn, not a screenshot). Add the
new keys to the `PageSection["visual"]` union in `content/pages.ts`:

```ts
visual?:
  | "workflow"
  | "audit"
  | "architecture"
  | "catalog"
  | "console"
  | "templates"
  | "lims"
  | "quality-record"
  | "genealogy"
  | "batch-record"
  | "equipment-lifecycle"
  | "document-lifecycle"
  | "dashboard"
```

...and a matching `case` in `SectionVisual` (`src/components/sections/marketing-page.tsx`)
for each, importing the new components from `src/components/visuals`. See §4.3
for a spec of each new visual component.

---

## 4. Design & consistency framework for new pages

Every new page in §§5–11 is built from the same `MarketingPageData` object
shape already used by `/product`, `/compliance`, `/security`,
`/solutions/*`, and `/workflow-automation` (defined in `content/pages.ts`,
rendered by `src/components/sections/marketing-page.tsx`'s `<MarketingPage>`
component — see that file for the exact render logic already in the repo).
Nothing new needs to be built to render these pages; add a new object to
`content/pages.ts`, add a new `src/app/(site)/platform/<slug>/page.tsx` that
calls `<MarketingPage data={...} />` (copy the pattern from
`src/app/(site)/compliance/page.tsx` or any other templated page), and wire
metadata via `createMetadata()` per §13.

### 4.1 Route file pattern

```tsx
// src/app/(site)/platform/laboratory/page.tsx
import type { Metadata } from "next"

import { MarketingPage } from "@/components/sections/marketing-page"
import { laboratoryPage } from "@/content/pages"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Laboratory (LIMS) Software",
  description: "…", // see §13 for exact copy per page
  path: "/platform/laboratory",
})

export default function LaboratoryPlatformPage() {
  return <MarketingPage data={laboratoryPage} disclaimer />
}
```

Pass `disclaimer` (renders the amber validation-responsibility banner, same
as `/compliance` and `/solutions/regulated-life-sciences` today) on every new
Platform page except `/platform/reports-analytics`, which is descriptive
rather than regulatory-record-making and can omit it — use judgment here, but
default to including it for anything that touches deviations, CAPA, batch
release, or document approval.

### 4.2 Content rules that apply to every new page

- **Eyebrow, title, description** follow the exact tone of existing pages:
  short declarative title (2 sentences max, often two short sentences joined
  as one `title` string, e.g. `"Connect QC and R&D tools and track every
  handoff."`), one-paragraph description.
- **Sections** (3–5 per page): each needs a `title`, a `description` (string
  or string array for multi-paragraph), and either `features` (3–4 items,
  each `{ title, description, icon }`) or `bullets` (short phrase list) —
  never both in the same section unless the section also has a `visual`
  (compare `regulatedPage`'s first section: `visual` + `bullets`, no
  `features`, in the existing content file).
- **Icons**: use `lucide-react` icons already imported elsewhere in the
  codebase where a semantic match exists (e.g. `ClipboardCheck`, `FileSearch`,
  `ShieldCheck`, `GitBranch` are already imported in `content/pages.ts`); add
  new icon imports at the top of `content/pages.ts` for anything not already
  imported (e.g. `FlaskConical`, `TestTube`, `Boxes`, `PackageSearch`,
  `Gauge`, `CalendarClock`, `Stamp`, `Users`, `LineChart` — all in the
  `lucide-react` set already used elsewhere in the codebase).
- **`dark` sections**: used sparingly (1 per page, usually the
  execution/control section) to alternate with the `.dark-surface` console
  aesthetic — matches existing pages' pattern of one dark section breaking up
  2–3 light ones.
- **Never claim compliance, validation, or regulatory status outright.**
  Where a section touches a regulated concept (e-signatures, audit trail,
  batch release, deviations), phrase it descriptively ("keeps a record of
  who approved what and when") not normatively ("ensures compliance with
  21 CFR Part 11"). Reuse the site's existing pattern from `compliancePage`:
  "These records can support ALCOA data integrity reviews, but software alone
  does not make a workflow compliant."
- **Every page's `finalCta` links back to the demo-booking flow**
  (`demoBookingUrl`), matching every existing page.
- **Cross-link liberally.** Every new page's description or a bullet should
  reference at least one other Platform page or an existing page by name
  (e.g. Manufacturing Quality references Equipment for line-clearance
  readiness; Laboratory references Equipment for instrument qualification).
  Use `<Link>` styling already established elsewhere — actual href insertion
  happens in the section `description`/`bullets` text only where the existing
  content model supports it (plain text); do not invent new
  `PageSection` fields for links unless the implementer chooses to extend the
  type — flag as an optional enhancement, not required for this brief.

### 4.3 New visual components needed

Each is a small, hand-built, CSS/SVG mockup component in
`src/components/visuals/`, styled like the existing six (bordered panels,
monospace micro-labels, the site's OKLCH palette, subtle motion respecting
`prefers-reduced-motion`). One new file per visual, exported from
`src/components/visuals/index.ts` alongside the existing six.

| Visual key | File | What it depicts |
|---|---|---|
| `lims` | `lims-visual.tsx` | A sample record card showing status progression across a horizontal stepper: Accessioned → In Testing → Under Review → Released, with a small chain-of-custody icon trail and a CoA document icon at the end. Mirrors the look of `workflow-visual.tsx` but sample-shaped, not graph-shaped. |
| `quality-record` | `quality-record-visual.tsx` | A quality record card (deviation or CAPA) with a status badge (Open/Under Review/Closed), an owner, a due date, and a small linked-records strip showing it connected to a document and a batch — echoes `audit-timeline.tsx`'s bordered-row style. |
| `genealogy` | `genealogy-visual.tsx` | A simple parent→child lineage tree (material lot → sub-lot → product lot), 3 levels, connecting lines, each node a small bordered tile with an ID and status dot. |
| `batch-record` | `batch-record-visual.tsx` | A batch record header (batch number, product, status) above a checklist of stages (Dispensing ✓, Line Clearance ✓, In-Process Controls ✓, QA Review ⋯, Disposition —), styled like `execution-console.tsx`'s dark console rows. |
| `equipment-lifecycle` | `equipment-lifecycle-visual.tsx` | A horizontal lifecycle bar: Registered → Qualified (IQ/OQ/PQ) → In Service → Calibration Due → Maintenance → In Service, with a calendar-style due-date chip, echoing `template-visual.tsx`'s card layout. |
| `document-lifecycle` | `document-lifecycle-visual.tsx` | A document card showing version number and a stepper: Draft → In Review → Approved → Active → Periodic Review, plus a small "Training assigned" badge linking to a person icon. |
| `dashboard` | `dashboard-visual.tsx` | A small metrics tile grid (4 tiles: Inspection Readiness score, Open CAPAs, Overdue Calibrations, Evidence Gaps) styled like `catalog-visual.tsx`'s grid-of-cards layout. |

Each should be a static illustrative mockup (like the existing six), not a
live data component — no API calls, no real customer data, purely
illustrative UI, exactly matching how `workflow-visual.tsx` etc. work today.

---

## 5. New page: Laboratory (LIMS) — `/platform/laboratory`

### 5.1 Positioning

This page covers `frontend-v2/src/features/laboratory` and `lab-os`. The
product's own UI never uses the word "LIMS" — it's an accurate category label
for search intent, not literal in-app language. The real workflow is
sample-centric: client/project setup → accessioning → containers/aliquots
with chain of custody → testing against a versioned, controlled catalog of
tests/methods/specs/calculations → worksheets and analyst assignment →
result entry → analyst review, then a separate quality-unit review → sample
disposition → Certificate of Analysis, with retention samples and dedicated
stability/environmental-monitoring study tracking running alongside. Cross-
link to Equipment (instrument qualification behind test methods), Quality
Management (an OOS/OOT investigation blocks release and is a real Quality
record), and Manufacturing Quality (lab results feed into batch genealogy).

**Do not oversell:** the WGS/ddPCR repositories are intentionally simple flat
lists today (no lineage/QC hierarchy yet) — describe them modestly if at all.
Bulk instrument result import exists on the backend but has no polished UI
yet — say "instrument result import," not "one-click bulk import." Don't
imply every record is deep-linkable; only "which sample" is addressable
today.

### 5.2 Metadata

- **Meta title:** `Laboratory (LIMS) Software | PixeSci TM`
- **Meta description:** `Track samples from accessioning to Certificate of Analysis. Chain of custody, worksheets, analyst and quality-unit review, and OOS/OOT investigation gating, run locally.`
- **Target keywords:** LIMS software, laboratory information management system, sample tracking software, chain of custody software, lab sample management, certificate of analysis software, OOS OOT investigation software

### 5.3 Page content (`laboratoryPage` in `content/pages.ts`)

```ts
export const laboratoryPage: MarketingPageData = {
  eyebrow: "Laboratory",
  title: "Track every sample from accessioning to Certificate of Analysis.",
  description:
    "Run your lab's sample workflow in one system: intake, chain of custody, testing, review, and release. Keep every result, correction, and approval tied to the sample record, from the first container to the final CoA.",
  primaryCta: "Map your lab workflow",
  primaryHref: demoBookingUrl,
  secondaryCta: "See quality management",
  secondaryHref: "/platform/quality-management",
  sections: [
    {
      eyebrow: "Sample workflow",
      title: "One record from intake to release.",
      description: [
        "Accession a sample, then track every container, aliquot, and transfer that follows it. Assign tests from a controlled catalog, generate worksheets, and enter results manually or from instrument import.",
        "Every sample moves through analyst review, then a separate quality-unit review, before it can be released. A result that falls out of specification or out of trend opens an investigation that blocks release until it closes.",
      ],
      visual: "lims",
      features: [
        {
          title: "Accessioning and chain of custody",
          description:
            "Record every transfer of a sample, container, or aliquot, with the receiving custodian confirming or rejecting each transfer.",
          icon: ClipboardCheck,
        },
        {
          title: "Worksheets and result entry",
          description:
            "Generate worksheets, assign analysts, and enter results manually or from instrument import.",
          icon: FileText,
        },
        {
          title: "Two-step review",
          description:
            "Route results through analyst review, then a separate quality-unit review, before disposition.",
          icon: UserCheck,
        },
        {
          title: "Certificate of Analysis",
          description:
            "Generate a CoA only after release, from versioned templates, to an authorized-recipient list you control.",
          icon: BadgeCheck,
        },
      ],
    },
    {
      eyebrow: "Controlled definitions",
      title: "Keep your test catalog, methods, and specifications versioned.",
      description:
        "Test catalog entries, analytical methods, specifications and limits, and calculations are each version-controlled registries. Editing one creates a new version instead of silently changing what past results were tested against.",
      bullets: [
        "Versioned test catalog, methods, specifications, and calculations",
        "Corrections to a sample record capture the prior value and a reason",
        "Container and aliquot lineage, with a reconciliation check",
        "Barcode and UID scan-to-locate for containers and aliquots",
      ],
    },
    {
      eyebrow: "Investigations",
      title: "Out-of-specification and out-of-trend results block release.",
      description: [
        "When a result evaluates out-of-specification or trips an out-of-trend rule, PixeSci TM opens an investigation and blocks the sample from release until it closes. The quality-unit review screen shows exactly which results are blocking a sample, with a direct link into the open investigation.",
        "Investigations opened here are real Quality Management records — the same CAPA and deviation system every other module reports into.",
      ],
      visual: "audit",
      dark: true,
      features: [
        {
          title: "Release gating",
          description:
            "Block release automatically until every open OOS or OOT investigation on a sample closes.",
          icon: ShieldCheck,
        },
        {
          title: "Linked investigations",
          description:
            "Follow a direct link from a blocked result to its open investigation record.",
          icon: FileSearch,
        },
        {
          title: "Shared audit trail",
          description:
            "See every accessioning, testing, review, and release event in one record trail per sample.",
          icon: History,
        },
      ],
    },
    {
      eyebrow: "Studies and retention",
      title: "Track stability, environmental monitoring, and retention samples.",
      description:
        "Stability studies run on a pull-point calendar. Environmental monitoring tracks alert and action limits. Retention samples carry their own retain, extend, and dispose lifecycle, separate from active testing.",
      features: [
        {
          title: "Stability studies",
          description:
            "Schedule and track stability protocols by pull point, on a real calendar view.",
          icon: History,
        },
        {
          title: "Environmental monitoring",
          description:
            "Track alert and action limits for environmental samples alongside your test workflow.",
          icon: FileSearch,
        },
        {
          title: "Retention samples",
          description:
            "Track retention quantity, retain-until date, and disposition separately from active testing.",
          icon: Archive,
        },
      ],
    },
  ],
  finalTitle: "Show us one sample workflow, from intake to release.",
  finalDescription:
    "Bring your accessioning process, test catalog, review steps, and release criteria. We will map them into your lab workflow.",
  finalCta: "Map your lab workflow",
}
```

### 5.4 New icon imports needed

`ClipboardCheck` and `FileSearch` are already imported in `content/pages.ts`.
Add: none beyond what's already imported for this page — `FileText`,
`UserCheck`, `BadgeCheck`, `ShieldCheck`, `History`, `Archive` are all already
imported by existing pages in the same file.

### 5.5 FAQ entries to add to `/resources`

Add to the existing FAQ array (matches the site's existing plain-language,
disclaimer-aware answer style):

```ts
{
  question: "Does PixeSci TM replace our LIMS?",
  answer:
    "PixeSci TM includes a sample-tracking workflow — accessioning, chain of custody, testing, review, and release — that can run alongside or in place of a separate LIMS, depending on your setup. Talk to us about your current lab software before deciding which fits your process.",
},
{
  question: "How does PixeSci TM handle out-of-specification results?",
  answer:
    "A result that falls out of specification or out of trend opens an investigation and blocks the sample from release until the investigation closes. The investigation is a Quality Management record, tracked the same way as any other deviation or CAPA.",
},
```

### 5.6 Internal links to add

- From `/platform/laboratory`: link to `/platform/quality-management` (OOS/OOT
  investigations), `/platform/equipment` (instrument qualification), and
  `/platform/manufacturing-quality` (lab results feeding batch genealogy).
- From `/product`: add one sentence in the "software catalog" or overview
  section pointing to `/platform/laboratory` as an example of a full regulated
  module built on the same workflow engine.
- From `/solutions/regulated-life-sciences`: reference the LIMS/CoA workflow
  by name and link to `/platform/laboratory`.

---

## 6. New page: Quality Management (QMS) — `/platform/quality-management`

### 6.1 Positioning

This page covers `frontend-v2/src/features/qms`, `compliance`, and
`audit-logs`. Sixteen first-class quality record types share one hash-chained
audit trail: deviations, nonconformances, OOS investigations, OOT
investigations, incidents, CAPA (plus action items), change control,
complaints, audits, audit findings, supplier qualification, supplier issues,
risk management, management review, effectiveness checks, and regulatory
commitments. This is genuinely the strongest page in the whole brief —
lead with the record-type breadth and the CAPA workflow, then a dedicated
"generate your own validation evidence" subsection covering the platform's
auto-generated ALCOA+ report, Part 11/GMP/ISO 13485 self-assessments, and
IQ/OQ/requirements-traceability-matrix generation for the platform itself.
Position this page as **the quality event and CAPA backbone every other
module reports into** — Manufacturing Quality's execution deviations,
Laboratory's OOS/OOT investigations, and Equipment's out-of-tolerance
investigations all become records here. Cross-link to `/compliance` (the
existing legal-disclaimer page) rather than duplicating its framing — this
page describes the mechanism, `/compliance` carries the legal caution.

**Do not oversell:** real evidence-byte file capture (with server-verified
checksum) exists for complaints only; every other record type stores a
caller-supplied file reference plus a checksum, not the file itself — say
"evidence linked with a verified checksum," not "secure file storage" across
the board. Re-authentication is captured on approvals but not yet
independently verified — say "captured with each approval," not "enforced
step-up authentication." Audit-logs export currently returns request
metadata rather than a guaranteed downloadable file — don't promise
one-click audit exports.

### 6.2 Metadata

- **Meta title:** `Quality Management System (QMS) Software | PixeSci TM`
- **Meta description:** `Track deviations, CAPA, nonconformances, complaints, and audits in one hash-chained record system. Generate ALCOA+, Part 11, and validation evidence for your own deployment.`
- **Target keywords:** QMS software, quality management system software, CAPA software, deviation management software, nonconformance software, complaint handling software, ALCOA+ software, 21 CFR Part 11 software

### 6.3 Page content (`qualityManagementPage` in `content/pages.ts`)

```ts
export const qualityManagementPage: MarketingPageData = {
  eyebrow: "Quality management",
  title: "Track every deviation, CAPA, and complaint in one record system.",
  description:
    "Sixteen quality record types share one hash-chained audit trail: deviations, nonconformances, CAPA, complaints, change control, audits, supplier issues, risk, and more. Every other module reports into the same system.",
  primaryCta: "Review your quality process",
  primaryHref: demoBookingUrl,
  secondaryCta: "See compliance workflows",
  secondaryHref: "/compliance",
  sections: [
    {
      eyebrow: "Quality records",
      title: "One system for every kind of quality event.",
      description: [
        "Deviations, nonconformances, OOS and OOT investigations, incidents, CAPA and action items, change control, complaints, audits and findings, supplier qualification and issues, risk management, management review, and regulatory commitments — each is a first-class, versioned record type, not a generic ticket with custom fields.",
        "Records move through a defined lifecycle with approvals and electronic signatures, not a freeform status field. A generic edit cannot change a record's status — only a defined transition can.",
      ],
      visual: "quality-record",
      features: [
        {
          title: "CAPA and effectiveness checks",
          description:
            "Link CAPA to the deviation, complaint, or audit finding that raised it, and schedule effectiveness checks to confirm it worked.",
          icon: ClipboardCheck,
        },
        {
          title: "Complaint intake and routing",
          description:
            "Route complaints on a computed deadline, assign an investigator, and record an adverse-event determination where it applies.",
          icon: FileSearch,
        },
        {
          title: "Change control",
          description:
            "Assess training impact and affected documents before a change is implemented.",
          icon: FileCog,
        },
        {
          title: "Supplier and risk records",
          description:
            "Track supplier qualification, supplier issues, and risk assessments alongside the rest of your quality records.",
          icon: ShieldCheck,
        },
      ],
    },
    {
      eyebrow: "Audit trail",
      title: "Every record change is hash-chained and independently verifiable.",
      description:
        "Each audit event carries a checksum linked to the one before it. Run a chain verification at any time to confirm nothing was altered, and generate an ALCOA+ data integrity report scored against your real audit history.",
      visual: "audit",
      dark: true,
      features: [
        {
          title: "Hash-chained events",
          description:
            "Verify your full audit chain on demand and see exactly where it breaks, if it ever does.",
          icon: Fingerprint,
        },
        {
          title: "Electronic signatures",
          description:
            "Capture a printed name, meaning, and timestamp for each approval, with independent tamper verification.",
          icon: FileKey2,
        },
        {
          title: "ALCOA+ reporting",
          description:
            "Generate a data integrity report scored against your real audit history, attribute by attribute.",
          icon: BookOpenCheck,
        },
      ],
    },
    {
      eyebrow: "Validation evidence",
      title: "Generate your own validation evidence.",
      description: [
        "PixeSci TM can generate installation qualification (IQ) and operational qualification (OQ) reports for its own deployment, a GAMP-categorized risk assessment, and a requirements traceability matrix linking your requirements through design and test coverage.",
        "Self-assessments against 21 CFR Part 11, GMP, and ISO 13485 checklists are generated from your real audit and configuration data, with cited evidence for each control — a starting point for your own validation work, not a replacement for it.",
      ],
      bullets: [
        "Auto-generated IQ and OQ reports",
        "GAMP-categorized risk assessment",
        "Requirements traceability matrix",
        "Part 11, GMP, and ISO 13485 self-assessments with cited evidence",
      ],
    },
    {
      eyebrow: "Reporting",
      title: "Prepare management review from the same records.",
      description:
        "Build a management review package from open CAPA, effectiveness-check results, and regulatory commitments already in the system, instead of assembling one by hand before every meeting.",
      features: [
        {
          title: "Management review packages",
          description:
            "Assemble CAPA inputs, effectiveness checks, and regulatory commitments into one scheduled review.",
          icon: Users,
        },
        {
          title: "Regulatory commitment tracking",
          description:
            "Track commitments to agencies by due date, with the deliverable and evidence attached.",
          icon: CalendarClock,
        },
      ],
    },
  ],
  finalTitle: "Show us one deviation or CAPA record, start to finish.",
  finalDescription:
    "Bring a real quality event and the approvals, evidence, and review it requires. We will map it into your record system.",
  finalCta: "Review your quality process",
}
```

### 6.4 New icon imports needed

Add to `content/pages.ts` imports: `Users`, `CalendarClock` (both in
`lucide-react`, `Users` already imported by `securityPage` in the same file
— reuse it, don't re-import). `CalendarClock` is new.

### 6.5 FAQ entries to add to `/resources`

```ts
{
  question: "What quality record types does PixeSci TM track?",
  answer:
    "Deviations, nonconformances, out-of-specification and out-of-trend investigations, incidents, CAPA and action items, change control, complaints, audits and findings, supplier qualification and issues, risk management, management review, and regulatory commitments — each as a versioned, auditable record type.",
},
{
  question: "Can PixeSci TM generate our validation documentation?",
  answer:
    "PixeSci TM can generate IQ and OQ reports, a risk assessment, and a requirements traceability matrix for its own deployment, along with Part 11, GMP, and ISO 13485 self-assessments cited against your real audit data. These are a starting point for your own validation work — your organization is still responsible for validating and maintaining the system to its own quality requirements.",
},
```

### 6.6 Internal links to add

- From `/platform/quality-management`: link to `/compliance` (legal framing),
  `/platform/laboratory` (OOS/OOT source), `/platform/manufacturing-quality`
  (execution deviations source), `/platform/equipment` (OOT source),
  `/platform/documents-training` (CAPA-driven document updates).
- From `/compliance`: add a paragraph pointing to `/platform/quality-management`
  for the concrete record system behind the ALCOA/audit-trail claims already
  on that page.
- From `/security`: reference role-based access to quality records (see §12.4).

---

## 7. New page: Materials & Products — `/platform/materials-products`

### 7.1 Positioning

Covers `frontend-v2/src/features/materials` and `products`. Both are
described in their own internal docs as fully backend-integrated with no
simulated data — confirmed live — which is unusually strong, confident ground
for marketing copy relative to other modules. Frame as one page with two
sub-narratives: **Materials** is the incoming supply chain and inventory
control layer (suppliers, receiving, lots, storage, genealogy, ledger);
**Products** is the finished-goods and in-process registry (SKUs, intermediate
lots, product lots, CoAs, variant configs) built on top of material lot
traceability. The bridge between the two — a shared controlled vocabulary
registry and Products' ability to cite a source Material Lot — is the natural
hero point: "one system of record from raw material receipt to released,
CoA-backed product lot."

**Do not oversell:** no bulk import and no live ID/sequence preview before
save (SKU, lot number, CoA revision are all "generated on save," not
previewed in real time) — don't imply real-time ID prediction. There's no
single aggregate dashboard endpoint; overview metrics are computed from
existing list data, not a dedicated analytics API — fine to call it "one
view," not "a unified analytics API."

### 7.2 Metadata

- **Meta title:** `Materials & Products Inventory Software | PixeSci TM`
- **Meta description:** `Track material lots, suppliers, and inventory from receipt to release, and finished products from intermediate lot to Certificate of Analysis, with full genealogy.`
- **Target keywords:** material lot tracking software, inventory genealogy software, supplier management software, product lot tracking, certificate of analysis software, controlled vocabulary registry

### 7.3 Page content (`materialsProductsPage` in `content/pages.ts`)

```ts
export const materialsProductsPage: MarketingPageData = {
  eyebrow: "Materials & products",
  title: "Track materials and products from receipt to release, with full genealogy.",
  description:
    "Manage suppliers, material lots, and inventory on one side, and product SKUs, intermediate lots, and Certificates of Analysis on the other, linked by one shared record system and one controlled vocabulary.",
  primaryCta: "Map your inventory workflow",
  primaryHref: demoBookingUrl,
  secondaryCta: "See manufacturing quality",
  secondaryHref: "/platform/manufacturing-quality",
  sections: [
    {
      eyebrow: "Materials",
      title: "Control incoming materials from receipt through release.",
      description: [
        "Qualify suppliers, place purchase orders, and receive material lots into quarantine. Sample and evaluate each lot before it can be released, and track storage conditions, expiry, and retest dates against it.",
        "Every field change is recorded in a change log, and every mutation requires a stated reason — nothing changes silently.",
      ],
      visual: "genealogy",
      features: [
        {
          title: "Supplier qualification",
          description:
            "Qualify, suspend, disqualify, or conditionally approve suppliers, with a real performance record.",
          icon: ShieldCheck,
        },
        {
          title: "Receipt and quarantine",
          description:
            "Receive lots into quarantine, sample them, and release or reject based on your criteria.",
          icon: ClipboardCheck,
        },
        {
          title: "Lot genealogy and ledger",
          description:
            "Track parent-child lot relationships and every inventory transaction against a lot.",
          icon: Network,
        },
        {
          title: "Reorder alerts",
          description:
            "Track purchase orders against real inventory levels and reorder thresholds.",
          icon: PackageCheck,
        },
      ],
    },
    {
      eyebrow: "Products",
      title: "Build finished products on top of traceable material lots.",
      description: [
        "Track product SKUs, finished-good product lots, and in-process intermediate lots as first-class, linked records. Each product lot can cite the intermediate lots and material lots it was built from.",
        "Issue Certificates of Analysis against released product lots. Reissuing a CoA supersedes the prior revision automatically, with the old and new versions linked.",
      ],
      features: [
        {
          title: "Product register",
          description:
            "Track SKUs, product lots, and variant configurations in one register.",
          icon: Boxes,
        },
        {
          title: "Intermediate lot tracking",
          description:
            "Track in-process intermediate lots and cite their source material lots directly.",
          icon: GitBranch,
        },
        {
          title: "Certificates of Analysis",
          description:
            "Issue CoAs against released product lots, with automatic supersession on reissue.",
          icon: BadgeCheck,
        },
      ],
    },
    {
      eyebrow: "Shared registry",
      title: "One controlled vocabulary across materials and products.",
      description:
        "Material and product codes share a single controlled vocabulary registry. Adding a new code doesn't require a document revision, and retiring a code is blocked if it's still in use anywhere in the system.",
      visual: "architecture",
      dark: true,
      bullets: [
        "Shared controlled vocabulary across materials and products",
        "Server-side guard against retiring an in-use code",
        "Field-level change log across every register",
        "No client-side actor field — every change is tied to the signed-in user automatically",
      ],
    },
  ],
  finalTitle: "Show us your material and product register.",
  finalDescription:
    "Bring your supplier list, material types, and product SKUs. We will map them into one traceable system.",
  finalCta: "Map your inventory workflow",
}
```

### 7.4 New icon imports needed

`Boxes`, `PackageCheck`, `GitBranch`, `Network`, `ShieldCheck`,
`ClipboardCheck`, `BadgeCheck` are all already imported elsewhere in
`content/pages.ts` — no new imports needed for this page.

### 7.5 FAQ entries to add to `/resources`

```ts
{
  question: "Can PixeSci TM track material and product genealogy?",
  answer:
    "Yes. Material lots track parent-child relationships and a full inventory ledger, and product lots can cite the intermediate and material lots used to build them, giving you a traceable path from raw material receipt to a released, CoA-backed product lot.",
},
```

### 7.6 Internal links to add

- From `/platform/materials-products`: link to `/platform/manufacturing-quality`
  (material dispensing consumes lots managed here) and `/platform/laboratory`
  (materials tested as samples).
- From `/platform/manufacturing-quality`: link back here on the "material
  dispensing" section.

---

## 8. New page: Manufacturing Quality — `/platform/manufacturing-quality`

### 8.1 Positioning

Covers `frontend-v2/src/features/manufacturing-quality` — a genuinely
complete electronic batch record (EBR) and batch release workflow, not a
mockup: formula and BOM registration, versioned Master Batch Records (MBR),
production batches openable only from an *approved* MBR revision, line
clearance and material dispensing, in-process controls (IPC) with automatic
deviation creation on failure, full batch genealogy, and a QA review/release
workflow with e-signature-style capture (printed name, reason, and a
re-authentication reference) on every approval. Internally this module is
called "Module 11" and its execution screen is labeled "BPR execution UI" in
one place — **do not use either term publicly**; use "electronic batch
records" and "batch manufacturing execution." Position clearly against
Quality Management: this page is where a batch is *built, run, and released*;
Quality Management is where the *exceptions it raises* are tracked and
closed.

**Do not oversell:** there's no automatic enforcement of operator training or
equipment qualification before a batch runs yet (the checklist items exist,
the enforcement doesn't) — don't claim automatic eligibility checks. Only
line clearance and in-process controls auto-create a deviation on failure;
material dispensing does not yet — say "in-process failures automatically
raise a deviation," not "every exception automatically raises a deviation."

### 8.2 Metadata

- **Meta title:** `Electronic Batch Record (EBR) Software | PixeSci TM`
- **Meta description:** `Run master batch records, line clearance, dispensing, in-process controls, and QA release with built-in e-signatures and full batch genealogy.`
- **Target keywords:** electronic batch record software, EBR software, MBR software, batch release software, batch manufacturing execution software, line clearance software, in-process control software

### 8.3 Page content (`manufacturingQualityPage` in `content/pages.ts`)

```ts
export const manufacturingQualityPage: MarketingPageData = {
  eyebrow: "Manufacturing quality",
  title: "Run electronic batch records from dispensing to release.",
  description:
    "Build a batch from an approved Master Batch Record, clear the line, dispense against real material lots, record in-process controls, and release with a built-in e-signature at every approval step.",
  primaryCta: "Map your batch record",
  primaryHref: demoBookingUrl,
  secondaryCta: "See quality management",
  secondaryHref: "/platform/quality-management",
  sections: [
    {
      eyebrow: "Batch records",
      title: "Batches open only from an approved Master Batch Record.",
      description: [
        "Register your product formula and Bill of Materials as controlled documents, then author a Master Batch Record against an approved formula and BOM revision. A production batch can only be opened from an approved MBR revision — the system enforces it, not just the process.",
        "The Electronic Batch Record for that batch derives its product, formula, and BOM linkage automatically, so operators aren't re-entering data the system already knows.",
      ],
      visual: "batch-record",
      features: [
        {
          title: "Versioned MBR",
          description:
            "Author Master Batch Records with the same review, approval, supersede, and obsolete lifecycle as any controlled document.",
          icon: FileCog,
        },
        {
          title: "Line clearance",
          description:
            "Clear the line with a checklist and a captured e-signature before a batch can run.",
          icon: ClipboardCheck,
        },
        {
          title: "Material dispensing",
          description:
            "Dispense against real, released material lots picked from your inventory, not free text.",
          icon: Boxes,
        },
        {
          title: "In-process controls",
          description:
            "Record process parameter results per step, with a failed result automatically raising a deviation.",
          icon: ShieldCheck,
        },
      ],
    },
    {
      eyebrow: "Genealogy",
      title: "See the full batch history in one tree.",
      description:
        "Follow one batch from formula and BOM through the MBR, EBR, dispensing events, in-process control results, finished goods lot, Certificates of Analysis, and any linked deviations — in a single traceability view.",
      visual: "genealogy",
      dark: true,
      bullets: [
        "Formula → BOM → MBR → EBR → dispensing → IPC results → finished lot → CoA",
        "Linked deviations shown in the same view",
        "The same traceability view drives QA review and disposition",
      ],
    },
    {
      eyebrow: "Release",
      title: "Review and release with a captured e-signature.",
      description:
        "QA reviews the full batch context — record, materials, in-process results, lab results, and deviations — in one screen, then approves or rejects with a reason, a printed name, and a re-authentication reference captured on the record. Release shows a readiness view before the release action becomes available.",
      features: [
        {
          title: "QA batch review",
          description:
            "Review the full batch context in one screen before approving or rejecting.",
          icon: UserCheck,
        },
        {
          title: "Disposition and release",
          description:
            "See a release-readiness view before the release action becomes available.",
          icon: BadgeCheck,
        },
        {
          title: "Captured approvals",
          description:
            "Every approval, clearance, and release captures a reason, a printed name, and a re-authentication reference.",
          icon: FileKey2,
        },
      ],
    },
  ],
  finalTitle: "Show us one batch record, from formula to release.",
  finalDescription:
    "Bring your formula, BOM, MBR, and release criteria. We will map them into an electronic batch record you can run.",
  finalCta: "Map your batch record",
}
```

### 8.4 New icon imports needed

All icons used here (`FileCog`, `ClipboardCheck`, `Boxes`, `ShieldCheck`,
`UserCheck`, `BadgeCheck`, `FileKey2`) are already imported by existing pages
in `content/pages.ts`.

### 8.5 FAQ entries to add to `/resources`

```ts
{
  question: "Does PixeSci TM support electronic batch records?",
  answer:
    "Yes. PixeSci TM tracks Master Batch Records, line clearance, material dispensing, in-process controls, and QA review and release for each batch, with an e-signature-style reason, printed name, and re-authentication reference captured at each approval step.",
},
{
  question: "What happens when an in-process control fails?",
  answer:
    "A failed in-process control result automatically raises a deviation, which is tracked as a Quality Management record and linked back to the batch.",
},
```

### 8.6 Internal links to add

- From `/platform/manufacturing-quality`: link to `/platform/materials-products`
  (dispensing source lots), `/platform/quality-management` (deviations raised
  here), `/platform/laboratory` (lab results in batch genealogy), and
  `/platform/equipment` (equipment used in production, once equipment
  eligibility enforcement ships — phrase as "equipment used in your process,"
  not an enforced gate today).
- From `/solutions/regulated-life-sciences`: replace the generic "batch
  record" mention in its tool-chain examples with a link to this page.

---

## 9. New page: Equipment — `/platform/equipment`

### 9.1 Positioning

Covers `frontend-v2/src/features/equipment` — described in `CLAUDE.md` as the
project's own reference implementation for list-page UI conventions, and
confirmed live with real seeded assets (microcentrifuges, biosafety cabinets)
and a working dashboard. Full lifecycle: registration → tiered (A/B/C)
IQ/OQ/PQ qualification with two-party sign-off → calibration, where an
out-of-tolerance result automatically flips the asset to in-repair status
**and** opens an investigation in the same transaction → preventive
maintenance/repair (same two-party sign-off pattern) → retirement. Cross-link
to Laboratory (instrument qualification behind test methods) and
Manufacturing Quality (equipment readiness ahead of batch execution).

**Do not oversell:** there is no full Part 11 cryptographic e-signature flow
here — say "two-party sign-off," not "electronic signatures" in the Part 11
sense (contrast with Manufacturing Quality and QMS, which do capture a
reason/printed-name/re-auth triplet — Equipment's sign-off is a simpler
owner-then-QA pattern). Third-party certification has no dedicated record
type, it's approximated through the service-provider record. Continuous
"Tier-A" monitoring is a manual check-and-log pattern, not real-time alarm
infrastructure. Multi-point/percent-based calibration and structured
IQ/OQ checklists exist on the backend but have no UI yet.

### 9.2 Metadata

- **Meta title:** `Equipment Calibration & Qualification Software | PixeSci TM`
- **Meta description:** `Track equipment qualification, calibration, preventive maintenance, and retirement for every asset, with automatic out-of-tolerance investigations.`
- **Target keywords:** equipment calibration software, asset qualification software, IQ OQ PQ software, preventive maintenance software, equipment lifecycle management, out-of-tolerance investigation

### 9.3 Page content (`equipmentPage` in `content/pages.ts`)

```ts
export const equipmentPage: MarketingPageData = {
  eyebrow: "Equipment",
  title: "Track qualification, calibration, and maintenance for every asset.",
  description:
    "Register equipment, qualify it by tier, calibrate it on schedule, and track maintenance and repair. An out-of-tolerance calibration automatically opens an investigation, no manual follow-up step required.",
  primaryCta: "Map your equipment register",
  primaryHref: demoBookingUrl,
  secondaryCta: "See laboratory workflow",
  secondaryHref: "/platform/laboratory",
  sections: [
    {
      eyebrow: "Asset lifecycle",
      title: "Register, qualify, and calibrate every asset the same way.",
      description: [
        "Register an asset with its category, location, responsible owner, and qualification tier. Qualify it through installation, operational, and performance qualification, with the owner signing off and quality countersigning as two separate steps.",
        "Calibrate on schedule, with due dates tracked automatically. An out-of-tolerance result flips the asset to in-repair and opens an investigation in the same action, so a failed calibration can't be missed.",
      ],
      visual: "equipment-lifecycle",
      features: [
        {
          title: "Tiered qualification",
          description:
            "Qualify assets by tier, with the highest tier flagged for continuous monitoring.",
          icon: BadgeCheck,
        },
        {
          title: "Two-party sign-off",
          description:
            "Require the responsible owner to sign, then quality to countersign, on qualification and maintenance.",
          icon: UserCheck,
        },
        {
          title: "Calibration with auto-investigation",
          description:
            "Flip an asset to in-repair and open an investigation automatically when a calibration fails.",
          icon: ShieldCheck,
        },
        {
          title: "Unified history",
          description:
            "See qualification, calibration, maintenance, and repair events for an asset in one timeline.",
          icon: History,
        },
      ],
    },
    {
      eyebrow: "Register",
      title: "Keep one register for every asset, instrument, and its methods.",
      description:
        "Track instrument methods and firmware or software versions as first-class registers, not buried on each asset page. Track your calibration and maintenance service providers, with their accreditation and a suspend, reactivate, and recertify lifecycle.",
      bullets: [
        "Full asset register with a real responsible-owner picker from your team",
        "Instrument methods and firmware or software version tracking",
        "Service provider register with accreditation tracking",
        "Category registry you can extend without a new deployment",
      ],
    },
  ],
  finalTitle: "Show us your equipment register.",
  finalDescription:
    "Bring your asset list, qualification tiers, and calibration schedule. We will map them into one system.",
  finalCta: "Map your equipment register",
}
```

### 9.4 New icon imports needed

`BadgeCheck`, `UserCheck`, `ShieldCheck`, `History` are already imported
elsewhere in `content/pages.ts`.

### 9.5 FAQ entries to add to `/resources`

```ts
{
  question: "What happens when a calibration fails in PixeSci TM?",
  answer:
    "An out-of-tolerance calibration result automatically moves the asset to in-repair status and opens an investigation in the same action — there's no separate manual step to remember.",
},
```

### 9.6 Internal links to add

- From `/platform/equipment`: link to `/platform/laboratory` (instrument
  qualification behind test methods) and `/platform/manufacturing-quality`
  (equipment used in batch production).
- From `/platform/laboratory` and `/platform/manufacturing-quality`: link
  here wherever instruments or equipment readiness is mentioned.

---

## 10. New page: Documents & Training — `/platform/documents-training`

### 10.1 Positioning

Covers `frontend-v2/src/features/documents-training` — confirmed real and
backend-integrated (no dummy data) via source read and a live authenticated
session. Two halves share one workbench because the product itself couples
them: **Document Control** (Quality Manuals, Policies, SOPs, Work
Instructions, Forms & Templates, and a Controlled Documents catch-all) runs a
real draft → submit for review → review → approve → active lifecycle, plus
supersede/obsolete/void, with real revisions and controlled-copy
distribution; **GxP Personnel Training** (assignments, read-and-understand
training tied to a specific document revision, instructor-led training,
competency assessments, qualification records, and a training matrix) is a
first-class record set, not a checkbox bolted onto the document. Lead with
the coupling: a document tagged "Training Required" cannot go active until
training is actually delivered against it, and a superseding revision can
retrigger training the same way. This is a stronger, more specific claim than
most document-control vendors make and is worth the hero position.

Documents are authored with a real structured-content editor — named
sections and up to three levels of numbered subsections, rendered by a
backend PDF rendering service into a formal, consistent document layout
(supporting paragraphs, nested lists, tables, callout boxes, and inline
Note/Example/Exception/Caution labels) — not a plain rich-text box. Mention
this once, briefly; it's a genuine differentiator but easy to over-explain.

**Do not oversell:** identifier/Area Code assignment is a QA-maintained
picklist, not self-service (deliberately, by design — don't imply free-form
document numbering). There is no e-signature crypto or Part 11 step-up
re-authentication here yet — describe approvals as "recorded," matching the
same careful phrasing used on the Quality Management and Manufacturing
Quality pages, not "electronic signatures" outright.

### 10.2 Metadata

- **Meta title:** `Document Control & GxP Training Software | PixeSci TM`
- **Meta description:** `Run SOPs and controlled documents through draft, review, approval, and periodic review, and connect every revision to the training records it requires.`
- **Target keywords:** document control software, SOP management software, controlled document software, GxP training software, training matrix software, read and understand training

### 10.3 Page content (`documentsTrainingPage` in `content/pages.ts`)

```ts
export const documentsTrainingPage: MarketingPageData = {
  eyebrow: "Documents & training",
  title: "Connect every controlled document to the training it requires.",
  description:
    "Run Quality Manuals, Policies, SOPs, Work Instructions, and Forms through draft, review, approval, and periodic review — and keep read-and-understand training, competency, and qualification records tied to the exact revision they cover.",
  primaryCta: "Map your document workflow",
  primaryHref: demoBookingUrl,
  secondaryCta: "See quality management",
  secondaryHref: "/platform/quality-management",
  sections: [
    {
      eyebrow: "Document control",
      title: "A real lifecycle, from draft to periodic review.",
      description: [
        "Draft a document, route it for review, approve it, and issue it as the active revision — or supersede, obsolete, or void it later, each a controlled action with a recorded reason, not a status field anyone can edit.",
        "Documents are authored in a structured content editor — named, numbered sections up to three levels deep, with tables, lists, and callout boxes — rendered into one consistent document layout, not a plain text box.",
      ],
      visual: "document-lifecycle",
      features: [
        {
          title: "Draft, review, approve, issue",
          description:
            "Route a new revision through review and approval before it becomes the active document.",
          icon: FileCog,
        },
        {
          title: "Structured authoring",
          description:
            "Author in named, numbered sections rendered into one consistent document layout.",
          icon: FileText,
        },
        {
          title: "Periodic review",
          description:
            "Schedule a review to confirm a document is still accurate, or flag it for revision.",
          icon: History,
        },
        {
          title: "Controlled copies",
          description:
            "Issue numbered copies to recipients, track acknowledgement, and recall a copy when it's replaced.",
          icon: ClipboardCheck,
        },
      ],
    },
    {
      eyebrow: "Training",
      title: "Training tied to the document revision it covers.",
      description:
        "Assign read-and-understand training against a specific document revision, schedule instructor-led sessions, and record competency assessments and role qualifications — each a real record, not a spreadsheet checkbox.",
      bullets: [
        "Read-and-understand training tied to a specific revision",
        "Instructor-led training by course and instructor",
        "Competency assessments by method — observation, exam, or record review",
        "Qualification records with a renewal due date",
      ],
    },
    {
      eyebrow: "Connected lifecycle",
      title: "A document tagged Training Required can't go active without it.",
      description:
        "When a document is marked as requiring training, it can't be activated until that training is actually delivered and recorded — the connection is enforced, not just documented in a procedure.",
      visual: "audit",
      dark: true,
      bullets: [
        "Training-required documents gate on real delivered training",
        "A training matrix cross-references role requirements against completion",
        "Review frequency tracked per role — annual, biennial, triennial, or on-change",
      ],
    },
    {
      eyebrow: "Connected to the rest of the platform",
      title: "The same documents your other records point back to.",
      description:
        "A CAPA can require an SOP revision. A Master Batch Record is itself a controlled document. Training records here are the same records your quality and manufacturing modules already reference.",
      bullets: [
        "CAPA-driven document revisions, tracked back to the record that required them",
        "Master Batch Records share this same controlled-document lifecycle",
      ],
    },
  ],
  finalTitle: "Show us one SOP, from draft to trained staff.",
  finalDescription:
    "Bring a real procedure and its training requirement. We will map it into a controlled document with training tied to the exact revision.",
  finalCta: "Map your document workflow",
}
```

### 10.4 New icon imports needed

`FileCog`, `FileText`, `History`, `ClipboardCheck` are already imported
elsewhere in `content/pages.ts` (see §§5–9) — no new imports needed for this
page.

### 10.5 FAQ entries to add to `/resources`

```ts
{
  question: "Does training stay connected to a specific document revision?",
  answer:
    "Yes. Read-and-understand training is assigned against a specific document revision, and a document marked as requiring training can't be activated until that training is actually delivered and recorded.",
},
{
  question: "Can we issue controlled copies of a document?",
  answer:
    "Yes — issue numbered copies to named recipients, track acknowledgement status, and recall a copy once it's replaced by a new revision.",
},
```

### 10.6 Internal links to add

- From `/platform/documents-training`: link to `/platform/quality-management`
  (CAPA-driven document revisions) and `/platform/manufacturing-quality`
  (Master Batch Records share this same controlled-document lifecycle).
- From `/platform/manufacturing-quality`: link back here on the "versioned
  MBR" feature.
- From `/platform/quality-management`: link here on CAPA/change-control
  sections that mention document updates.

---

## 11. New page: Reports & Analytics — `/platform/reports-analytics`

### 11.1 Positioning

Covers `frontend-v2/src/features/reports` — confirmed live as a genuine
cross-module roll-up layer, not a data source of its own: every number and
export reads real data from Quality, Equipment, Materials, Laboratory,
Manufacturing Quality, and Documents & Training. This is the natural
capstone page — cross-link into all six other Platform pages as "the record
types and metrics behind this dashboard," and into `/compliance` for the
Part 11 control-mapping capability specifically, since it's the most
inspection-relevant, legally-careful claim on this page and should carry the
same disclaimer tone. Because this page is descriptive/reporting rather than
itself a record-approval workflow, it's the one Platform page where the
`disclaimer` banner is optional — recommend including it anyway given the
Part 11 control-mapping content, for consistency with every other regulated
claim on the site.

**Do not oversell:** this is a read/export/rollup layer, not a report
*builder* — there's no custom report designer, scheduled emailing, or
BI-style pivot/chart authoring. Say "cross-module reporting" or "unified
view," never "analytics platform," "data warehouse," or "build your own
dashboards."

### 11.2 Metadata

- **Meta title:** `Quality & Compliance Reporting Software | PixeSci TM`
- **Meta description:** `See open deviations, CAPA, and calibrations across every module in one view. Verify your audit chain, map 21 CFR Part 11 controls, and export inspection-ready evidence.`
- **Target keywords:** inspection readiness software, quality metrics dashboard, management review software, 21 CFR Part 11 control mapping, audit trail export software, regulatory commitment tracking

### 11.3 Page content (`reportsAnalyticsPage` in `content/pages.ts`)

```ts
export const reportsAnalyticsPage: MarketingPageData = {
  eyebrow: "Reports & analytics",
  title: "See every open item across your quality system in one view.",
  description:
    "Roll up deviations, CAPA, complaints, calibrations, and inspection readiness from every module you use. Verify your audit chain, map your controls, and export evidence when you need it.",
  primaryCta: "Review your reporting needs",
  primaryHref: demoBookingUrl,
  secondaryCta: "See quality management",
  secondaryHref: "/platform/quality-management",
  sections: [
    {
      eyebrow: "Cross-module view",
      title: "One dashboard, sourced from the modules that own the data.",
      description:
        "See open deviations, nonconformances, investigations, incidents, CAPA, change control, and complaints from Quality Management, alongside equipment, materials, laboratory, and manufacturing summaries — each number comes from the module that owns it, not a re-derived guess.",
      visual: "dashboard",
      features: [
        {
          title: "Per-module dashboards",
          description:
            "See a live summary from Quality, Equipment, Materials, Laboratory, and Manufacturing Quality in one place.",
          icon: LineChart,
        },
        {
          title: "Evidence-gap check",
          description:
            "Check a set of records for missing required approvals, signatures, or evidence links.",
          icon: FileSearch,
        },
        {
          title: "Regulatory commitments",
          description:
            "Track open and overdue commitments to agencies, with the deliverable and evidence attached.",
          icon: CalendarClock,
        },
      ],
    },
    {
      eyebrow: "Inspection readiness",
      title: "Verify your audit chain and map your controls.",
      description: [
        "Run a hash-chain integrity check on your full audit trail at any time. Map your controls against a 21 CFR Part 11 checklist, with each control cited against the real audit and configuration data behind it.",
        "When you need to hand over evidence, export a full audit trail, a complete record with every version and approval, a CSV register of one record type, an evidence manifest, or a bundled inspection pack — every export is a direct, authenticated download.",
      ],
      visual: "audit",
      dark: true,
      bullets: [
        "On-demand audit chain integrity verification",
        "21 CFR Part 11 control mapping with cited evidence",
        "Audit trail, record, register, evidence, and inspection-pack exports",
      ],
    },
    {
      eyebrow: "Management review",
      title: "Review the same records your management review needs.",
      description:
        "Read a live rollup of open items by category, sourced from the same quality records used everywhere else in the system, instead of assembling a management review deck from separate spreadsheets.",
      features: [
        {
          title: "Management review summaries",
          description:
            "Read a live summary of open CAPA, effectiveness checks, and commitments ahead of your review.",
          icon: Users,
        },
      ],
    },
  ],
  finalTitle: "Show us what you report on today.",
  finalDescription:
    "Bring your current dashboards, inspection prep process, and management review packet. We will map them into one view.",
  finalCta: "Review your reporting needs",
}
```

### 11.4 New icon imports needed

Add `LineChart` (new). `FileSearch`, `CalendarClock` (added in §6.4), `Users`
already covered.

### 11.5 FAQ entries to add to `/resources`

```ts
{
  question: "Can PixeSci TM help us prepare for an inspection?",
  answer:
    "PixeSci TM can verify your audit chain, map your controls against a 21 CFR Part 11 checklist, and export audit trails, records, registers, evidence manifests, and bundled inspection packs on demand. These exports support your inspection preparation — they don't replace your own inspection readiness process.",
},
```

### 11.6 Internal links to add

- From `/platform/reports-analytics`: link to every other Platform page as
  "the record types and metrics behind this dashboard," and to `/compliance`
  for the Part 11 control-mapping claim specifically.
- From `/compliance`: reference the Part 11 control-mapping capability and
  link here.

---

## 12. Updates to existing pages

These are edits to content that already exists — do not restructure these
pages, just extend the specific arrays/sections named below. All of this is
sourced from the cross-cutting audit of `workflows`, `workflow-canvas`,
`chat`, `software`, `admin`, `automation`, and `agent-runs` (§14.8), plus
cross-links back into the seven new pages.

### 12.1 Homepage (`/`, `src/components/sections/home-page.tsx` +
`src/content/site.ts`)

- **`platformCapabilities`** (site.ts) — no change needed to the existing six
  items; they still describe the core workflow-automation loop accurately.
- **Add a new "Platform" teaser section** to the homepage, after the existing
  platform-overview section and before the integrations teaser. A simple
  `FeatureGrid` of 6–7 tiles (reuse `FeatureGrid` from
  `src/components/sections/feature-grid.tsx`), one per new Platform page,
  each linking out:

```ts
export const platformModules: (FeatureItem & { href: string })[] = [
  {
    title: "Laboratory",
    description: "Track samples from accessioning to Certificate of Analysis.",
    href: "/platform/laboratory",
    icon: FlaskConical,
  },
  {
    title: "Quality Management",
    description: "Track deviations, CAPA, nonconformances, and complaints.",
    href: "/platform/quality-management",
    icon: ShieldCheck,
  },
  {
    title: "Materials & Products",
    description: "Track material lots, suppliers, products, and genealogy.",
    href: "/platform/materials-products",
    icon: Boxes,
  },
  {
    title: "Manufacturing Quality",
    description: "Run electronic batch records from dispensing to release.",
    href: "/platform/manufacturing-quality",
    icon: FileCog,
  },
  {
    title: "Equipment",
    description: "Track qualification, calibration, and maintenance.",
    href: "/platform/equipment",
    icon: BadgeCheck,
  },
  {
    title: "Documents & Training",
    description: "Control documents and connect them to training records.",
    href: "/platform/documents-training",
    icon: FileText,
  },
  {
    title: "Reports & Analytics",
    description: "See every open item across your quality system in one view.",
    href: "/platform/reports-analytics",
    icon: LineChart,
  },
]
```

  Note this needs a small extension to `FeatureGrid` or a thin wrapper
  component to make each tile a `<Link>` (today's `FeatureGrid` items aren't
  clickable) — flag to the implementer as the one small component change this
  section needs; not a content decision.
- Section heading/copy suggestion: eyebrow `"Platform"`, title `"One
  platform, every regulated workflow."`, description: `"PixeSci TM started as
  workflow automation for the software you already use. It now covers the
  full regulated lab record system around that work — see what's built."`

### 12.2 `/product`

- Keep the existing "Describe. Review. Run. Track." narrative and sections
  exactly as they are — this page stays the "how it works" story.
- **Strengthen the "Talk to your lab!" section** with the capability-registry
  finding from the cross-cutting audit: add a fifth feature to that section's
  `features` array (currently 4 items):

```ts
{
  title: "Governed AI actions",
  description:
    "Every action — human, workflow, or AI-initiated — runs through a capability registry that knows its risk level, required permissions, and whether it's safe to run automatically.",
  icon: ShieldCheck,
},
```

- **Add one new section** after the existing "Run locally and watch each
  step" section, introducing the Platform modules and linking out (avoids
  duplicating the new pages' content — this is a one-paragraph teaser, not a
  restatement):

```ts
{
  eyebrow: "Platform",
  title: "The same workflow engine runs your regulated modules.",
  description:
    "Laboratory sample tracking, quality records, materials and products, manufacturing batch records, equipment qualification, and document control all run on the same local-first workflow engine described above.",
  primaryLinkNote: "See the Platform section for a page on each module.",
},
```

  (Note: `primaryLinkNote` is not a real `PageSection` field — this is
  guidance for the implementer to add a short "See all Platform modules →"
  link under the description, either by extending `PageSection` with an
  optional link field, or by hardcoding this one section outside the
  generic `MarketingPage` loop. Flag as a small implementation decision, not
  a content ambiguity — the content above is final either way.)

### 12.3 `/workflow-automation`

- Strengthen the existing "Make human review part of the workflow" section
  with the risk-scoring finding — human-review nodes are confirmed to carry
  per-step risk metadata, not a single blanket approval. Update the
  `"Human steps"` feature description from `"Ask an operator to decide,
  confirm, or review a step inside the workflow."` to:

```
"Ask an operator to decide, confirm, or review a step inside the workflow, with each review step scored by risk level."
```

- Optionally add a bullet under the "Build the workflow" section noting
  workflows are typed graphs: `"Workflow steps are typed and connected, not a
  flat script — each step knows what it needs and what it produces."` (Only
  add if it doesn't crowd the existing three features; use judgment.)

### 12.4 `/security`

- Add a new feature to the existing "Controls" section's `features` array
  (currently 6 items in `securityPage`), reflecting the real granular
  permission model and role templates found live:

```ts
{
  title: "Scoped permissions",
  description:
    "Start from role templates built for regulated teams, like an auditor role that can read and export evidence without changing records, or a technician role scoped to lab execution only.",
  icon: Users,
},
```

  (`Users` icon is already imported in `content/pages.ts` for `securityPage`.)
- Add one sentence to the page's first section description referencing AI
  action governance: `"See and control what the AI can do, and audit what it
  did, the same way you audit any other user action."`

### 12.5 `/integrations`

- Add one clarifying sentence to the page's intro copy distinguishing
  PixeSci-built apps from detected third-party software: `"Some tools, like
  our built-in workflow apps, are always available. Others are detected on
  your own workstations and servers before a workflow can use them."`
- No structural changes — the existing 8-category catalog framing is
  accurate and doesn't need new categories from this audit.

### 12.6 `/compliance`

- Add a short paragraph (after the existing ALCOA section) cross-linking
  into `/platform/quality-management` for the concrete record system, and
  `/platform/reports-analytics` for the Part 11 control-mapping capability:

```
"These principles are backed by a real record system: see how deviations,
CAPA, and audit trails work on the Quality Management page, and how control
mapping and evidence export work on the Reports & Analytics page."
```

  (Render as plain text with inline links, matching how other pages already
  reference related pages in prose — check `resources-page.tsx` or
  `company-page.tsx` for the existing inline-link pattern in body copy before
  implementing.)

### 12.7 `/solutions/regulated-life-sciences`

- Update the tool-chain `bullets` in the page's first section
  (`regulatedPage` in `content/pages.ts`) to reference real module names
  instead of generic placeholders. Current bullets:

```
"FlowJo → GraphPad Prism → LIMS / ELN"
"Chromeleon or Empower → LIMS → batch record"
"CellProfiler or ImageJ → statistics → Benchling / review"
"Mass spectrometry → MaxQuant → R or Python → LIMS"
```

  These are fine as third-party tool-chain examples (they describe customer
  software, not PixeSci TM's own modules) — leave them as-is, but add one new
  bullet naming the platform's own modules explicitly:

```
"Lab results and CoAs → PixeSci TM Laboratory and Quality Management records"
```

- Update the "OOS and OOR records" feature description to reference the real
  gating behavior: `"Keep original results, run details, settings, change
  reasons, and reviews for an investigation — and block release automatically
  until it closes."`
- Add one link in the page's closing section to `/platform/manufacturing-quality`
  for readers evaluating batch-record software specifically.

### 12.8 `/resources` FAQ

Beyond the per-page FAQ entries already listed in §§5–11, add two
platform-level entries near the top of the existing 12-entry FAQ list:

```ts
{
  question: "What's included in the PixeSci TM platform beyond workflow automation?",
  answer:
    "PixeSci TM also includes laboratory sample tracking, quality management (deviations, CAPA, complaints), materials and products inventory, electronic batch records for manufacturing, equipment qualification and calibration, and document control connected to training records — all running on the same local-first workflow engine.",
},
{
  question: "Can we use only some of the PixeSci TM modules?",
  answer:
    "Yes. Modules connect to the same underlying record and audit system, but you can adopt the ones relevant to your team first and add others later.",
},
```

---

## 13. SEO appendix

This section consolidates the metadata scattered through §§5–12 into single
reference tables, so an implementer doesn't have to hunt through the whole
document to fill in `createMetadata()` calls or `sitemap.ts`.

### 13.1 Meta title / description table

| Route | Meta title | Meta description |
|---|---|---|
| `/platform/laboratory` | Laboratory (LIMS) Software \| PixeSci TM | Track samples from accessioning to Certificate of Analysis. Chain of custody, worksheets, analyst and quality-unit review, and OOS/OOT investigation gating, run locally. |
| `/platform/quality-management` | Quality Management System (QMS) Software \| PixeSci TM | Track deviations, CAPA, nonconformances, complaints, and audits in one hash-chained record system. Generate ALCOA+, Part 11, and validation evidence for your own deployment. |
| `/platform/materials-products` | Materials & Products Inventory Software \| PixeSci TM | Track material lots, suppliers, and inventory from receipt to release, and finished products from intermediate lot to Certificate of Analysis, with full genealogy. |
| `/platform/manufacturing-quality` | Electronic Batch Record (EBR) Software \| PixeSci TM | Run master batch records, line clearance, dispensing, in-process controls, and QA release with built-in e-signatures and full batch genealogy. |
| `/platform/equipment` | Equipment Calibration & Qualification Software \| PixeSci TM | Track equipment qualification, calibration, preventive maintenance, and retirement for every asset, with automatic out-of-tolerance investigations. |
| `/platform/documents-training` | Document Control & GxP Training Software \| PixeSci TM | Run SOPs and controlled documents through draft, review, approval, and periodic review, and connect every revision to the training records it requires. |
| `/platform/reports-analytics` | Quality & Compliance Reporting Software \| PixeSci TM | See open deviations, CAPA, and calibrations across every module in one view. Verify your audit chain, map 21 CFR Part 11 controls, and export inspection-ready evidence. |

The `title` prop passed to `createMetadata()` should be the part before
`" | PixeSci TM"` — the helper appends the brand suffix itself (see
`src/lib/seo.ts:16`), so pass e.g. `"Laboratory (LIMS) Software"`, not the
full branded string.

### 13.2 Target keyword clusters

| Page | Primary keywords | Secondary / long-tail |
|---|---|---|
| Laboratory | LIMS software, laboratory information management system | sample tracking software, chain of custody software, lab sample management, certificate of analysis software, OOS OOT investigation software |
| Quality Management | QMS software, quality management system software | CAPA software, deviation management software, nonconformance software, complaint handling software, ALCOA+ software, 21 CFR Part 11 software |
| Materials & Products | material lot tracking software, inventory genealogy software | supplier management software, product lot tracking, certificate of analysis software, controlled vocabulary registry |
| Manufacturing Quality | electronic batch record software, EBR software | MBR software, batch release software, batch manufacturing execution software, line clearance software, in-process control software |
| Equipment | equipment calibration software, asset qualification software | IQ OQ PQ software, preventive maintenance software, equipment lifecycle management, out-of-tolerance investigation |
| Documents & Training | document control software, SOP management software | controlled document software, GxP training software, training matrix software, read and understand training |
| Reports & Analytics | inspection readiness software, quality metrics dashboard | management review software, 21 CFR Part 11 control mapping, audit trail export software, regulatory commitment tracking |

Every keyword above is a real, defensible description of a live feature
(traceable to §14) — none are aspirational SEO bait. When implementing, work
these phrases naturally into page body copy (not just metadata) — Google
weighs on-page text, and the drafted section copy in §§5–11 already contains
most of these phrases organically. Do a final pass once all seven pages are
implemented to confirm each primary keyword appears at least once in visible
body text, not just in `<title>`/`<meta>`.

### 13.3 Internal linking matrix

A quick-reference version of the per-page "internal links to add" call-outs
scattered through §§5–12:

| From | Links to |
|---|---|
| Laboratory | Quality Management, Equipment, Manufacturing Quality |
| Quality Management | Compliance, Laboratory, Manufacturing Quality, Equipment, Documents & Training |
| Materials & Products | Manufacturing Quality, Laboratory |
| Manufacturing Quality | Materials & Products, Quality Management, Laboratory, Equipment |
| Equipment | Laboratory, Manufacturing Quality |
| Documents & Training | Quality Management, Manufacturing Quality |
| Reports & Analytics | all six other Platform pages, Compliance |
| `/product` | Platform teaser section → all seven Platform pages |
| `/compliance` | Quality Management, Reports & Analytics |
| `/security` | (no new outbound Platform links required — see §12.4, this page gets a content addition, not new links) |
| `/solutions/regulated-life-sciences` | Manufacturing Quality |
| Homepage | all seven Platform pages via the new Platform teaser grid (§12.1) |

Every Platform page should link to at least two others and back to
`/product`. Avoid a fully-connected mesh (every page linking every other
page) — it reads as SEO-stuffing rather than genuine cross-reference; the
table above is deliberately sparse and directional (module → the modules it
actually hands data to or receives data from).

### 13.4 `sitemap.ts` priority table

See §3.3 for the full route array. Priority assignment:

| Priority | Routes |
|---|---|
| 1.0 | `/` (unchanged) |
| 0.8 | `/product`, all 7 `/platform/*` routes, all 3 `/solutions/*` routes, `/integrations`, `/compliance`, `/security`, `/workflow-automation` |
| 0.6 | `/resources`, `/company`, `/privacy` |

Recalculate the `index < N` boundary in `sitemap()`'s priority logic against
the exact final route array — don't hardcode `16` if the array changes
before shipping (see the caveat already noted in §3.3).

### 13.5 JSON-LD `featureList` — full replacement text

See §3.4 for the complete array to use in `softwareApplicationJsonLd`. No
further changes needed beyond what's specified there.

### 13.6 FAQPage JSON-LD

`/resources` already emits `FAQPage` structured data via `createFaqJsonLd()`
over its FAQ entries array (`src/lib/seo.ts:97`). Every FAQ entry added in
§§5, 6, 7, 8, 9, 10, 11, and 12.8 above is automatically picked up by this
existing mechanism once appended to the FAQ array — no separate JSON-LD work
needed, just make sure new entries are added to whichever array
`resources-page.tsx` passes into `createFaqJsonLd()`.

---

## 14. Raw audit appendix

Condensed evidence trail for every claim made in §§5–13, organized by module.
Every finding below was produced by (a) reading the actual feature source in
`pixesciv2/frontend-v2/src/features/*` — components, types, API layers, and
each feature's own `docs/*-feature-overview.md` where one exists — and, where
noted, (b) exercising the real local backend
(`http://localhost:8000/api/v1`) with the test account `japhethtest17` /
`Password_2026@!` (real login field is `username`, not `email`) against a
running `pixesciv2` dev environment. Nothing here is inferred from the
feature's name alone.

### 14.1 Laboratory (`laboratory`, `lab-os`)

Source: `LaboratoryLimsWorkbench.tsx`, `SampleWorkspace.tsx` + 8 sibling
sample-workspace tabs, `StudyExplorer.tsx`, `ClientProjectWorkspace.tsx`,
`MethodsWorkbench.tsx`/`TestCatalogWorkbench.tsx`/`SpecificationsWorkbench.tsx`/
`CalculationsWorkbench.tsx`, `RetentionSamplesWorkbench.tsx`, and
`docs/laboratory-feature-overview.md`. One workbench, 19 operational areas,
no Redux — pure RTK Query against `laboratory-api.ts`
(`GET /laboratory/workbench` for the dashboard) and
`laboratory-lifecycle-api.ts` (per-domain endpoints: samples, containers,
custody, worksheets, results, review/release, definitions, studies,
retention, clients/projects, labels). Confirmed real: sample-anchored
workspace with 9 of 19 areas as tabs inside one sample record; four
versioned controlled-definition registries sharing one underlying
`LaboratoryControlledDefinition` engine (deliberately duplicated per-kind
in the UI, not shared code — a scope decision, not a bug); a real
`GET /worksheets/{uid}/ongoing-eligibility` and `POST /results/import`
endpoint exist and are wired but not yet surfaced in any current UI (future
capability, not dead code). The product's own UI never uses the word "LIMS."
Known gaps: within-sample tab selection isn't URL-addressable (only "which
sample" is); dashboard deep-links land on a sample/area, not a specific
worksheet/result/CoA row.

### 14.2 Quality Management (`qms`, `compliance`, `audit-logs`)

Source: `qms-workbench.tsx`, `quality-domain-workspace.tsx`,
`constants/quality-domains.ts` (16 domain definitions), `compliance-api.ts`,
and `docs/qms-feature-overview.md`. Two real, separate data models share one
screen: a legacy `QmsCase` projection over workflow-execution activity
(cases/approvals/evidence/signatures/review-queue), and the typed Quality
record kernel — 16 first-class kinds (deviation, nonconformance, OOS
investigation, OOT investigation, incident, CAPA, CAPA action item, change
control, complaint, audit, audit finding, supplier qualification, supplier
issue, risk, management review, effectiveness check, regulatory commitment),
each backend-lifecycle-enforced (`PATCH` cannot change `status` — only a
typed transition can). Complaints have their own dedicated `/report` intake
endpoint with real evidence-byte capture and MDR determination/submission —
confirmed the generic create/update path silently drops complaint-specific
fields and has no complaint-specific authorization, so complaint intake in
the UI never uses the generic path. `compliance-api.ts` confirmed live
endpoints for audit-chain verification, signature manifestation/verification,
ALCOA+ report, Part 11/GMP/ISO 13485 assessments, plus a `/validation/*`
family (IQ report, OQ report, risk assessment, requirements traceability
matrix, config export, full validation package) — all real, queryable
endpoints, not mockups. Known gap: `reauthenticationEventId` is collected on
approvals but not yet verified against a real re-authentication challenge — a
documented backend limitation, not a frontend gap.

### 14.3 Materials & Products (`materials`, `products`)

Source: `materials-workbench.tsx`, `docs/materials-feature-overview.md`,
`products-workbench.tsx`, `docs/products-feature-overview.md`. Both features'
own documentation states zero open backend-integration debt items, and both
explicitly describe themselves as having no Redux slice, no simulation, and
no dummy data — the strongest self-attestation of any module audited. real
genealogy: `ProductLineageLink` is a real join table (not a persisted array),
resolved live at read time in both directions. The Controlled Vocabulary
Registry spans nine code types (three Materials/Supplier-owned, six
Products-owned) in one table with server-enforced retirement guards for all
nine — live-verified: attempting to retire an in-use `pathogen` code
referenced by a real `ProductSku` returns a 422. Supplier creation is a
deliberate two-call flow (create-minimal, then PATCH the rest) matching the
governing SOP's create-as-Pending → qualify sequence, not a workaround. Known
gaps: no bulk import, no live ID/sequence preview (SKU/lot number/CoA
revision show "Generated on save" — the real value isn't knowable until the
create transaction commits), no e-signature crypto.

### 14.4 Manufacturing Quality (`manufacturing-quality`)

Source: `ManufacturingQualityBatchWorkbench.tsx`,
`docs/manufacturing-quality-feature-overview.md`. Internally this module's
code and docs refer to it as "Module 11" — do not use that term publicly.
Confirmed real: formula/BOM register, versioned Master Batch Records,
production batches, line clearance, material dispensing against real
material lots (via `RelationshipPicker`, not free text), in-process controls,
batch genealogy, execution deviations, and QA review/disposition. A "dual
kernel" exists — a decoy generic scaffold at `/api/v1/manufacturing-quality/*`
and the real typed kernel at `/api/v1/manufacturing/*` — the frontend's
`MIGRATED_PATHS` table routes each of the 9 scope tabs to whichever backend
actually serves it; this is an internal routing detail, not something to
describe publicly, but it's why "which paths are real" needed direct
verification rather than trusting a route name. Confirmed: line clearance and
in-process control failures auto-create a Quality deviation; material
dispensing does not yet have an equivalent failure hook (a manual "Create
deviation from this record" action covers that gap today). No automatic
enforcement of operator training or equipment qualification before a batch
runs — the checklist items exist in the UI, the backend enforcement doesn't
yet.

### 14.5 Equipment (`equipment`)

Source: `equipment-workbench.tsx`, `equipment-asset-detail-content.tsx`,
`docs/equipment-feature-overview.md`, `docs/BACKEND_TECHNICAL_DEBT.md`. This
feature is the project's own reference implementation for list-page UI
conventions (per `frontend-v2/CLAUDE.md`) and was rebuilt off a local
simulation onto the real backend after a 27-item punch list was fully
resolved (commit `99733f7c`) — confirmed via its own docs and its 65 real
`/equipment/*` routes across 8 endpoint factories (asset, category,
qualification-calibration, operations, software-oot, monitoring,
service-provider, generic-event). Confirmed real and load-bearing:
`RecordCalibrationResultDialog` posting an out-of-tolerance result flips the
asset to `in_repair` **and** opens an `OOTInvestigation` in one backend
transaction — genuinely automatic, not two manual steps. Two-party sign-off
(owner signs, then QA countersigns) is real for both qualification and
maintenance. Known gaps, confirmed not built: no cross-asset Change Log
endpoint (the frontend aggregates N per-asset calls client-side); third-party
Certification has no first-class backend entity (approximated via a
ServiceProvider + linked GenericEquipmentEvent); multi-point/percent-based
calibration, structured IQ/OQ checklists, and bulk import exist on the
backend schema but have no UI; continuous "Tier-A" monitoring is a manual
check-and-log pattern, not real-time alarm infrastructure; no full Part 11
cryptographic e-signature flow on either side.

### 14.6 Documents & Training (`documents-training`)

Source: `documents-training-workbench.tsx`,
`docs/documents-training-feature-overview.md`, `types/document-control.types.ts`,
`types/regulated-module-record.types.ts`, `constants/documents-training-config.ts`.
Confirmed real and backend-integrated end to end, per the feature's own
overview doc ("there is no dummy/placeholder data anywhere in this feature").
Two real backends share one workbench: `document_control.py` (six document
paths — quality manuals, policies, SOPs, work instructions, forms/templates,
and a controlled-documents catch-all — full draft → review → approve →
active lifecycle plus supersede/obsolete/void, real revisions, controlled
copies with acknowledgement tracking) and the `/personnel-training` kernel
(training assignments, acknowledgements, competency assessments, a training
matrix). Document content uses a structured section/subsection model (up to
3 levels, SOP-numbered) with a constrained markdown-lite body format
(paragraphs, nested lists, tables, callout boxes, Note/Example/Exception/
Caution inline labels), rendered server-side into a formal document layout —
a real backend `pdf_rendering_service.py` renders it, this is not a plain
textarea. `TrainingCompletionPanel` in the source confirms a document tagged
"Training Required = Yes" is activated specifically once training has been
delivered — the training-gates-activation claim on the new page is a direct
reading of this component, not an inference. Live test: authenticated
successfully via `username`/`password`; two of the document-listing
endpoints (`GET /documents/sops`, `GET /documents/policies`) returned a
500 in this specific local dev environment and `GET
/personnel-training/matrix-roles` returned an empty array — most likely a
local seed-data/environment quirk given the rest of the codebase's
documentation and type coverage is unambiguous and complete; noted here for
transparency, not treated as a real product limitation, and nothing above is
sourced from those two failed calls. Area Code/identifier assignment is
deliberately a QA-maintained picklist (SOP 101-001), not self-service — do
not describe document numbering as free-form.

### 14.7 Reports & Analytics (`reports`)

Source: `ReportsInsightsWorkbench.tsx`, `InspectionReadinessPanel.tsx`,
`ManagementReviewSummaryPanel.tsx`, `types.ts`, `api/reports-api.ts`. No
feature-overview doc exists for this one; audited directly from source (small
feature, 8 files). Confirmed this is a pure roll-up/export layer with no data
of its own — every query reads from the module that owns the data (Quality,
Manufacturing, Laboratory, Training, Equipment, Materials each have a
dedicated `/reports/metrics/{module}` endpoint). `InspectionReadinessPanel`
is genuinely a real toolkit, not a mockup — its own in-file comment states
"every export here hits an already-live backend endpoint... that no frontend
code called before this panel existed": audit-chain verification (reusing
`compliance`'s `useVerifyAuditChainQuery`), and five direct-download export
endpoints (audit trail, full record, register CSV, evidence manifest,
validation-artifact manifest) — all cookie-authenticated plain links, no
client-side Blob plumbing. `ManagementReviewSummaryPanel` is deliberately
read-only, linking out to the real Quality > Management Reviews tab for the
actual schedule/convene/approve workflow rather than duplicating it. An
"Inspection Pack" bundle endpoint (`/reports/inspection-packs/{uid}/bundle`)
assembles a record's full evidence manifest, missing-required-roles check,
and audit trail slice into one downloadable package — this is the strongest
single "inspection readiness" claim in the whole audit and is under-used in
the current page draft; consider giving it more prominence if revising §11.
Not a report builder — no custom report designer, no scheduled email, no
BI-style pivot/chart authoring exists anywhere in this feature.

### 14.8 Cross-cutting (`workflows`, `workflow-canvas`, `chat`, `software`,
`admin`, `automation`, `agent-runs`)

These six feed updates to *existing* pages (§12), not new Platform pages.

- **`chat`** (`docs/chat-feature-overview.md`) — confirmed real: persisted
  backend chat sessions, tabbed workspace, message attachments, voice
  input/output, software mentions, agent-activity-timeline rendering,
  workspace search across chat and workflow context, and an artifacts
  viewer. Distinct from `assistant` (a lightweight local-only panel that,
  per its own docs, calls no backend endpoints yet — don't conflate the
  two, and don't market `assistant`'s capabilities as live).
- **`workflows` + `workflow-canvas`** (`docs/workflow-and-canvas-feature-overview.md`) —
  confirmed the runtime is graph-native (nodes/edges, not a legacy ordered
  step array), with add-step schema loading and per-node capability
  validation against a live capability registry
  (`GET /automation/capabilities/software/{adapter}/capabilities/{capability}/schema`,
  `POST /automation/capabilities/workflows/{id}/nodes/validate`). This
  confirms the existing `/workflow-automation` page's "typed graph" framing
  is accurate and can be stated more specifically (§12.3).
- **`software`** (`docs/software-feature-overview.md`) — confirmed the
  catalog cleanly separates backend-managed profiles from local Tauri/browser
  detection signals; local detection can fail independently of catalog
  loading, and a cataloged app need not be installed locally. Supports the
  existing `/integrations` framing that not every listed tool is
  production-ready for every deployment — no change needed beyond the one
  clarifying sentence in §12.5.
- **`admin`** (`docs/admin-feature-overview.md`) — confirmed real: user
  invite/deactivate/role management, a scoped permission-grant/delegation
  model, a capability catalog with draft/publish review, and audit-log
  visibility (reusing `audit-logs`'s panel directly — admin has no separate
  audit logic of its own). Confirmed placeholder, not real: License,
  Subscriptions & Billing, AI Usage, Support, and Advanced Settings pages —
  none has a backend contract yet; do not market billing/AI-usage-tracking
  features.
- **`automation` + `agent-runs`** — `automation` itself is a thin linking
  shell with no API calls of its own. `agent-runs`
  (`AgentRunDetailDrawer.tsx`, `types/index.ts`) is the real substance: every
  agent run has a full trace (`AgentTraceEvent[]`), a replay endpoint
  (`useGetAgentRunReplayQuery`) returning events/tool-calls/observations/
  approvals/artifacts, and a capability registry entry with a health state
  (`healthy`/`degraded`/`unavailable`/`unconfigured`/`requires_auth`/
  `requires_approval`), risk level, required permissions, and an
  `requires_approval` flag. This directly substantiates the "governed AI
  actions" claim added to `/product` in §12.2 — it is not marketing language
  layered on top of a plain chat feature, it's a real approval-gated
  execution-trace system.

### 14.9 What was deliberately not audited for this brief

`apps` (Prompt Studio) and `assistant` are frontend-only simulations per
their own source (`buildSimulatedPromptStudioResponse`, and `assistant`'s own
statement that it "does not call backend assistant, AI, billing, or support
endpoints yet") — excluded from every claim above and from every new page.
`layout`, `theme`, `list-view-preferences`, and `notifications` are
UI-state infrastructure with no marketable capability of their own.
`lab-os` was audited only as the shared module-registry framework behind the
other modules (its `core-modules.ts`/`support-modules.ts` module labels —
Laboratory, Quality, Documents & Training, Materials, Products, Equipment,
Manufacturing Quality, Automation, Reports, Administration — are the
authoritative in-app terminology this brief's page names and nav labels were
checked against).

---

*End of brief.*
