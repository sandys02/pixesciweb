<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# PixeSci Website Agent Guide

## Project Purpose

This repository is the public marketing website for PixeSci, a local-first platform that connects and automates scientific software for high-control scientific environments. The website must explain quickly that PixeSci lets users describe work in plain language, review the steps, run workflows locally, and track actions, files, decisions, and results. It is not a generic AI SaaS landing page and must not drift into vague automation copy.

Primary audiences are regulated life-sciences teams, lab operations leaders, QC and R&D leaders, core facility staff, national lab teams, scientific software operators, and technical buyers who care about traceability, reproducibility, data locality, deployment control, and integration with existing scientific tools.

## Design Direction

Use Vercel as the primary inspiration for restraint, precision, spacing, technical confidence, crisp navigation, modular product storytelling, and enterprise conversion structure. Use ElevenLabs only for selective polish: immersive media moments, confident product category framing, and high-end interactive feel. Use Sunburst only for visual storytelling patterns around process, guided workflows, and product-in-context sequences. Never copy layouts, text, components, gradients, animations, or visual signatures directly from any inspiration site.

The PixeSci brand should feel:

- modern, premium, technical, elegant, and enterprise-ready
- precise rather than decorative
- scientific rather than generic productivity software
- trustworthy for regulated and security-conscious environments
- local-first and infrastructure-grade without feeling old or defensive

Avoid one-note color palettes. The default visual language should combine neutral technical surfaces with restrained scientific accents. Do not let the site become dominated by purple-blue gradients, beige/tan, dark slate, or decorative glow blobs.

## Technical Expectations

Use the existing stack unless the user explicitly changes direction:

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4 with CSS variables in `src/app/globals.css`
- shadcn/ui-style primitives and Radix where useful
- lucide-react icons
- server components by default, client components only for interactivity
- data-driven sections from constants where repetition exists

Before writing code, read the relevant Next 16 docs in `node_modules/next/dist/docs/` for APIs you touch. Keep route and metadata patterns compatible with this installed version.

## File Organization

Prefer a clear marketing-site structure:

- `src/app` for routes, layouts, metadata, and SEO files
- `src/components/site` for global website shell such as header, footer, nav, CTAs
- `src/components/sections` for page sections
- `src/components/ui` for shadcn-style low-level primitives
- `src/components/visuals` for product diagrams, workflow visuals, and motion scenes
- `src/lib` for utilities, SEO helpers, and shared formatting
- `src/content` or `src/data` for navigation, feature lists, routes, integrations, compliance copy, and page content

Keep components small and composable, but do not split every tiny element into its own file. Reuse section primitives for grids, metric rows, proof bands, CTA bands, and feature comparisons.

## Coding Standards

- Write TypeScript with explicit prop types for reusable components.
- Prefer semantic HTML and accessible native elements.
- Keep copy in data files when it is reused or repeated.
- Use `cn` from `src/lib/utils.ts` for class merging.
- Use lucide icons from `lucide-react` instead of hand-drawn SVG icons when an icon exists.
- Keep comments rare and useful.
- Do not introduce backend calls for marketing content unless the implementation prompt explicitly requests them.
- Do not hardcode claims that PixeSci is certified, FDA-approved, HIPAA-certified, SOC 2 certified, or Part 11 validated unless documentation is added proving that status.
- Use `DemoBookingLink` for visible demo-calendar links so they consistently open the canonical Cal.com page in a new tab and emit the existing analytics event.
- Keep the canonical website URL and demo-calendar URL in `src/content/site.ts`; do not repeat those URLs across components.
- Keep Vercel Analytics and Speed Insights in the root layout unless the user explicitly changes the measurement approach.

## Styling Principles

