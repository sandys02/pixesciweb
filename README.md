# Pixesci Website

The public marketing website for [Pixesci](https://pixesci.com), a local-first
scientific workflow orchestration platform for regulated life sciences, secure
research, core facilities, and other high-control scientific environments.

The site positions Pixesci as integration, automation, and compliance
infrastructure for fragmented scientific software. It explains the product
architecture, workflow model, deployment options, auditability, integrations,
and evaluation paths without presenting Pixesci as a generic cloud AI product.

## What Is Included

- Responsive marketing pages for the product, solutions, integrations,
  compliance, security, resources, company, and demo-request journeys.
- Product-inspired workflow, execution, architecture, catalog, and audit
  visuals built as React components.
- Responsive desktop and mobile navigation with light and dark themes.
- Search-engine metadata, canonical URLs, Open Graph images, JSON-LD, a
  sitemap, and robots configuration.
- A Resend-backed request-demo form with server-side validation, a honeypot,
  reply-to handling, and visible pending, success, and error states.
- Accessible semantic structure, keyboard-focus treatment, a skip link, and
  reduced-motion-aware styling.

## Technology

- Next.js `16.2.6` with the App Router
- React `19.2.4`
- TypeScript
- Tailwind CSS 4
- Radix UI and shadcn-style local primitives
- Lucide React icons
- `next-themes`
- Resend and React Email rendering
- Sonner notifications
- ESLint and Prettier

## Routes

| Route                                | Purpose                                                  |
| ------------------------------------ | -------------------------------------------------------- |
| `/`                                  | Product positioning and primary marketing journey        |
| `/product`                           | Platform, runtime, catalog, and audit capabilities       |
| `/workflow-automation`               | Graph-native workflow authoring and execution            |
| `/integrations`                      | Scientific software capability and integration model     |
| `/compliance`                        | Traceability, review, data integrity, and audit evidence |
| `/security`                          | Local-first architecture and controlled deployment       |
| `/solutions/regulated-life-sciences` | Regulated life-sciences workflows                        |
| `/solutions/secure-research`         | Secure and controlled research environments              |
| `/solutions/core-facilities`         | Shared scientific facilities and operators               |
| `/resources`                         | Evaluation resources and technical FAQ                   |
| `/company`                           | Company purpose and positioning                          |
| `/contact`                           | Request-demo form                                        |
| `/talk-to-sales`                     | Permanent redirect to `/contact`                         |
| `/api/contact`                       | Server-side Resend submission endpoint                   |

The application also generates `/robots.txt`, `/sitemap.xml`, and
`/opengraph-image`.

## Getting Started

### Prerequisites

- Node.js 20.9 or newer
- npm

Install dependencies:

```bash
npm install
```

Create a repository-root `.env` file:

```dotenv
RESEND_API_KEY=re_your_api_key
RESEND_CONTACT_FROM="Pixesci Website <hello@pixesci.com>"
RESEND_CONTACT_TO=hello@pixesci.com
```

Environment files are ignored by Git. These values are server-only and must not
use the `NEXT_PUBLIC_` prefix.

Start development:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Next.js will select another
available port if port 3000 is occupied.

## Resend Configuration

The `/contact` form posts JSON to `/api/contact`. The route validates the
request, renders the demo-request email, and sends it through Resend. The
submitter's address is assigned as the email reply-to value.

Before production deployment:

1. Add and verify `pixesci.com` in Resend.
2. Configure the required DNS records.
3. Add the three Resend environment variables to the hosting environment.
4. Redeploy and verify a real form submission.

See [docs/RESEND_CONTACT_FORM.md](docs/RESEND_CONTACT_FORM.md) for account
creation, sandbox testing, production setup, operational behavior, and
remaining technical debt.

## Project Structure

```text
.
├── docs/
│   └── RESEND_CONTACT_FORM.md
├── public/
├── src/
│   ├── app/
│   │   ├── api/contact/route.ts
│   │   ├── solutions/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── opengraph-image.tsx
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── emails/
│   │   ├── sections/
│   │   ├── seo/
│   │   ├── site/
│   │   ├── ui/
│   │   └── visuals/
│   ├── content/
│   └── lib/
├── next.config.ts
├── package.json
└── tsconfig.json
```

### Main Boundaries

- `src/app`: routes, layouts, route handlers, metadata, and SEO files.
- `src/components/sections`: page-level marketing sections.
- `src/components/site`: shared header, footer, navigation, and CTA shell.
- `src/components/ui`: low-level reusable UI primitives.
- `src/components/visuals`: product and workflow illustrations.
- `src/components/emails`: server-rendered email content.
- `src/content`: navigation and reusable marketing data.
- `src/lib`: utilities and SEO helpers.

Server Components are the default. Client Components are used only where
browser state or event handling is required, such as theme controls, mobile
navigation, and form submission.

## Scripts

```bash
npm run dev        # Start the Next.js development server
npm run build      # Create an optimized production build
npm run start      # Serve the production build
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript without emitting files
npm run format     # Format TypeScript and TSX files
```

## Verification

Before merging or deploying changes, run:

```bash
npm run lint
npm run typecheck
npm run build
```

For visual changes, inspect desktop, tablet, and mobile layouts. Confirm that
navigation, product visuals, forms, focus states, contrast, and both color
themes remain usable.

For contact-form changes, submit a test request and confirm both an HTTP 200
response and successful delivery in the Resend logs.

## Content And Compliance Guardrails

- Describe Pixesci as a local-first orchestration and execution layer.
- Keep scientific workflow integration, reproducibility, traceability, and
  deployment control central to product messaging.
- Use compliance-supporting language such as `supports`, `helps`, and
  `designed for`.
- Do not claim certification, validation, regulatory approval, or guaranteed
  compliance without supporting documentation.
- Treat named integrations as capability or ecosystem examples unless their
  production readiness has been confirmed.

## Deployment

The project can be deployed to any platform that supports Next.js 16 and a Node
runtime for `/api/contact`. Production must provide the Resend environment
variables at runtime and allow outbound HTTPS requests to Resend.

The canonical site URL is configured as `https://pixesci.com` in
`src/content/site.ts`.

## License

Proprietary. Copyright Pixesci. All rights reserved.
