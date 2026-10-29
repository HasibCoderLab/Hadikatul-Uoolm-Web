# Architecture — HadiKatul Uloom ERP + LMS

**Status: PROVISIONAL.** `docs/LMS_FULL_PLAN.md` and `docs/HADIKATUL_MASTER_INSTRUCTION.md` were absent when this
was written (see `DESIGN_AUDIT.md` §0). Sections marked **[PROVISIONAL]** must be reconciled with the real plan before
Phase 2. Sections marked **[FIXED]** come from the session brief and are not open to interpretation.
What is actually implemented and verified is tracked in `docs/IMPLEMENTATION_STATUS.md`.

## 1. Shape [FIXED]

Modular monolith. One deployable Next.js app, one PostgreSQL database, modules separated by folder and enforced by
import discipline — no microservices, no separate services, no message broker in Phase 0/1.

- Runtime: Next.js 16.4.3 App Router, React 19.3.1, server components by default.
- Language: TypeScript 5.9.3, `strict` + `noUncheckedIndexedAccess` + `noImplicitOverride`.
- Styling: Tailwind v4.3.3 (CSS-first `@theme`), tokens in `src/styles/tokens.css`, shadcn/ui-style local primitives.
- Data: PostgreSQL + Prisma 7.10.1 (`prisma-client` generator) via `@prisma/adapter-pg`.
- Package manager: pnpm 12.11.2; dependencies pinned in `pnpm-lock.yaml`, security overrides in `pnpm-workspace.yaml`.
- Validation at every boundary: Zod (`src/lib/env.ts` for process env, module-level schemas for payloads).

```src/
  app/                 routes + pages; layout imports the single stylesheet
  components/
    ui/                shadcn-style primitives (button, card)
    site/              marketing sections ported from old/index.html
  content/site.ts      all marketing copy + real contact/map URLs (no literals in JSX)
  lib/
    env.ts             Zod-validated process env; lazy DATABASE_URL requirement
    db.ts              Prisma client singleton (driver adapter)
    utils.ts           cn()
    tenant/            authorization + tenant scoping (implemented, unit-tested)
  styles/tokens.css    audited raw tokens
  styles/globals.css   the single Tailwind @theme + base layer
  generated/prisma/    generated client (gitignored, rebuilt on install)
prisma/
  schema.prisma
  migrations/          generated SQL committed; NOT yet applied (no PostgreSQL)
  seed.ts              fake data only; NOT yet executed
prisma.config.ts       Prisma CLI config + seed command + local placeholder URL
e2e/                   Playwright specs (4 viewport projects, production server)
docs/                  audit, architecture, status
old/                   untouched legacy reference
```

Auth is deliberately absent: `src/lib/auth/` does not exist yet because no provider was chosen. The session boundary
is described in §4, not faked with a stub.

## 2. Tenancy [FIXED: "tenant boundary + server-side authz designed from day one"]

Three-level hierarchy, as named by the brief:

```
Institution  (the tenant — legal owner of the data)
  └── Campus (physical/site subdivision inside one institution)
        └── Membership (a User's role at one Institution, optionally pinned to a Campus)
User (global identity, may belong to many Institutions)
```

Rules that the schema enforces structurally, today, before any feature exists:

1. **Tenant key is `institutionId`, present on every tenant-owned table** (directly or via a NOT NULL FK chain).
   No tenant-owned row may exist without one.
2. **`User` is global, `Membership` is the join + role.** A user's authority is _never_ stored on `User`.
3. **`Membership` is unique per `(userId, institutionId)`** — one relationship per user per tenant; campus scoping is
   a nullable column on that membership, not a second membership.
4. **Authorization is resolved server-side** from `(sessionUserId, institutionId, action)` → role check. The client
   never sends a role or a tenant it is trusted with; the tenant is derived from the resolved host/session and every
   query is scoped by the helper, never by ad-hoc `where` clauses in a page.
5. **Cross-tenant reads are a bug, not a policy.** Any query path that can take an `id` from the client must
   re-filter by `institutionId` (IDOR defence).
6. **Roles [PROVISIONAL]**: `INSTITUTION_OWNER`, `ADMIN`, `PRINCIPAL`, `TEACHER`, `STUDENT`, `GUARDIAN`,
   `ACCOUNTANT`, `STAFF`. Enum, not free text, so a typo cannot escalate.

Every mutation in later phases: `requireMembership(institutionId, allowedRoles)` first, then the write, and the write
carries `institutionId` in the row itself as a second line of defence.

## 3. Data model — Phase 1 scope [FIXED entities, PROVISIONAL attributes]

