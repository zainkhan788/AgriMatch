# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Mobile**: Expo (React Native) — AgriMatch app

## Artifacts

### AgriMatch (Mobile App — Expo)
- Path: `artifacts/agrimatch/`
- Preview path: `/`
- A smart agriculture platform for Pakistan farmers
- 5 tabs: Home, Soil Analyzer, Crop Matcher, Pest Detection, More
- Uses: AsyncStorage, expo-haptics, @expo/vector-icons (Feather), Inter fonts
- Color palette: Deep forest green (#1B4332) as primary
- Data: All hardcoded in `constants/data.ts` (no backend required)

### API Server (Express)
- Path: `artifacts/api-server/`
- Preview path: `/api`

### Canvas (Mockup Sandbox)
- Path: `artifacts/mockup-sandbox/`
- Preview path: `/__mockup`

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
