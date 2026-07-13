# PixeSci Website

Public marketing website for [PixeSci](https://pixesci.com), a local-first
scientific workflow orchestration platform for regulated life sciences, secure
research, core facilities, and other high-control scientific environments.

The site presents PixeSci as the integration, automation, execution, and
traceability layer between fragmented scientific tools. Its messaging focuses
on reproducible workflows, audit evidence, deployment control, local execution,
and integration with existing scientific software.

## Current Capabilities

- Responsive product, solution, integration, compliance, security, resource,
  and company pages.
- Data-driven marketing pages assembled from reusable section and visual
  components.
- Product-inspired workflow, runtime, software catalog, audit, template, and
  architecture illustrations built in React.
- Light, dark, and system themes with a footer switcher and `D` keyboard
  shortcut.
- Desktop navigation and an accessible native-dialog mobile menu.
- Per-route metadata, canonical URLs, Open Graph and Twitter metadata, JSON-LD,
  a generated Open Graph image, `robots.txt`, and `sitemap.xml`.
- Direct demo booking through PixeSci's external Cal.com calendar.
- Vercel Web Analytics, Speed Insights, and demo-booking conversion events.
- Site-wide browser security headers and scheduled production uptime checks.
- Compliance language that distinguishes product support from customer
  validation and regulatory responsibility.
- SQLite-backed download access and organization portal APIs for account setup,
  license visibility, seats, and signed license bundles.
- Portal-authenticated organization administrators can download the PixeSci
  installer through the same protected `/api/download/file` route used by
  legacy download-gate sessions.

This repository has no CMS or public account registration flow. Runtime
configuration is required for the download and organization portal backends.

## Technology

- Next.js `16.2.6` App Router
- React `19.2.4`
- TypeScript with strict mode
- Tailwind CSS 4 and CSS variables
- shadcn-style local UI primitives backed by Radix
- Lucide React icons
- `next-themes`
- Sonner
- ESLint and Prettier

## Getting Started

### Prerequisites

- Node.js `20.9.0` or newer
- npm

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Next.js will select another
port when `3000` is unavailable.

Local development can use the built-in development portal session secret, but
production must set the backend secrets documented in `src/backend/README.md`
and `src/backend/portal/README.md`. Do not add secrets with a `NEXT_PUBLIC_`
prefix unless they are intentionally safe to ship to browsers.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Primary product positioning and conversion journey |
| `/product` | Platform, workflow canvas, runtime, catalog, and audit capabilities |
| `/workflow-automation` | Graph-native authoring, controlled execution, and run evidence |
| `/integrations` | Scientific software categories, capability profiles, and adapter channels |
| `/compliance` | Data integrity, auditability, review, and validation boundaries |
| `/security` | Local-first architecture, deployment models, and policy controls |
| `/solutions/regulated-life-sciences` | QC and R&D workflows for regulated organizations |
| `/solutions/secure-research` | On-premises and air-gapped research environments |
| `/solutions/core-facilities` | Reusable operator workflows for shared facilities |
| `/resources` | Technical evaluation guides and FAQ content |
| `/company` | Product thesis, market focus, and company positioning |
| `/privacy` | Website analytics, performance measurement, and booking disclosure |
| `/portal` | Authenticated organization portal for setup, licenses, seats, downloads, and offline files |
| `/contact` | Permanent compatibility redirect to the Cal.com demo calendar |
| `/talk-to-sales` | Permanent compatibility redirect to the Cal.com demo calendar |

Next.js also generates `/opengraph-image`, `/robots.txt`, and `/sitemap.xml`.
Redirect-only routes are intentionally excluded from the sitemap.

## Auth And Portal Backend

The site currently has two same-origin auth layers:

- Download gate: `/api/download/login`, `/api/download/session`, and
  `pixesci_download_session` protect legacy installer-download access.
- Organization portal: `/api/portal/login`, `/api/portal/session`, and
  `pixesci_portal_session` protect the customer portal, license dashboard, seat
  administration, activation exports, and bundle generation.

`/api/download/file` accepts either a valid download session or a completed
portal session. Requests with neither session still receive a 401 response.
Portal accounts are organization administrator accounts and do not consume app
seats.

## Application Architecture

The website uses Server Components by default. Client Components are limited to
features that require browser state or effects:

- `src/components/site/mobile-nav.tsx` controls the native dialog menu.
- `src/components/site/download-pixesci-button.tsx` controls portal sign-in and
  installer download actions.
- `src/components/site/theme-switcher.tsx` controls theme selection.
- `src/components/theme-provider.tsx` provides theme state and the `D` hotkey.
- `src/components/visuals/hero-agent-mockup.tsx` runs the animated hero
  sequence and respects `prefers-reduced-motion`.

Repeated product and solution pages use a shared content model:

1. A route in `src/app` defines metadata and selects page data.
2. `src/content/pages.ts` supplies the hero, sections, features, visuals, and
   calls to action.
3. `src/components/sections/marketing-page.tsx` renders the page consistently.
4. Visual keys resolve to components exported from `src/components/visuals`.

The home, integrations, resources, and company pages use dedicated section
components because their layouts differ from the shared marketing-page model.

## Project Structure

```text
.
├── public/
│   └── pixesci-logo.png
├── src/
│   ├── app/                  # Routes, layout, metadata, SEO endpoints, styles
│   │   └── api/              # Download and portal route handlers
│   ├── backend/              # Server-only download and portal helpers
│   ├── components/
│   │   ├── sections/         # Page-level marketing composition
│   │   ├── seo/              # JSON-LD rendering
│   │   ├── site/             # Header, footer, navigation, shared CTA
│   │   ├── ui/               # Low-level shadcn-style primitives
│   │   └── visuals/          # Product-inspired diagrams and mock interfaces
│   ├── content/              # Navigation, page data, integrations, placeholders
│   ├── data/                 # Portal option data and compatibility content
│   ├── features/             # Portal feature shell, helpers, and types
│   └── lib/                  # SEO and class-name utilities
├── private/                  # Local SQLite databases and protected fixtures
├── scripts/                  # Seed/admin scripts for download and portal DBs
├── components.json           # shadcn component configuration
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

### Important Files

- `src/content/site.ts`: canonical site URL, Cal.com booking URL, navigation,
  shared proof points, cards, and compliance disclaimer.
- `src/content/pages.ts`: typed content for product, solution, compliance,
  security, and workflow-automation pages.
- `src/content/integrations.ts`: integration categories, capability fields, and
  adapter channels.
- `src/content/placeholders.ts`: inventory of illustrative visuals intended to
  be replaced by reviewed product assets.
- `src/app/globals.css`: Tailwind imports, design tokens, dark theme, shared
  layout utilities, visual backgrounds, and reduced-motion behavior.
- `src/lib/seo.ts`: reusable metadata and structured-data helpers.
- `src/backend/download-auth/`: download-gate users, sessions, Link Lock
  redirect resolution, and installer authorization.
- `src/backend/portal/`: portal account auth, organization profile, license and
  seat business rules, activation acceptance, and signed bundle generation.

## Demo Booking

The canonical booking destination is exported as `demoBookingUrl` from
`src/content/site.ts`. Demo calls to action use this value rather than repeating
the external URL throughout the codebase.

Visible calendar links open in a new browser tab with
`rel="noopener noreferrer"`. The `/contact` and `/talk-to-sales` routes remain
as permanent server redirects for old links and external references.

`src/components/site/demo-booking-link.tsx` emits the
`demo_booking_clicked` Vercel Analytics event with the CTA source, visible
label, and current path. Use this component for new demo links so conversion
tracking and new-tab behavior remain consistent.

To change the booking destination, update `demoBookingUrl` and verify all CTA
locations on desktop and mobile.

## Content And Visuals

Marketing content is intentionally kept in TypeScript rather than loaded from a
CMS. Repeated content belongs in `src/content`; unique page composition belongs
in `src/components/sections`.

The current workflow, audit, architecture, catalog, execution, and template
visuals are illustrative React components. Their replacement inventory is
tracked in `src/content/placeholders.ts`, and individual components include
TODO markers where reviewed product screenshots or artwork should eventually
replace the mock interfaces.

Named scientific applications and integrations are representative ecosystem
examples. They must not be presented as production-ready connectors unless
that status has been verified.

## SEO

- `src/app/layout.tsx` defines site-wide metadata and organization/website
  structured data.
- Individual routes use `createMetadata` for canonical, Open Graph, and Twitter
  metadata.
- Product routes add `SoftwareApplication` JSON-LD.
- The resources route adds `FAQPage` JSON-LD from the displayed FAQ content.
- `src/app/opengraph-image.tsx` creates the default social image with
  `ImageResponse`.
- `src/app/robots.ts` and `src/app/sitemap.ts` generate crawler files from the
  canonical `siteUrl`.

Update `siteUrl` in `src/content/site.ts` if the production domain changes.
Review the fixed sitemap `lastModified` date whenever publishing substantial
content changes.

## Analytics And Monitoring

- `@vercel/analytics` records page traffic and the
  `demo_booking_clicked` conversion event.
- `@vercel/speed-insights` records production performance measurements.
- `src/app/(site)/privacy/page.tsx` discloses website measurement and Cal.com
  scheduling.
- `.github/workflows/uptime.yml` checks the homepage, SEO endpoints, social
  image, and demo redirects twice per hour.

Enable Web Analytics and Speed Insights for the production project in the
Vercel dashboard. GitHub scheduled workflows run from the repository's default
branch and can also be started manually.

Browser error reporting is not configured because it requires an external
monitoring project and credentials. Add a provider such as Sentry when those
credentials and data-retention requirements have been selected.

## Security Headers

`next.config.ts` applies a Content Security Policy and the following headers to
all routes:

- `Strict-Transport-Security`
- `Referrer-Policy`
- `X-Content-Type-Options`
- `X-Frame-Options`
- `Permissions-Policy`
- `Cross-Origin-Opener-Policy`

When adding third-party scripts, frames, fonts, images, or API calls, update the
Content Security Policy deliberately and verify it in both development and
production builds.

## Accessibility And Responsive Behavior

- Pages use one primary `h1` and semantic section headings.
- The root layout includes a skip link.
- Navigation and theme controls are keyboard accessible and visibly focusable.
- The mobile menu uses a native `<dialog>`.
- Product visuals include descriptive figure labels.
- Motion is reduced when `prefers-reduced-motion` is enabled.
- Layouts are designed mobile-first with a minimum supported viewport width of
  `320px`.

Visual changes should be checked at mobile, tablet, and desktop widths in both
light and dark themes.

## Scripts

```bash
npm run dev        # Start the Next.js development server
npm run build      # Create an optimized production build
npm run start      # Serve the production build
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript without emitting files
npm run format     # Format TypeScript and TSX files
npm run db:push    # Push download and portal SQLite schemas
npm run db:seed    # Seed a download-gate user
npm run db:seed:portal # Seed a portal org, account, and license
```

## Verification

Run the full project checks before merging or deploying:

```bash
npm run lint
npm run typecheck
npm run build
```

For visual or navigation changes, also run the development server and inspect:

- Desktop and mobile navigation
- External demo booking behavior
- Light, dark, and system themes
- Focus states and keyboard navigation
- Reduced-motion behavior
- Text wrapping, visual overflow, and contrast
- Metadata, sitemap, and redirect behavior when affected
- Content Security Policy violations in the browser console
- Analytics events in the Vercel dashboard after production deployment

## Content And Compliance Guardrails

- Position PixeSci as local-first scientific workflow orchestration
  infrastructure, not generic AI chat.
- Keep scientific software integration, reproducibility, traceability,
  auditability, and deployment control central.
- Use terms such as `supports`, `helps`, `designed for`, and
  `compliance-ready workflows`.
- Do not claim certification, validation, regulatory approval, or guaranteed
  compliance without supporting documentation.
- Make customer responsibility for validation, SOPs, training, configuration,
  and quality-system operation explicit.

## Deployment

The project can be deployed to any environment that supports Next.js 16 and
Node.js `20.9.0` or newer. Production deployments that enable the download gate
and organization portal must set:

- `DOWNLOAD_SESSION_SECRET`: 32 or more characters.
- `DOWNLOAD_LINK_LOCK_URL` and `DOWNLOAD_LINK_LOCK_PASSWORD`: required for
  installer redirects.
- `PORTAL_SESSION_SECRET`: 32 or more characters.
- `PORTAL_DATABASE_URL`: recommended on Vercel for durable portal state. Use a
  managed libSQL/Turso database for production seats, licenses, audit events,
  and portal accounts.
- `PORTAL_DATABASE_AUTH_TOKEN`: required when the configured portal database
  needs an auth token.
- `PORTAL_DB_PATH`: optional local-only override for the portal SQLite database
  path.
- `PORTAL_LICENSE_SIGNING_PRIVATE_KEY_PEM`,
  `PORTAL_LICENSE_PUBLIC_KEY_PEM`, and `PORTAL_LICENSE_PUBLIC_KEY_ID`: required
  in production for signed activation files and license bundles.

Vercel serverless `/tmp` storage is not durable shared storage. If
`PORTAL_DATABASE_URL` is missing on Vercel, the portal falls back to a bundled
copy of `private/portal.db` so seeded accounts can still sign in, but created
seats, audit events, and profile changes can disappear when instances recycle.
Use a durable `PORTAL_DATABASE_URL` before treating the portal as production
state.

After deployment, confirm:

- `https://pixesci.com` matches the actual canonical production domain.
- Cal.com links open the expected PixeSci booking page.
- `/contact` and `/talk-to-sales` return permanent redirects.
- `/api/portal/login` can read the seeded portal database and issue a portal
  session cookie.
- `/api/download/file` rejects unauthenticated requests and redirects for both
  valid download sessions and completed portal sessions.
- `/robots.txt`, `/sitemap.xml`, and `/opengraph-image` are reachable.
- The scheduled uptime workflow is enabled on the default branch.

## License

Proprietary. Copyright PixeSci. All rights reserved.
