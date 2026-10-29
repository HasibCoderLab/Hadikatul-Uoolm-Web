# Implementation Status — HadiKatul Uloom

**Date:** 2026-10-28
**Scope closed:** Phase 0 (audit) + Phase 1 (foundation). Later phases are **not** started.
**Outcome:** the public marketing page is migrated and verified at all four required viewports, the Prisma foundation
is in place, and the quality gate is green. The database migration is generated but **not applied**, because no
PostgreSQL instance is available in this environment.

---

## 1. Source-of-truth status (blocking)

| Item                                                 | Status                                                                                                         |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `docs/HADIKATUL_MASTER_INSTRUCTION.md`               | **MISSING.** Phase requirements and acceptance criteria cannot be verified against the authoritative document. |
| `docs/LMS_FULL_PLAN.md`                              | **MISSING.** Full data model, roles, module scope and phasing are unknown beyond the session brief.            |
| Legacy site                                          | Found in `old/` (not at the repo root as the brief assumed). Preserved untouched as visual evidence.           |
| Git repository                                       | **Not a git repository.** No commits, no remote, no CI execution. `git init` was not run without approval.     |
| `docs/ARCHITECTURE.md`                               | Written, but marked **PROVISIONAL** for anything that depends on the missing plans.                            |
| Social/Facebook URLs                                 | **Not supplied.** No URL was invented; the corresponding controls were removed rather than shipped dead.       |
| Real team photos / verified stats / verified contact | Not supplied. Legacy copy is retained and flagged in §6.                                                       |

No instruction supersedes the session brief; no conflict report is possible until the two missing documents are
provided.

---

## 2. What was delivered

### Application

- Next.js 16.4.3 App Router, React 19.3.1, TypeScript 5.9.3 (`strict`, `noUncheckedIndexedAccess`,
  `noImplicitOverride`), Tailwind CSS 4.3.3.
- Single static route `/` (`src/app/page.tsx` + `src/app/layout.tsx`), shipped as a server component with one client
  island (the header drawer).
- Migrated sections: sticky header + utility bar, hero, stats, programmes, "why us", team, contact, map, footer.
- Bengali content centralised in `src/content/site.ts`; no copy literals in JSX.
- Real assets only: copied from `old/` into `public/assets/{images,svgs}`; favicon at `src/app/icon.png`.
- `next/font` Baloo Da 2 (Bengali + Latin), `lang="bn"`, logical CSS properties, skip link, landmarks, visible focus
  styles, reduced-motion fallback.
- Accessible mobile drawer: `aria-expanded`/`aria-controls`, Escape to close, focus returned to the trigger.

### Design system

- Raw audited values in `src/styles/tokens.css` (colour, type, radii, shadows, spacing, header heights).
- One Tailwind `@theme` mapping in `src/styles/globals.css`; no ad-hoc hex values in components.
- Audited breakpoints converted to mobile-first min-widths: `500 / 794 / 921 / 1101 / 1601`.
- Container `min(90vw, 1280px)`; audited radius/shadow scale; Bengali-appropriate line-height.

### Data + tenancy foundation

- Prisma 7.10.1 with the `prisma-client` generator (output `src/generated/prisma`, gitignored) and the
  `@prisma/adapter-pg` driver adapter.
- Four entities only: `Institution` (tenant), `Campus`, `User` (global), `Membership` (role + optional campus).
- Structural tenant guarantees:
  - `Membership` is unique per `(userId, institutionId)`.
  - `Membership.campus` is a **composite FK** `(campusId, institutionId) → Campus(id, institutionId)`, so a member can
    never point at a campus in another institution.
  - Campus codes are unique per institution; tenant FKs are indexed.
- Money rule recorded in the schema: integer minor units + ISO-4217 `currencyCode`; no floating point.
- Server-side authorization helpers in `src/lib/tenant/authorization.ts` (`assertRole`, `assertSameTenant`,
  `assertCampusAccess`, `tenantScope`), with tests including enum drift against Prisma.
- `src/lib/env.ts` validates `NODE_ENV` and an optional PostgreSQL `DATABASE_URL`; `requireDatabaseUrl()` throws a
  clear error at first database access. No secret is hard-coded or invented.
- Prisma CLI config uses a documented local placeholder URL so `generate`/`validate` work without credentials.

### Verification assets

- Vitest 5.0.5 + Testing Library (5 files, 22 tests).
- Playwright 1.64.1, four viewport projects (360×800, 768×1024, 1280×800, 1920×1080), production server on port 3100.
- GitHub Actions quality gate (pnpm install, audit, schema validate, format, lint, typecheck, unit, build, E2E).
- pnpm 12.11.2; dependency overrides pin `postcss` 8.5.32 and `esbuild` 0.28.2.

---

## 3. Intentional fixes / deviations from the legacy page

1. **Dead controls removed, not faked.** Facebook page/group panels, twelve team social icons, the top-bar social
   icons and the "আপডেট" nav item all pointed at `#`; they are absent until real URLs exist.
2. **Programme cards are real links** to `#contactus` (enrolment guidance) instead of inert `<div>`s.
3. **Team portraits replaced by initials.** The legacy reused one mosque photo (`mashid.jpg`) as four different
   people's portraits. Initials are honest placeholders until real photos are supplied.
