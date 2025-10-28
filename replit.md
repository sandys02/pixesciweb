# PixeSci Marketing Landing Page

## Overview

PixeSci is a marketing-focused single-page application designed to capture user interest and waitlist signups for an AI-powered platform that automates scientific software through natural language commands. The application primarily targets biotech and pharma researchers (R&D scientists, bioinformatics leads) with secondary focus on academic researchers (PhD students, postdocs, lab managers) who struggle with complex scientific software interfaces.

The landing page showcases the product's value proposition through multiple sections: hero, problem statement, interactive demo, tool integration showcase, user stories, features, early access benefits, waitlist form, FAQs, and footer. The primary conversion goal is waitlist signup collection.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server for fast hot module replacement
- Wouter for client-side routing (lightweight React Router alternative)
- TanStack Query (React Query) for server state management and API interactions

**UI Framework:**
- Shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design system
- Framer Motion for declarative animations and transitions
- React Hook Form with Zod for form validation and schema management

**Design System:**
- Custom color palette focused on scientific aesthetics (deep blue primary, cyan secondary, electric blue accent)
- Neutral base colors with semantic tokens for light/dark mode support
- Inter font family from Google Fonts
- Consistent spacing scale using Tailwind's units (4, 8, 12, 16, 20, 32)
- Shadow system with elevation states for interactive elements

**Component Structure:**
- Page-level components in `client/src/pages/`
- Reusable section components in `client/src/components/` (HeroSection, ProblemSection, DemoSection, etc.)
- Shadcn UI primitives in `client/src/components/ui/`
- Example components for development/testing in `client/src/components/examples/`

**State Management:**
- TanStack Query for server state (API requests, caching, refetching)
- React Hook Form for form state management
- Local component state with useState for UI interactions
- Toast notifications via custom hook pattern

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript for the HTTP server
- Custom Vite middleware integration for development hot reloading
- RESTful API design pattern

**API Endpoints:**
- `POST /api/waitlist` - Create new waitlist signup
- `GET /api/waitlist` - Retrieve all waitlist signups (admin functionality)

**Storage Layer:**
- In-memory storage implementation (`MemStorage` class) for development
- Interface-based storage abstraction (`IStorage`) allowing easy swap to database
- Designed for eventual PostgreSQL integration via Drizzle ORM

**Request/Response Flow:**
- Express middleware for JSON body parsing with raw body capture
- Request logging middleware tracking API response times and payloads
- Zod schema validation on incoming requests
- Structured error responses with HTTP status codes

### Data Layer

**Schema Design (Drizzle ORM):**

Database tables defined in `shared/schema.ts`:

1. **users table** - Basic authentication structure (currently unused in marketing page)
   - Fields: id (UUID), username (unique), password
   
2. **waitlist_signups table** - Core data model for lead capture
   - Fields: id (UUID), email, name, institution (optional), researchArea, software (array), challenge (optional), createdAt (timestamp)

**Validation:**
- Zod schemas derived from Drizzle table definitions using `drizzle-zod`
- Client and server share validation schemas via `@shared` alias
- Type safety through TypeScript inference from schemas

**Database Configuration:**
- PostgreSQL dialect configured in `drizzle.config.ts`
- Connection via `@neondatabase/serverless` driver
- Environment variable for `DATABASE_URL`
- Migrations directory: `./migrations`

### Build & Deployment

**Development Mode:**
- Vite dev server with HMR for frontend
- tsx for running TypeScript server code directly
- Concurrent frontend/backend development on single port

**Production Build:**
- Frontend: Vite builds to `dist/public`
- Backend: esbuild bundles server code to `dist/index.js`
- ESM module format throughout
- Assets resolved via path aliases

**Path Aliases:**
- `@/*` → `client/src/*` (frontend code)
- `@shared/*` → `shared/*` (shared types/schemas)
- `@assets/*` → `attached_assets/*` (images/static files)

## External Dependencies

**UI Component Libraries:**
- Radix UI primitives (20+ packages) for accessible, unstyled component foundations
- Shadcn/ui as the composed component system
- Lucide React for icon components
- Embla Carousel for testimonial/content carousels

**Form Management:**
- React Hook Form for form state and validation
- @hookform/resolvers for Zod integration
- Zod for runtime type validation and schema definition

**Animation:**
- Framer Motion for page transitions, hover effects, scroll animations, and interactive states

**Data Fetching:**
- TanStack Query v5 for server state, caching, and background refetching

**Styling:**
- Tailwind CSS v3+ with PostCSS and Autoprefixer
- class-variance-authority (cva) for variant-based component styling
- clsx and tailwind-merge for conditional class composition

**Database & ORM:**
- Drizzle ORM for type-safe database queries and schema management
- drizzle-kit for migrations and schema push commands
- @neondatabase/serverless for PostgreSQL connectivity (Neon serverless driver)
- connect-pg-simple for session storage (configured but not actively used)

**Development Tools:**
- Replit-specific plugins: vite-plugin-runtime-error-modal, vite-plugin-cartographer, vite-plugin-dev-banner
- TypeScript for type checking
- ESBuild for server bundling

**Utilities:**
- date-fns for date manipulation
- nanoid for ID generation (used in server utilities)

**Note on Database:**
The application is configured for PostgreSQL via Drizzle ORM but currently uses in-memory storage for the waitlist. The schema and configuration are ready for database integration - simply provision a PostgreSQL database and set the `DATABASE_URL` environment variable to activate persistence.