Phase 1 ships exactly the four entities the brief names. Deliberately _not_ modelled yet: academic years, classes,
sections, subjects, enrolments, attendance, exams, fees, invoices, ledgers. Adding them before the plan is read would
be inventing the product.

**[UNVERIFIED — blocked on `LMS_FULL_PLAN.md` §8]** Which attributes beyond identity/tenant/role those four must carry,
and whether `Campus` belongs to `Institution` only or also to a `Branch` layer.

Money **[FIXED rule]**: integer minor units + ISO-4217 currency code. No `Float`/`Decimal`-for-money-as-float, no
`double`. Not yet used anywhere in Phase 1 — recorded as the rule for the first model that needs it (`Invoice`,
`Payment`) so it cannot be retro-fitted wrongly.

## 4. Authentication [PROVISIONAL — provider not chosen]

Not implemented in Phase 1. The brief forbids inventing provider credentials, so no auth SDK is wired until a provider
is chosen. The boundary is designed so auth slots in without reshaping data: a session yields `userId`, then
`Membership` resolution yields tenant + role. No auth cookie, secret or key is fabricated anywhere in this codebase.

`env.ts` therefore validates only what Phase 1 genuinely uses (`DATABASE_URL`, `NODE_ENV`) and keeps `DATABASE_URL`
optional so the static page can build without a database; `requireDatabaseUrl()` throws at first database access
instead. No auth secret is declared because none exists.

## 5. Internationalisation [FIXED: Bengali/English-friendly, RTL-safe]

- Locale tag `bn` (the legacy page's `lang="ban"` is invalid and is corrected).
- Type: `Baloo Da 2` (Bengali + Latin) retained from the audit as the brand family; system Bengali/Latin fallbacks
  declared so a blocked font request never degrades into tofu.
- **Direction-agnostic layout**: physical properties (`ml-`, `left-`, `pl-`) are avoided in favour of logical ones
  (`ms-`, `start-`, `ps-`). `dir` is set on `<html>` and components must not assume LTR. Bengali is LTR today, but
  Arabic/Urdu text inside a madrasah UI is a realistic future requirement, so the layout must not need a rewrite.
- Bengali numerals in legacy copy (`২ শত +`) are content, not formatting; they stay in the seed/content layer.

## 6. Rendering & performance posture

- Marketing page is static (RSC, no client JS except the mobile drawer).
- `next/image` for every raster asset: the legacy 711 KB hero and 356 KB logo are the largest LCP risks.
- Fonts via `next/font` (self-hosted, no third-party `@import` on the critical path — the legacy `@import` is a
  render-blocking request).
- Scroll-driven animations keep the `animation-timeline` fast path but gain a static fallback and a
  `prefers-reduced-motion` guard.

## 7. Security baseline (enforced now, extended later)

- Secrets only via env; `.env` git-ignored, `.env.example` documents keys without values.
- Zod validation of env at import time → the app refuses to boot misconfigured rather than failing at first request.
- No secret, key, or credential is ever committed or invented. Nothing in this repo pretends to be a live integration.
- Tenant scoping helpers exist in `src/lib/tenant/` before the first tenant-owned query is written.
- Dependency and input hygiene: no `any` (ESLint `@typescript-eslint/no-explicit-any` = error), no unchecked
  `@ts-ignore`.

## 8. Current state (verified 2026-10-28)

- Public page: static `/`, migrated and green at 360/768/1280/1920 in Playwright (20 checks), no dead links, no
  horizontal overflow, drawer focus/Escape behaviour tested.
- Unit/component tests: 5 files, 22 tests. Lint, typecheck, build, schema validation, dependency audit: green.
- Migration `prisma/migrations/20261028220000_init/migration.sql` is generated and reviewed but **not applied**.
- No PostgreSQL, `psql` or Docker is available, so the seed has not run and there are no DB-backed tests.
- The folder is not a git repository; no commit or CI run exists.
- Full command log, deviations and remaining risks: `docs/IMPLEMENTATION_STATUS.md`.

## 9. Open questions to resolve with the user

1. Where are `HADIKATUL_MASTER_INSTRUCTION.md` and `LMS_FULL_PLAN.md`? Phase 2+ cannot be planned faithfully without them.
2. Is `git init` expected in this folder? It is currently not a repository.
3. Which auth provider, PostgreSQL host and credentials — needed before migrations can run for real and before any
   login UI.
4. Are the legacy contact details, staff names/roles and marketing statistics still accurate? They were ported as
   content, not independently verified.
5. Real social/Facebook URLs and staff photos, if those controls should return.