4. **Decorative imagery marked decorative.** The hero background has `alt=""`; the "why us" photo now has the
   non-claiming alt "শ্রেণিকক্ষ" instead of asserting it is the school's own classroom.
5. **Utility-bar icons inverted** to white so they are legible on the audited gold→green gradient.
6. **Gold buttons use dark ink**, not white text, for contrast on `#f1c40f`.
7. **Valid language tag** `bn` replaces the legacy `ban`.
8. **The audited 12px hero subheading was kept**; it was not rounded up to a "nicer" size.
9. **Breakpoints/container approximated from max-width to min-width** and documented; no new colours or fonts were
   invented.
10. **The contact panel's call button uses the primary phone number**; both numbers remain available in the utility bar
    and footer.

---

## 4. Database / migrations

| Item              | Status                                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Schema            | Valid (`pnpm run db:validate`).                                                                                          |
| Client            | Generated to `src/generated/prisma` (gitignored); regenerated on `postinstall`.                                          |
| Migration SQL     | One generated, reviewed init migration: `prisma/migrations/20261028220000_init/migration.sql` + `migration_lock.toml`.   |
| Migration applied | **NO** — no PostgreSQL server, no `psql`, no Docker in this environment.                                                 |
| Seed              | Written with fake data (`@example.test`, "Demo ... (fake data)"); **not executed** for the same reason.                  |
| DB-backed tests   | **None executed.** Tenant SQL/constraint behaviour is verified by inspection and pure unit tests, not against a live DB. |

`prisma.config.ts` falls back to `postgresql://localhost:5432/hadikatul_placeholder` for CLI commands that do not
connect. It is not a credential and is not used by the application, which requires a real `DATABASE_URL`.

---

## 5. Quality gate (commands actually run)

| Command                          | Result                                                                                    |
| -------------------------------- | ----------------------------------------------------------------------------------------- |
| `pnpm install --frozen-lockfile` | Pass (used during the final gate; lockfile regenerated once for the overrides).           |
| `pnpm audit`                     | **No known vulnerabilities found** after pinning `postcss@8.5.32` and `esbuild@0.28.2`.   |
| `pnpm run db:validate`           | Pass — schema valid.                                                                      |
| `pnpm run format:check`          | Pass (lockfile added to `.prettierignore`; it is generated, not authored).                |
| `pnpm run lint`                  | Pass — zero warnings (`--max-warnings=0`).                                                |
| `pnpm run typecheck`             | Pass — `tsc --noEmit`.                                                                    |
| `pnpm run test`                  | **5 files, 22 tests passed.**                                                             |
| `pnpm run build`                 | Pass — static `/`, `/_not-found`, `/icon.png`.                                            |
| `pnpm run e2e`                   | **20 passed** (5 checks × 4 viewport projects) against the production build on port 3100. |

E2E checks: no console/page errors, no horizontal overflow, every section fits the viewport, no dead links and every
hash target exists, and the drawer opens/closes on Escape with focus restoration. The earlier E2E failures were
environmental (a leftover dev server on port 3000 holding Next's lock, then a wrong `--` in the web-server command),
not application failures; both were resolved and the suite was rerun green.

CI has not been executed on GitHub because this folder has no repository/remote. The workflow is syntactically complete
but unproven in Actions.

---

## 6. Unverified content / limitations

- Contact emails, phone numbers, hours and address are copied from the legacy page; they have not been confirmed with
  the client in this session.
- Marketing claims ("২ শত +", "২০ জন+", "৫ বছর+", "১০ টি+", team roles/names) originate in the legacy page and are
  **not independently verified**.
- No real social/Facebook profile URL was provided, so no social UI ships.
- No real staff photographs were provided (see §3.3).
- The hero/why-us photos are legacy stock/placeholder imagery, not verified photographs of the institution.
- Auth is **not implemented**; no provider or credentials were supplied, and none were invented. The tenancy data
  model and pure authorization helpers are ready for it.
- The Google Maps iframe loads a third-party origin; no CSP/privacy review has been done.
- Fonts are downloaded by `next/font` at build time; an offline CI runner would need a font cache/mirror.

---

## 7. Missing configuration (not fabricated)

1. `DATABASE_URL` for a real PostgreSQL instance (and the host/credentials to run the migration and seed).
2. Auth provider decision + its environment variables (Phase 3+).
3. Real social/Facebook URLs and real team photos (safe to add later to `src/content/site.ts`).
4. The two missing source-of-truth documents listed in §1.

---

## 8. Recommended next task

Provide the two missing documents and a PostgreSQL instance. Then:

1. Reconcile `docs/ARCHITECTURE.md` with the real plan; adjust the four-entity model if the plan requires it.
2. Run `pnpm run db:deploy` (or `prisma migrate dev`) and `pnpm run db:seed` against that database; verify the
   composite FK and unique membership constraints with DB-backed tests.
3. Only after that, start the next briefed phase (identity/session resolution), keeping every query tenant-scoped.

Do not begin LMS feature work before step 1 — the current data model is deliberately minimal and provisional.
