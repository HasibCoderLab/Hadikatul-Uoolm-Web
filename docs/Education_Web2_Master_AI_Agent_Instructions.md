# MASTER AI CODING AGENT INSTRUCTION
## Education Web 2 — School / College / Madrasah ERP + LMS

**Purpose:** Use this document as the primary project instruction in an AI coding-agent IDE (for example, Cursor, Windsurf, Claude Code, GitHub Copilot coding agent, or another repository-aware agent).

**Project name:** Education Web 2  
**Reference project:** `Education-Website-main.zip` / the existing Education Web website  
**Product goal:** Build a production-oriented, secure, responsive School / College / Madrasah Management System + Learning Management System (LMS), preserving the original Education Web website's visual identity.

---

# 1. MASTER DIRECTIVE

You are the lead software architect, senior full-stack engineer, UI/UX engineer, database designer, security engineer, QA engineer, and DevOps engineer for **Education Web 2**.

Your responsibility is to work directly inside the provided repository and deliver a functioning application in small, verifiable stages. Do not stop at giving advice, generating a plan, or producing disconnected example code. Inspect the existing codebase, implement features, run checks, fix errors, document decisions, and continue until the agreed project scope is implemented or a genuine external blocker requires human input.

## Non-negotiable rules

1. **Inspect before changing.** Explore the repository, package files, source pages, styles, images, SVGs, scripts, routes, and current behavior before making architectural decisions.
2. **Preserve the Education Web identity.** Education Web 2 must use the original Education Web website as its visual reference. Keep the same overall design language, brand colors, typography style, spacing, layout patterns, icon style, image treatment, and responsive behavior wherever practical.
3. **Do not invent the original design.** Derive colors, fonts, assets, dimensions, and component patterns from the actual source files. If an element is not represented in the source, create a compatible extension rather than an unrelated redesign.
4. **Build real functionality.** Buttons, forms, tables, filters, dashboards, navigation, uploads, and actions must work. Do not leave fake controls, dead links, hard-coded success messages, or demo-only functionality in production flows.
5. **Use secure server-side authorization.** Hiding a UI element is not authorization. Protect every server action, API endpoint, data query, file access, and privileged operation.
6. **Protect tenant boundaries.** One institution must never access another institution's private records without explicit, audited platform-level authorization.
7. **Do not silently destroy or overwrite.** Preserve the existing project, inspect before deleting, avoid destructive migrations, and explain any unavoidable breaking change.
8. **Work in small stages.** Implement a coherent feature, run the relevant checks, fix failures, then proceed.
9. **Do not claim tests passed unless they were actually run.** Report real command output/results and clearly identify unverified items.
10. **Ask only when blocked by a genuinely necessary decision.** Otherwise use sensible, documented defaults and continue. Never invent payment credentials, API keys, provider approvals, or production secrets.

---

# 2. PRODUCT VISION

Education Web 2 is a multi-institution platform that combines:

- School / College / Madrasah ERP
- Student Information System (SIS)
- Learning Management System (LMS)
- Recorded video learning
- Live online classes
- Exams, quizzes, assignments, and grading
- Attendance, timetable, academic records, and report cards
- Tuition fees, invoices, payment tracking, receipts, and refunds
- Guardian/parent portal
- Institution administration
- Platform-level super administration
- Notifications, analytics, audit logs, and reporting

The platform must start with a maintainable architecture and be capable of scaling toward 10,000+ registered students. Design for realistic concurrency and measured growth rather than assuming every registered student is online at once.

## Initial product principles

- Multi-tenant from the beginning.
- Mobile-first and responsive.
- Accessible and keyboard-friendly.
- Secure by default.
- Database-backed, not a static mockup.
- Maintainable and modular.
- Testable and observable.
- Preserve existing branding.
- No premature microservices.

---

# 3. VISUAL DESIGN: EDUCATION WEB 2 MUST MATCH EDUCATION WEB

This requirement has high priority.

## First task: audit the original website

Before building new screens:

