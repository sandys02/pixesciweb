# PixeSci Website

Official marketing website for **PixeSci** — a local-first scientific workflow orchestration platform that connects fragmented scientific software into traceable, reproducible, and compliance-ready workflows.

## About

PixeSci helps scientific organizations automate, orchestrate, and monitor workflows across disconnected software tools while maintaining complete execution traceability.

The website serves as the primary public-facing platform for:

- Product marketing
- Feature showcases
- Scientific workflow demonstrations
- Customer education
- Compliance messaging
- Lead generation
- Demo requests

## Technology Stack

### Framework

- Next.js 16
- React 19
- TypeScript

### Styling & UI

- Tailwind CSS v4
- shadcn/ui
- Radix UI
- Lucide React
- next-themes
- class-variance-authority
- tailwind-merge

### Communication

- Resend
- React Email

### Tooling

- ESLint
- Prettier
- TypeScript

## Getting Started

### Prerequisites

- Node.js 22+
- npm (or pnpm, yarn, bun)

### Installation

```bash
git clone <repository-url>

cd pixesci-website

npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Available Scripts

### Start Development Server

```bash
npm run dev
```

Starts the Next.js development server.

### Create Production Build

```bash
npm run build
```

Creates an optimized production build.

### Start Production Server

```bash
npm run start
```

Runs the production build locally.

### Run ESLint

```bash
npm run lint
```

### Format Code

```bash
npm run format
```

### Type Check

```bash
npm run typecheck
```

## Project Structure

```text
pixesci-website/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   └── emails/
├── docs/
├── package.json
├── tsconfig.json
└── README.md
```

## Design Principles

The website is inspired by:

- Vercel
- ElevenLabs
- Sunburst AI
- Linear
- Stripe

Core design principles:

- Premium visual design
- Scientific professionalism
- Enterprise credibility
- Accessibility-first
- Responsive by default
- Performance-focused

## Contributing

Before submitting changes:

1. Run linting:

   ```bash
   npm run lint
   ```

2. Run type checking:

   ```bash
   npm run typecheck
   ```

3. Verify the production build:

   ```bash
   npm run build
   ```

## License

**Proprietary © PixeSci**

All rights reserved.

This repository contains proprietary software and assets owned by PixeSci.