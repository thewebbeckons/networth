# CLAUDE.md

This file provides guidance for Claude Code when working with this codebase.

## Project Overview

**Worths** is a privacy-focused net worth tracking web application. All data is stored locally in the browser using IndexedDB (via Dexie.js) - there is no backend server.

## Tech Stack

- **Framework**: Nuxt 4 with Vue 3 and TypeScript
- **UI**: Nuxt UI v4
- **Database**: Dexie.js (IndexedDB wrapper) - browser-local storage
- **Validation**: Zod
- **Charts**: Unovis
- **PWA**: @vite-pwa/nuxt

## Common Commands

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm lint         # Run ESLint
pnpm typecheck    # TypeScript type checking
```

## Project Structure

```
app/
├── components/       # Vue components (dashboard/, forms, charts)
├── composables/      # Composition functions (useDatabase, useNetWorth)
├── pages/            # Route-based pages (accounts/, settings/)
├── plugins/          # Nuxt plugins (db.client.ts - database init)
├── types/            # TypeScript types (db.ts - schema definitions)
└── layouts/          # Page layouts
```

## Key Architecture Patterns

### Database (Dexie/IndexedDB)
- Schema defined in `app/types/db.ts`
- Database initialized in `app/plugins/db.client.ts`
- Primary API in `app/composables/useDatabase.ts`
- Current schema version: 6

### Main Entities
- **Accounts**: Financial accounts with category, owner, type (asset/liability)
- **Balances**: Historical balance records per account
- **Categories**: Asset/liability categories
- **Profile**: User profile with owner names/colors
- **Monthly Snapshots**: Pre-calculated monthly totals

### Owner Model
Three-tier system: `"me"`, `"spouse"`, `"joint"`

## Code Conventions

- **Indentation**: 2 spaces
- **Script syntax**: Vue 3 `<script setup>` with TypeScript
- **State**: Use `ref()`, `computed()`, `reactive()` from Vue
- **SSR disabled**: This is a client-side SPA (`ssr: false` in nuxt.config)
- **Client-only guards**: Use `if (import.meta.server) return` when needed

## Important Notes

- No backend/API calls - all data is browser-local
- Database operations should use Dexie transactions for consistency
- Snapshots are regenerated on data changes (see `regenerateAllSnapshots`)
- Forms use Zod schemas for validation
