---
phase: 01-foundation-and-static-shell
plan: 01
subsystem: infra
tags: [astro, tailwind, vercel, typescript, vite, css]

# Dependency graph
requires: []
provides:
  - Astro 5.17 project scaffold with zero-error static build
  - Tailwind v4 CSS-first configuration via @theme with brand color #0D9488
  - Vercel static adapter configured for deployment
  - TypeScript strict mode active
  - Self-hosted Inter Variable font installed
  - Cloudinary image domain allowlisted in astro.config
affects:
  - 01-02 (BaseLayout, Nav, Hero consume global.css and astro config)
  - 01-03 (deployment uses Vercel adapter configured here)
  - all subsequent plans (depend on this build infrastructure)

# Tech tracking
tech-stack:
  added:
    - astro@5.17.1
    - "@tailwindcss/vite@4.1.18"
    - tailwindcss@4.1.18
    - "@astrojs/vercel@9.0.4"
    - "@fontsource-variable/inter@5.2.8"
  patterns:
    - Tailwind v4 CSS-first configuration (no tailwind.config.js)
    - "@theme directive for design tokens in global.css"
    - Static output with Vercel adapter (output: 'static')
    - "@tailwindcss/vite plugin (not deprecated @astrojs/tailwind)"

key-files:
  created:
    - astro.config.mjs
    - package.json
    - tsconfig.json
    - src/styles/global.css
    - public/favicon.svg
    - public/robots.txt
    - .gitignore
  modified: []

key-decisions:
  - "Used @tailwindcss/vite (v4) not @astrojs/tailwind (deprecated for v4)"
  - "Defined --color-brand: #0D9488 explicitly in @theme because Tailwind v4 changed teal-600 to OKLCH (~#009689)"
  - "Set output: 'static' in astro.config.mjs to prevent Vercel treating site as serverless"
  - "Import vercel from '@astrojs/vercel' not '@astrojs/vercel/static' (subpath removed in v8+)"
  - "Self-hosted Inter via @fontsource-variable/inter to eliminate external Google Fonts request"

patterns-established:
  - "Pattern: Global CSS via src/styles/global.css with @import tailwindcss and @theme"
  - "Pattern: Tailwind utility classes use bg-brand/text-brand (not teal-600) for brand color"
  - "Pattern: astro.config.mjs as single source of truth for adapter, vite plugins, image domains"

requirements-completed: [FOUND-01]

# Metrics
duration: 8min
completed: 2026-02-17
---

# Phase 1 Plan 01: Scaffold Astro 5 with Tailwind v4 and Vercel Static Adapter Summary

**Astro 5.17 static project with @tailwindcss/vite (v4 CSS-first), strict TypeScript, Vercel adapter, and brand color #0D9488 defined via @theme**

## Performance

- **Duration:** 8 min
- **Started:** 2026-02-17T06:27:29Z
- **Completed:** 2026-02-17T06:35:32Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments

- Astro 5.17 scaffolded in project root with minimal template; zero-error `npm run build` producing static `dist/` output
- Tailwind v4 installed via `@tailwindcss/vite` (not deprecated `@astrojs/tailwind`); CSS-first `@theme` block defines brand tokens
- Vercel static adapter configured with `output: 'static'`; Cloudinary domain allowlisted; TypeScript strict mode via `astro/tsconfigs/strict`

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold Astro 5 project with Tailwind v4 and Vercel adapter** - `857cddc` (feat)
2. **Task 2: Configure Tailwind v4 global CSS with brand theme** - `a6995fd` (feat)

**Plan metadata:** (docs commit below)

## Files Created/Modified

- `astro.config.mjs` - Static output, Vercel adapter, tailwindcss() vite plugin, Cloudinary domain
- `package.json` - Astro 5.17, @tailwindcss/vite, @astrojs/vercel, @fontsource-variable/inter dependencies
- `tsconfig.json` - Extends astro/tsconfigs/strict (TypeScript strict mode)
- `src/styles/global.css` - @import tailwindcss, @theme with brand colors and font families, base styles
- `src/pages/index.astro` - Minimal scaffold page (placeholder until Plan 02 builds full layout)
- `public/favicon.svg` - Quilting-themed SVG favicon with brand teal background
- `public/robots.txt` - Allow all crawlers
- `.gitignore` - node_modules, dist, .astro, .vercel, .env patterns

## Decisions Made

- Used `@tailwindcss/vite` not `@astrojs/tailwind` — the old integration is deprecated for Tailwind v4; `npx astro add tailwind` on Astro 5.2+ auto-selects the correct package
- Defined `--color-brand: #0D9488` explicitly in `@theme` — Tailwind v4 migrated colors to OKLCH; `teal-600` is now `#009689`, not the brand hex
- Set `output: 'static'` explicitly — without it, `@astrojs/vercel` defaults to server-side rendering (cold starts, potential 404s on direct URL access)
- Imported vercel from `'@astrojs/vercel'` not `'@astrojs/vercel/static'` — subpath exports removed in v8+
- Self-hosted Inter via `@fontsource-variable/inter` — eliminates external Google Fonts request; important for fast loads on rural connections

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Astro scaffold created subdirectory instead of using current directory**
- **Found during:** Task 1 (scaffold step)
- **Issue:** `npm create astro@latest -- . --template minimal --no-install --no-git --yes` created `./blue-bar/` instead of scaffolding to `.`; the `--yes` flag bypassed the interactive "directory not empty" prompt by picking a generated name
- **Fix:** Moved all scaffold files from `blue-bar/` to project root with `mv` commands, then removed empty `blue-bar/` directory
- **Files modified:** astro.config.mjs, package.json, tsconfig.json, src/, public/, README.md (all moved to root)
- **Verification:** Build succeeds from project root
- **Committed in:** 857cddc (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Directory move was purely mechanical — no architecture or behavior change. All files landed in correct locations.

## Issues Encountered

- `path-to-regexp` vulnerability (HIGH) flagged by `npm audit` in `@astrojs/vercel@9.0.4` → `@vercel/routing-utils` dependency. The "fix" would downgrade to a breaking change (`@astrojs/vercel@8.0.4`). Since this is a build-time/deploy-time tool and the vulnerability affects routing utilities (not static file serving or browser-side code), this is deferred. No fix applied.

## User Setup Required

None - no external service configuration required for this plan.

## Next Phase Readiness

- Build infrastructure fully established; `npm run build` produces zero-error static output
- `src/styles/global.css` is ready to be imported by BaseLayout (Plan 02)
- Brand tokens (`bg-brand`, `text-brand`, `border-brand`) available as Tailwind utility classes
- Vercel adapter ready for deployment configuration (Plan 03)
- `@fontsource-variable/inter` installed; needs to be imported in BaseLayout

---
*Phase: 01-foundation-and-static-shell*
*Completed: 2026-02-17*

## Self-Check: PASSED

- astro.config.mjs: FOUND
- src/styles/global.css: FOUND
- public/favicon.svg: FOUND
- public/robots.txt: FOUND
- Commit 857cddc: FOUND
- Commit a6995fd: FOUND
