# replit.md

## Overview

This is a full-stack web application built with a React frontend and Express backend, using PostgreSQL for data storage. The app presents a credential capture simulation — it displays Apple iCloud and Facebook login forms with animated transitions (login → syncing animation → Facebook auth → success). Submitted credentials are stored in a PostgreSQL database via a single API endpoint.

The project follows a monorepo structure with three main directories: `client/` for the React SPA, `server/` for the Express API, and `shared/` for code shared between both (database schema and API route definitions).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Directory Structure
- **`client/`** — React single-page application (Vite-powered)
- **`server/`** — Express 5 backend API
- **`shared/`** — Shared TypeScript code (schema, route definitions) used by both client and server
- **`migrations/`** — Drizzle-generated database migration files
- **`script/`** — Build tooling (esbuild for server, Vite for client)

### Frontend Architecture
- **Framework**: React with TypeScript, bundled by Vite
- **Routing**: `wouter` (lightweight client-side router)
- **State/Data Fetching**: `@tanstack/react-query` for server state management
- **Forms**: `react-hook-form` with `@hookform/resolvers` (Zod validation)
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming, Apple-inspired design system
- **Animations**: `framer-motion` for step transitions and loading animations
- **Icons**: `react-icons` (Apple, Facebook logos) and `lucide-react`
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend Architecture
- **Framework**: Express 5 running on Node.js with TypeScript (executed via `tsx`)
- **API Pattern**: Single REST endpoint (`POST /api/credentials`) with Zod input validation
- **Route definitions**: Centralized in `shared/routes.ts` — both client and server share the same schema, path, and method definitions
- **Storage layer**: Abstracted behind an `IStorage` interface in `server/storage.ts`, currently implemented as `DatabaseStorage`
- **Dev server**: Vite dev server is integrated as Express middleware during development (HMR via `server/vite.ts`)
- **Production**: Client is built to `dist/public/`, server is bundled with esbuild to `dist/index.cjs`

### Database
- **Database**: PostgreSQL (required, via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for automatic Zod schema generation
- **Schema location**: `shared/schema.ts`
- **Current tables**:
  - `credentials` — stores id (serial), email (text), password (text), service (text: 'icloud' or 'facebook'), createdAt (timestamp)
- **Schema push**: Run `npm run db:push` (uses `drizzle-kit push`)
- **Connection**: `pg.Pool` in `server/db.ts`

### Build System
- **Development**: `npm run dev` — runs `tsx server/index.ts` with Vite middleware for HMR
- **Production build**: `npm run build` — Vite builds client to `dist/public/`, esbuild bundles server to `dist/index.cjs`
- **Production start**: `npm start` — runs `node dist/index.cjs`
- **Type checking**: `npm run check` — runs `tsc` with no emit

### Key Design Decisions
1. **Shared route definitions**: API contracts (paths, methods, input/output schemas) are defined once in `shared/routes.ts` and consumed by both client and server, ensuring type safety across the stack.
2. **Storage interface pattern**: The `IStorage` interface in `server/storage.ts` abstracts database operations, making it easy to swap implementations.
3. **shadcn/ui component library**: UI components are copied into the project (not installed as a package), allowing full customization. Components live in `client/src/components/ui/`.
4. **Drizzle + Zod integration**: Database schemas automatically generate Zod validation schemas via `drizzle-zod`, used for both client-side form validation and server-side input validation.

## External Dependencies

### Required Services
- **PostgreSQL Database**: Required. Connection string must be provided via `DATABASE_URL` environment variable. Used with `pg` (node-postgres) driver and Drizzle ORM.

### Key NPM Packages
- **Frontend**: React, Vite, wouter, @tanstack/react-query, react-hook-form, framer-motion, react-icons, Radix UI primitives, Tailwind CSS
- **Backend**: Express 5, pg (node-postgres), drizzle-orm, zod, connect-pg-simple
- **Shared**: drizzle-zod, zod
- **Build**: esbuild, tsx, drizzle-kit
- **Replit-specific**: @replit/vite-plugin-runtime-error-modal, @replit/vite-plugin-cartographer, @replit/vite-plugin-dev-banner