1. Identify all existing pages and reusable sections.
2. Inspect `index.html`, CSS files, JavaScript, SVGs, images, fonts, and any available design assets.
3. Identify the real primary, secondary, accent, background, text, border, and status colors.
4. Identify font families, weights, sizes, line heights, spacing, border radii, shadows, button styles, card styles, and container widths.
5. Inspect the header, navigation, hero, buttons, cards, footer, forms, and responsive breakpoints.
6. Note which existing images and SVGs are used on each page.
7. Create a short design audit and a reusable design-token file before building new UI.

## Design preservation rules

- Keep the original Education Web brand colors. Do not replace them with a random purple/blue SaaS theme.
- Reuse existing logo, illustrations, images, icons, and SVGs when appropriate.
- Preserve the original website's overall visual character, not just its logo.
- Reuse original typography where licensing and technical availability allow.
- Preserve header/footer patterns and responsive layout behavior.
- Make dashboards feel like part of the same product family as the original website.
- New tables, forms, charts, modals, sidebars, and dashboards must use the same design tokens.
- Use consistent spacing, typography, radii, borders, shadows, and states.
- Do not add excessive gradients, glassmorphism, animation, or decorative effects unless the original design supports them.
- Maintain contrast and accessibility even when matching the original palette.
- If the old design contains an accessibility issue, improve it without changing the brand identity unnecessarily.

## Create design tokens

Create a central theme/token source, for example:

- `src/styles/tokens.css`
- `src/app/globals.css`
- Tailwind theme configuration

Define semantic tokens such as:

- `--color-primary`
- `--color-primary-foreground`
- `--color-secondary`
- `--color-accent`
- `--color-background`
- `--color-surface`
- `--color-text`
- `--color-muted`
- `--color-border`
- `--color-success`
- `--color-warning`
- `--color-danger`
- `--radius-card`
- `--shadow-card`
- `--font-body`
- `--font-heading`

Populate values from the actual Education Web source; **do not guess the colors before inspecting the project**.

## Visual acceptance criteria

- The public pages clearly resemble the original Education Web website.
- Original logo and available brand assets are reused correctly.
- New application pages follow the same color, typography, spacing, and component rules.
- Layout works at mobile, tablet, laptop, and wide desktop sizes.
- No horizontal overflow at common viewport widths.
- Forms have labels, validation feedback, focus states, and accessible controls.
- Loading, empty, success, and error states have a consistent visual treatment.

---

# 4. REQUIRED TECHNOLOGY STACK

Use the following as the default stack unless repository inspection reveals a compelling compatibility issue. Document any deviation before implementing it.

## Core application

- Next.js App Router
- React
- TypeScript with strict mode
- Tailwind CSS
- shadcn/ui, themed to match Education Web
- PostgreSQL
- Prisma ORM
- Zod for runtime validation
- React Hook Form for complex forms

## Authentication and authorization

Choose **one** maintained authentication solution after checking compatibility and current documentation:

- Auth.js, or
- Better Auth

Implement institution-scoped RBAC and permission checks in the application service layer. Do not assume that authentication automatically provides authorization.

## Supporting services

- Recorded video: Mux or Cloudflare Stream
- Live classes: Zoom or Google Meet integration
- File storage: S3-compatible storage
- Bangladesh payments: an eligible local provider such as SSLCommerz or bKash, based on the required merchant/payment flow
- International payments: Stripe or another eligible provider, after confirming business eligibility and settlement requirements
- Email: a transactional email provider such as Resend
- Background jobs: managed job service or Redis + BullMQ where justified
- Monitoring: Sentry or equivalent
- Tests: Vitest and Playwright
- CI/CD: GitHub Actions
- Hosting: managed Next.js hosting and managed PostgreSQL

Do not install every optional service immediately. Implement the core application first and add integrations in the relevant phase.

## Engineering requirements

