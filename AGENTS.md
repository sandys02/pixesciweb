<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# PixeSci Website Agent Guide

## Project Purpose

This repository is the public marketing website for PixeSci, a local-first scientific workflow orchestration platform for high-control scientific environments. The website must communicate PixeSci as serious infrastructure for scientific software integration, reproducible workflow execution, auditability, and local/on-prem deployment. It is not a generic AI SaaS landing page and must not drift into vague automation copy.

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

## Styling Principles

- Build a crisp, conversion-focused marketing site with restrained premium surfaces.
- Prefer strong typography, exact spacing, thin borders, subtle shadows, and purposeful product visuals.
- Use cards only for repeated items, proof modules, comparisons, and framed product mockups. Do not nest cards inside cards.
- Keep border radii restrained, generally 6-10px unless a specific primitive requires otherwise.
- Use gradients sparingly as depth or highlight, not as the main brand identity.
- Avoid decorative orbs, bokeh blobs, and generic abstract SaaS backgrounds.
- Use real product-inspired visuals: workflow graphs, audit timelines, software catalog grids, local runtime diagrams, compliance record views, and integration pipelines.
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

- PixeSci is integration, automation, and compliance infrastructure for fragmented scientific software.
- PixeSci is a local-first orchestration and execution layer, not a cloud-only agent.
- PixeSci helps teams turn manual multi-tool scientific work into reusable, traceable workflows.
- PixeSci supports reproducibility through graph-native workflows, variables, execution events, run history, audit records, and review checkpoints.
- PixeSci speaks to high-control scientific environments: regulated life sciences, pharma, biotech, CROs, CDMOs, core facilities, national labs, and secure R&D.

Do not reduce PixeSci to generic AI chat. Chat is one interface into the workflow system; the core product is the orchestration layer across scientific tools.

## Compliance Messaging Rules

Be precise. PixeSci can be described as helping teams produce traceable execution records, audit trails, reproducible workflow runs, local/on-prem deployment, and compliance-supporting evidence. Avoid implying that using PixeSci automatically makes a customer compliant. Use language such as `supports`, `helps`, `designed for`, `built around`, and `compliance-ready workflows` rather than unsupported certification claims.

## Verification

Before finishing implementation work, run the available checks:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

For visual work, start the dev server and inspect desktop and mobile breakpoints. Fix visible overlap, clipping, unreadable contrast, awkward spacing, and blank visual states before handing off.