- Build a crisp, conversion-focused marketing site with restrained premium surfaces.
- Prefer strong typography, exact spacing, thin borders, subtle shadows, and purposeful product visuals.
- Use cards only for repeated items, proof modules, comparisons, and framed product mockups. Do not nest cards inside cards.
- Keep border radii restrained, generally 6-10px unless a specific primitive requires otherwise.
- Use gradients sparingly as depth or highlight, not as the main brand identity.
- Avoid decorative orbs, bokeh blobs, and generic abstract SaaS backgrounds.
- Use product-inspired visuals: workflow graphs, audit timelines, software catalog grids, environment-control views, compliance records, and integration pipelines.
- Do not expose PixeSci's private implementation architecture in public visuals or copy. Avoid framework names, backend service names, database choices, model runtimes, internal protocols, ports, and component topology unless the user explicitly approves disclosure.
- For deployment and security sections, show customer-facing controls and outcomes such as data location, internet access, approvals, audit logging, credentials, backups, and retention.
- Text must never overlap, clip, or rely on viewport-scaled font sizing.

## Accessibility Rules

- Use one logical `h1` per page and a clean heading hierarchy.
- All interactive controls must be keyboard reachable and visibly focusable.
- Provide meaningful alt text for content images and empty alt text for purely decorative assets.
- Maintain contrast suitable for WCAG AA.
- Respect `prefers-reduced-motion` and provide non-motion equivalents.
- Use buttons for actions and links for navigation.
- Do not hide critical content behind hover-only interactions.

## Responsive Design Rules

Design mobile-first and verify desktop, tablet, and mobile layouts. Navigation must collapse cleanly. Product mockups must remain legible and not overflow on small screens. Section spacing should compress on mobile without losing hierarchy. Use stable dimensions, grids, and aspect ratios for workflow diagrams, integration matrices, and UI mockups so dynamic content cannot shift the layout.

## PixeSci Messaging Rules

Always preserve the core positioning:

- PixeSci connects and automates scientific software.
- Users can tell PixeSci what they want to do in their own words, review the steps, and run the workflow.
- PixeSci runs locally or within customer-controlled infrastructure; it is not a cloud-only agent.
- PixeSci tracks actions, files, settings, decisions, reviews, and results throughout scientific work.
- PixeSci helps teams replace manual handoffs with reusable workflows that are easier to repeat and review.
- PixeSci speaks to high-control scientific environments: regulated life sciences, pharma, biotech, CROs, CDMOs, core facilities, national labs, and secure R&D.

Lead with what PixeSci does, not its technical category. Prefer short subject-verb-object sentences and common words. For example: `PixeSci connects and automates scientific software.` Follow with the user outcome.

Replace abstract wording when a simpler phrase is accurate:

- `orchestration layer` → `connects and runs work across tools`
- `execution evidence` → `run records`
- `artifacts` → `files` or `results`
- `capability-aware` → `based on what each tool can do`
- `operational constraints` → `rules` or `limits`
- `traceability` → `track the work` when the formal term is not required

Keep established scientific and regulatory terms such as ALCOA, audit trail, checksum, OOS/OOR, LIMS, ELN, and air-gapped when precision requires them, but explain them with plain surrounding language.

Do not reduce PixeSci to generic AI chat. Plain-language or voice control is an interface into the workflow system; the product connects scientific tools, runs workflows, and tracks the work.

## Compliance Messaging Rules

Be precise. PixeSci can be described as helping teams track work, produce records for review, maintain audit trails, repeat workflow runs, and operate locally or on-premises. Avoid implying that using PixeSci automatically makes a customer compliant. State clearly that customers remain responsible for validation, configuration, SOPs, training, and operation within their quality system.

## Analytics And Privacy Rules

- The site uses Vercel Web Analytics and Speed Insights and records demo-booking conversion events.
- The public marketing site has no self-service account registration, file upload, contact form, or first-party marketing-cookie feature. The repository does include gated download access and a customer organization portal with session cookies and local auth.
- Do not add a cookie banner when the site does not set optional cookies. Add consent controls only if a future integration introduces non-essential cookies or storage that requires consent.
- Keep `src/app/(site)/privacy/page.tsx` aligned with the measurement tools, external services, and data flows actually used by the site.
- Demo booking is handled by Cal.com in a new browser tab. Do not embed the calendar or add a contact-form backend unless the user explicitly requests it.

## Verification

Before finishing implementation work, run the available checks:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

For visual work, start the dev server and inspect desktop and mobile breakpoints. Fix visible overlap, clipping, unreadable contrast, awkward spacing, and blank visual states before handing off.

Also verify that public visuals do not reveal private product architecture or internal implementation details.