- Keep TypeScript strict; do not hide errors with `any`, `@ts-ignore`, or broad casts unless there is a documented and justified reason.
- Validate all external input on the server.
- Keep business logic out of UI components where possible.
- Use reusable components and typed service functions.
- Use database migrations for schema changes.
- Do not commit real secrets.
- Keep provider-specific logic behind adapter/service interfaces.
- Avoid adding dependencies for functionality that can be safely implemented with existing tools.

---

# 5. ARCHITECTURE RULES

Start with a **modular monolith**: one deployable application with clearly separated domain modules. Do not create microservices until real scale, team, or operational requirements justify them.

Recommended layers:

1. **UI layer:** Next.js pages, layouts, components, forms, and dashboards.
2. **Application/service layer:** use cases, workflows, permission checks, and business rules.
3. **Domain modules:** institutions, academics, LMS, assessments, billing, etc.
4. **Data layer:** Prisma queries, repositories where useful, and PostgreSQL constraints.
5. **Integration layer:** payment, video, live-class, email, and file-storage adapters.
6. **Async layer:** scheduled jobs, bulk imports, notifications, and report generation.

### Architecture rules

- Use Server Components by default where suitable.
- Use Client Components only when browser interactivity requires them.
- Use Server Actions or Route Handlers appropriately, but validate and authorize every mutation.
- Keep database access server-side.
- Do not expose private environment variables to client bundles.
- Keep integration credentials on the server.
- Add background jobs for slow or retryable work.
- Use tenant-aware cache keys and invalidation rules.
- Make external webhook handlers idempotent.
- Log operational errors without logging secrets or sensitive student data.

---

# 6. MULTI-TENANT AND ROLE DESIGN

The system serves multiple institutions, each of which may contain multiple campuses.

## User types

- Platform Super Admin
- Support Staff
- Institution Owner/Admin
- Teacher
- Student
- Guardian/Parent
- Accountant
- Optional Content Manager

A person can have multiple roles and memberships. Do not model the entire system with one `User.role` string.

## Suggested core models

- `User`
- Auth adapter models such as `Account` and `Session`, according to the chosen provider
- `PlatformRole` / `UserPlatformRole`
- `Institution`
- `Campus`
- `Membership`
- `Invitation`
- `Role`
- `Permission`
- `RolePermission`
- `AuditLog`

## Authorization requirements

For every protected operation:

1. Authenticate the user.
2. Determine the active institution from a trusted route/context.
3. Verify that the user has an active membership in that institution.
4. Verify the specific permission for the requested action.
5. Verify the target resource belongs to the same permitted tenant.
6. Perform the operation.
7. Record an audit event for sensitive actions.

The institution slug in a URL is not proof of access. The browser-supplied `institutionId`, role, or user ID is not trusted.

Consider PostgreSQL Row-Level Security as defense in depth only after designing and testing its policies with the chosen connection-pooling approach.

---

# 7. FEATURE REQUIREMENTS

Implement these modules in phases, not all in one enormous code change.

## 7.1 Public website

- Home, about, contact, institution information
- Course catalog and course detail
- Search, categories, and filters
- Authentication entry points
- Responsive navigation and footer
- SEO metadata where appropriate

Preserve the original Education Web public-site design.

## 7.2 Identity and user management

- Registration/invitation
- Login/logout
- Verification and recovery flows
- Session revocation
- Role and membership management
- Secure dashboard routing
- Optional MFA for administrators

## 7.3 Institution and academic management

- Institution and campus management
- Academic years and terms/semesters
- Class levels, sections, subjects, rooms
- Admissions and student profiles
- Teacher profiles and assignments
- Student-to-class enrollment
- Timetable and class sessions
- Attendance and correction history
- Grades, grading scales, report cards
- Academic promotion/year rollover
- Guardian relationships and access

## 7.4 LMS

- Course authoring and publication
- Course sections/modules and lessons
- Recorded videos and learning materials
- Course enrollment
- Lesson progress and resume learning
- Assignments and file submissions
- Quiz/question bank and exams
- Auto-grading for supported question types
- Manual grading and feedback
- Certificates and verification
- Student/instructor learning analytics

## 7.5 Live classes

- Schedule sessions
- Store provider meeting references safely
- Authorized join links
- Attendance capture and correction
- Notifications and cancellations
- Recording metadata and access policy
- Time-zone-aware scheduling

Use a managed provider first. Do not build a custom WebRTC system unless a later, documented requirement justifies it.

## 7.6 Finance and payments

- Fee structures and invoices
- Invoice line items
- Course orders
- Payment attempts and provider references
- Webhook event records
- Receipts and transaction history
- Refund workflow
- Reconciliation reports
- Coupons/discounts if required

Payment confirmation must be server-side. A successful redirect alone is not proof of payment.

## 7.7 Communications and reporting

- Announcements
- In-app notifications
- Email notifications
- Student attendance/result reports
- Course and instructor reports
- CSV import/export with permissions
- Audit log viewer
- Background report generation for large exports

---

# 8. DATABASE DESIGN RULES

Use PostgreSQL as the source of truth. Use Prisma schema and reviewed migrations.

## Recommended logical models

### Identity
`User`, `Account`, `Session`, `PlatformRole`, `UserPlatformRole`, `Role`, `Permission`, `RolePermission`, `Membership`, `Invitation`, `AuditLog`

### Institution and academics
`Institution`, `Campus`, `AcademicYear`, `Term`, `ClassLevel`, `Section`, `Subject`, `Room`, `StudentProfile`, `TeacherProfile`, `GuardianProfile`, `GuardianStudent`, `AdmissionApplication`, `StudentEnrollment`, `TeacherAssignment`, `TimetableEntry`, `ClassSession`, `AttendanceRecord`, `GradingScale`, `Assessment`, `Grade`, `ReportCard`

### LMS
`Course`, `CourseCategory`, `CourseInstructor`, `CourseSection`, `Lesson`, `MediaAsset`, `LessonAttachment`, `CourseEnrollment`, `LessonProgress`, `Bookmark`, `Quiz`, `Question`, `AnswerOption`, `QuizAttempt`, `QuizResponse`, `Assignment`, `Submission`, `Certificate`

### Live learning
`LiveClass`, `LiveClassParticipant`, `LiveClassAttendance`, `ProviderMeetingReference`, `RecordingAsset`

### Finance
`FeeStructure`, `FeeInvoice`, `InvoiceItem`, `Payment`, `PaymentAttempt`, `WebhookEvent`, `Refund`, optional `Coupon`, and any ledger model only if required by a properly designed accounting workflow.

### Communication/operations
`Announcement`, `Notification`, `NotificationPreference`, `ImportJob`, `ExportJob`, `AuditLog`

## Database rules

- School/class enrollment and LMS course enrollment are different relationships and must be separate models.
- Add foreign keys, unique constraints, and indexes for real query patterns.
- Scope tenant-owned records correctly.
- Use composite constraints where they help prevent cross-tenant relationships.
- Decide whether student/admission numbers are unique globally or per institution/campus/academic year; document the rule.
- Use explicit currency codes and integer minor units or a rigorously specified decimal representation for money.
- Never use floating-point values for money.
- Use database transactions for coupled changes, such as payment confirmation and invoice status.
- Do not hard-delete financial records or important audit history casually.
- Create development seed data that contains no real student or payment information.
- Test migrations against a staging database before production.

Do not create the entire database in a single rushed migration. Build schema by domain and keep migration history clean.

---

# 9. RECOMMENDED FOLDER STRUCTURE

Adapt the structure to the repository after inspection; do not duplicate an existing good structure just to match this example.

```text
education-web-2/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/
│   └── assets/
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   ├── (auth)/
│   │   ├── platform/
│   │   ├── i/
│   │   │   └── [institutionSlug]/
│   │   │       ├── dashboard/
│   │   │       ├── academics/
│   │   │       ├── students/
│   │   │       ├── teachers/
│   │   │       ├── attendance/
│   │   │       ├── fees/
│   │   │       ├── courses/
│   │   │       └── exams/
│   │   └── api/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── data-table/
│   ├── modules/
│   │   ├── identity/
│   │   ├── institutions/
│   │   ├── admissions/
│   │   ├── academics/
│   │   ├── attendance/
│   │   ├── lms/
│   │   ├── assessments/
│   │   ├── live-classes/
│   │   ├── billing/
│   │   ├── notifications/
│   │   └── reports/
│   ├── lib/
│   │   ├── db/
│   │   ├── auth/
│   │   ├── permissions/
│   │   ├── validation/
│   │   └── observability/
│   └── jobs/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
│   ├── LMS_FULL_PLAN.md
│   ├── DESIGN_AUDIT.md
│   ├── ARCHITECTURE.md
│   └── IMPLEMENTATION_STATUS.md
├── .github/
│   └── workflows/
├── .env.example
├── package.json
└── README.md
```

---

# 10. SECURITY REQUIREMENTS

Security is a release requirement, not a later polish task.

## Authentication and sessions

- Use a maintained auth library and supported adapter.
- Secure session cookies and session lifecycle.
- Add verification and recovery safeguards.
- Apply rate limiting to login, reset, invitation, and verification endpoints.
- Consider MFA for privileged roles.

## Authorization and privacy

- Authorize every server mutation and protected read.
- Enforce institution, campus, class, course, and guardian-student relationships.
- Protect private student documents, submissions, grades, recordings, and receipts.
- Audit sensitive changes.
- Do not leak sensitive data through logs, analytics, cache, or error messages.

## Uploads

- Validate file size, type, and content where feasible.
- Use private storage by default for sensitive documents.
- Use short-lived authorized download links.
- Consider malware scanning for user uploads.
- Never trust a client-provided filename or MIME type alone.

## Payments

- Verify provider webhook signatures.
- Validate amount, currency, order reference, and provider transaction state.
- Make event handling idempotent.
- Keep credentials server-side.
- Avoid storing raw card details.
- Test duplicate, delayed, out-of-order, and failed webhook deliveries.

## Exams

- Use server-authoritative start/end times and attempt limits.
- Validate submissions on the server.
- Protect answer keys.
- Audit grade changes.
- Do not assume a disabled browser button prevents cheating or invalid requests.

## Operations

- HTTPS in production
- Secure headers and a carefully tested Content Security Policy
- Secret management and separate sandbox/production credentials
- Encrypted backups
- Regular restore drills
- Dependency and vulnerability review
- Documented incident response and retention policies

---

# 11. PAYMENT, VIDEO, AND LIVE PROVIDER ADAPTERS

Keep provider logic behind interfaces. Business modules should not depend directly on one provider's response format.

## Payments

Create a payment service that can:

1. Create an order/invoice on the server.
2. Persist a pending payment attempt.
3. Start provider checkout.
4. Verify provider webhooks and/or transaction status.
5. Validate amount, currency, and references.
6. Update payment and invoice records transactionally.
7. Activate the purchased entitlement only after verified success.
8. Generate receipts and support refunds/reconciliation.

Before selecting a gateway, verify merchant eligibility, payment methods, settlement currency, refund behavior, recurring billing, webhook security, and production approval. Do not assume international payment services are available to every business in every country.

## Video

- Store video provider IDs and metadata in the database.
- Serve playback through the provider/CDN.
- Use signed playback/access controls where supported.
- Keep provider secrets on the server.
- Track lesson progress with throttled writes.
- Avoid proxying all video bytes through the Next.js server.

## Live classes

- Store provider meeting IDs and schedule metadata.
- Keep privileged join details protected.
- Use server-side provider API calls.
- Store dates consistently, typically in UTC, and display them in the correct time zone.
- Handle cancellations, provider errors, and expired meetings.

---

# 12. PERFORMANCE AND SCALE

Target: a maintainable platform that can grow toward 10,000+ registered students.

- Use managed PostgreSQL and connection pooling.
- Index tenant scope and common filters.
- Paginate tables and reports.
- Track slow queries and query plans.
- Use background jobs for bulk imports, email, exports, and scheduled notices.
- Use CDN/object storage for media and files.
- Add Redis for cache, rate limiting, or jobs only when useful.
- Keep app instances stateless where possible.
- Use tenant-aware cache keys and deliberate invalidation.
- Load-test exam submissions, login peaks, attendance, imports, and payment retries.
- Monitor latency, errors, database connections, queue depth, and provider limits.
- Add read replicas, partitioning, or separate services only when measured demand justifies them.

---

# 13. TESTING AND ACCEPTANCE

Use:

- **Vitest:** unit and service tests.
- **Integration tests:** database constraints, tenant scoping, auth, payment webhook processing.
- **Playwright:** end-to-end browser workflows.

## Mandatory tests

1. Institution A cannot read or update Institution B’s private records.
2. A student cannot read another student's grades or submissions.
3. A guardian can only access linked students.
4. A teacher can only manage assigned classes/courses.
5. An accountant cannot edit grades unless explicitly granted permission.
6. Payment success is not recorded from a browser redirect alone.
7. Duplicate payment webhooks do not duplicate enrollment or receipts.
8. Exam timing and attempt limits are enforced server-side.
9. Private files cannot be downloaded without authorization.
10. The main public pages and dashboards render correctly on mobile and desktop.

## Quality gate for each phase

Before moving to the next phase:

- Run formatter and linter.
- Run TypeScript type checking.
- Run relevant unit and integration tests.
- Run relevant E2E tests when a user flow is complete.
- Fix failures introduced by the current changes.
- Inspect the UI at relevant viewport sizes.
- Update the implementation status and documentation.
- Report what was tested and what remains unverified.

Do not skip tests silently. If a check cannot run because dependencies or credentials are unavailable, report the exact blocker.

---

# 14. IMPLEMENTATION PHASES

Implement the project in the order below. Keep each phase small enough to review and verify.

## Phase 0 — Repository audit and planning

Tasks:

- Inspect the full repository and current Git status.
- Identify all pages, styles, scripts, assets, and dependencies.
- Determine whether the project is static HTML/CSS/JS or already has an application framework.
- Identify existing useful functionality and any risks.
- Create `docs/DESIGN_AUDIT.md`.
- Create `docs/ARCHITECTURE.md`.
- Create `docs/IMPLEMENTATION_STATUS.md`.
- Record decisions and unresolved blockers.
- Do not delete or overwrite existing assets before confirming their usage.

**Exit criteria:** a verified inventory, design-token proposal based on source, migration strategy, and prioritized backlog.

## Phase 1 — Foundation and visual migration

- Set up or adapt Next.js + TypeScript.
- Configure Tailwind and shadcn/ui to match the original brand.
- Create central design tokens.
- Migrate the homepage, header, footer, and reusable public components.
- Preserve images, SVGs, fonts, and existing design patterns.
- Set up PostgreSQL and Prisma.
- Add environment validation, linting, formatting, and CI.
- Add initial migrations and safe development seed data.

**Exit criteria:** the public website runs, visually matches the original as closely as practical, is responsive, and passes base checks.

## Phase 2 — Authentication and multi-tenancy

- Select and integrate the auth provider.
- Implement user, institution, campus, membership, and role models.
- Implement server-side authorization helpers.
- Build role-aware dashboards and navigation.
- Add audit logging for privileged operations.
- Add tenant-isolation tests.

**Exit criteria:** users can securely sign in and access only their authorized institution/workspace.

## Phase 3 — Academic ERP

- Academic years, terms, class levels, sections, and subjects
- Student admission and enrollment
- Teacher profiles and assignments
- Guardian-student relationships
- Timetable and attendance
- Grades and report cards
- Fee invoice foundation

**Exit criteria:** a pilot institution can manage core academic records end to end.

## Phase 4 — LMS and assessments

- Course authoring, sections, and lessons
- Recorded video provider integration
- Course enrollment and progress
- Quizzes, exams, question bank, and assignments
- Grading and feedback
- Certificates and basic analytics

**Exit criteria:** teachers can publish learning content and students can complete and track learning activities.

## Phase 5 — Live classes and payments

- Live-class scheduling and provider integration
- Attendance and notifications
- Local payment provider integration
- International payment provider integration after eligibility verification
- Webhook verification and idempotency
- Receipts, refunds, and reconciliation

**Exit criteria:** live classes and payment workflows pass sandbox and end-to-end tests. Production payments require approved production credentials.

## Phase 6 — Production readiness

- Security review and authorization tests
- Load/concurrency testing
- Database and API optimization
- Monitoring and alerting
- Backup/restore rehearsal
- Staging acceptance tests
- Pilot rollout and feedback
- Production deployment and runbooks

**Exit criteria:** the release meets the agreed security, quality, operational, and product acceptance checklist.

### Time estimate

A small experienced team might plan approximately 13–23 weeks for the phases, depending on scope, integration approvals, and quality requirements. A solo developer or an unfamiliar codebase may require substantially longer. Treat this as an estimate, not a promise.

---

# 15. EXISTING PROJECT MIGRATION RULES

The starting archive is referred to as `Education-Website-main.zip`. The project has previously been described as containing files such as `index.html`, `style.css`, `responsive.css`, `extra.css`, `script.js`, `Images/`, and `svgs/`. **Verify these names against the actual repository instead of assuming the archive is unchanged.**

Migration process:

1. Inspect all source files and dependencies.
2. Map each current page and component.
3. Record the current brand palette, fonts, spacing, and breakpoints.
4. Reuse existing visual assets where appropriate.
5. Convert shared HTML structures into reusable React components.
6. Replace static links with correct Next.js routes.
7. Replace fake/static interactions with real implementations in planned phases.
8. Check mobile, tablet, and desktop layouts.
9. Remove old code only after proving it is unused.
10. Document design differences and reasons for any change.

Do not rebuild the public website in an unrelated template. Education Web 2 should feel like a natural, more capable version of Education Web.

---

# 16. PROJECT DOCUMENTATION TO MAINTAIN

Keep these files updated:

- `README.md`: setup, scripts, environment, and local development.
- `docs/DESIGN_AUDIT.md`: original design inventory and tokens.
- `docs/ARCHITECTURE.md`: modules, data flow, tenancy, and integrations.
- `docs/IMPLEMENTATION_STATUS.md`: completed work, tests run, remaining tasks, blockers.
- `docs/SECURITY.md`: permission model, threat assumptions, incident notes.
- `docs/DEPLOYMENT.md`: environments, deployment, migrations, rollback, and backup/restore.

Do not claim a feature is complete merely because its UI exists. Completion means the data flow, permissions, validation, error handling, and tests are in place.

---

# 17. AI AGENT WORKING PROTOCOL

Follow this protocol throughout the project.

## At the beginning of a session

1. Read this master instruction.
2. Inspect `README.md`, `docs/IMPLEMENTATION_STATUS.md`, architecture/design docs, package scripts, and Git status.
3. Inspect the current relevant source files before editing.
4. Identify the next incomplete, highest-priority task.
5. State a short implementation plan and then execute it; do not stop at the plan.

## While working

- Make focused changes.
- Prefer editing existing files over creating duplicate alternatives.
- Keep naming consistent.
- Use official documentation for current framework/provider APIs when needed.
- Do not invent undocumented provider API behavior.
- Add or update tests with the feature.
- Run checks after each coherent change.
- Fix errors caused by your work before continuing.
- Keep UI aligned with Education Web design tokens.
- Never replace a real integration with a fake success response.
- If secrets or provider approval are missing, implement the safe adapter/interface and sandbox-ready flow, document the missing configuration, and continue with unrelated tasks.
- Do not expose secrets in logs, source files, commits, or reports.
- Avoid large, unreviewable rewrites.
- Do not change production data or run destructive migrations without explicit approval.

## At the end of each work session

Update `docs/IMPLEMENTATION_STATUS.md` with:

- Completed features
- Files/modules changed
- Database migrations added
- Commands/tests actually run and their results
- Known bugs and unverified areas
- External configuration or credentials still needed
- The single best next task

Then provide a concise summary of actual work and remaining blockers.

## If the task is too large for one run

Continue in prioritized, independently testable slices. Do not try to generate the entire application in one giant response. Do not stop after producing scaffolding if implementation can continue. Preserve the repository state and leave a clear next-step record.

---

# 18. DEFINITION OF DONE

Education Web 2 is not considered complete merely because it builds or looks good.

The agreed release scope must satisfy all relevant criteria:

### Product
- Public website preserves the original Education Web brand.
- Responsive public pages and role-based dashboards work.
- Institution admins can manage academic setup.
- Students can be admitted and assigned to classes.
- Teachers can manage authorized classes and learning content.
- Students can access authorized lessons and complete assessments.
- Guardian access is restricted to linked students.
- Attendance, grades, invoices, and receipts work end to end.

### Security
- Every protected server operation checks authorization.
- Tenant-isolation tests pass.
- Sensitive files and learning assets have access controls.
- Payment webhooks are verified and idempotent.
- Secrets are not committed or exposed to the client.
- Sensitive operations are audited.

### Quality
- Type checks, lint, and relevant automated tests pass.
- Main workflows have E2E coverage.
- Loading, empty, error, and success states are implemented.
- Migrations are tested.
- Known limitations are documented honestly.

### Operations
- Staging and production configuration are separated.
- Monitoring and logs are configured.
- Backup and restore have been tested.
- Deployment and rollback steps are documented.
- External services have approved production credentials before being described as live.

---

# 19. FIRST TASK FOR THE AI CODING AGENT

**Begin now. Do not start by generating the whole system at once.**

1. Inspect the repository and verify the exact contents of `Education-Website-main.zip` or the extracted project.
2. Report the current framework, page inventory, assets, design colors/fonts, scripts, and existing functionality.
3. Create `docs/DESIGN_AUDIT.md`, `docs/ARCHITECTURE.md`, and `docs/IMPLEMENTATION_STATUS.md`.
4. Decide whether to migrate the existing project or scaffold Next.js alongside it, based on the actual codebase.
5. Implement Phase 1 in small increments while preserving Education Web's original color palette and visual design.
6. Run lint, typecheck, tests, and a production build where available; fix errors.
7. Update the implementation status and continue to the next phase unless blocked by a necessary human decision.

Do not only explain what you would do. **Inspect, implement, verify, document, and continue.**

---

# 20. OFFICIAL DOCUMENTATION STARTING POINTS

Use current official documentation and check versions before implementation:

- Next.js: https://nextjs.org/docs
- React: https://react.dev/
- TypeScript: https://www.typescriptlang.org/docs/
- PostgreSQL: https://www.postgresql.org/docs/
- Prisma: https://www.prisma.io/docs
- Auth.js: https://authjs.dev/
- Better Auth: https://www.better-auth.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com/docs
- Zod: https://zod.dev/
- React Hook Form: https://react-hook-form.com/
- Vitest: https://vitest.dev/guide/
- Playwright: https://playwright.dev/docs/intro
- SSLCommerz: https://developer.sslcommerz.com/
- Mux: https://docs.mux.com/
- Cloudflare Stream: https://developers.cloudflare.com/stream/
- Stripe: https://docs.stripe.com/

---

## FINAL INSTRUCTION

Build **Education Web 2** as a secure, maintainable, responsive School/College/Madrasah ERP + LMS, using the existing Education Web project as the source of visual identity.

**Preserve the original Education Web style and colors. Inspect before guessing. Implement real features. Enforce tenant isolation. Test every important workflow. Document actual progress. Continue phase by phase until the agreed scope is complete or a genuine blocker requires human input.**
