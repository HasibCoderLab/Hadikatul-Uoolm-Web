# School / College / Madrasah Management + LMS
## Full Architecture & Implementation Plan

**Project:** Education-Website modernization  
**Architecture:** Multi-institution ERP + Learning Management System (LMS)  
**Primary stack:** Next.js, TypeScript, PostgreSQL, Prisma  
**Target scale:** Start small and scale to 10,000+ registered students  
**Learning modes:** Recorded lessons + live classes  
**Payments:** Bangladesh + international, subject to provider eligibility  
**Status:** Architecture and delivery blueprint

---

## 1. Executive Summary

This project should be built as a **multi-institution School/College/Madrasah ERP + LMS**, rather than only a course-selling website.

The platform will combine:

- **Academic ERP:** institutions, campuses, academic years, classes, sections, subjects, admissions, attendance, timetables, grades, guardians, and fees.
- **LMS:** courses, lessons, video playback, live classes, assignments, quizzes, exams, progress tracking, and certificates.
- **Payments:** tuition invoices, course purchases, payment attempts, refunds, receipts, and reconciliation.
- **Platform administration:** super administrators, institution administrators, teachers, students, guardians, accountants, and support staff.
- **Operations:** notifications, audit logs, monitoring, backups, and deployment automation.

The recommended starting architecture is a **modular monolith**: one deployable application with clear internal modules. This is easier to build, test, and operate than starting with microservices, while preserving a path to scale.

> Important: 10,000 registered students does not necessarily mean 10,000 concurrent users. Capacity planning must be based on peak simultaneous activity, exam traffic, video delivery, and database workload.

---

## 2. Goals and Scope

### 2.1 Core goals

1. Preserve and modernize the current education website’s branding and useful UI.
2. Support multiple independent institutions in one platform.
3. Enforce institution-scoped access to all tenant-owned data.
4. Deliver both academic administration and online learning.
5. Support recorded and live learning.
6. Integrate Bangladesh and international payment providers where the business is eligible.
7. Build a testable, maintainable codebase with secure deployment practices.
8. Start with a manageable architecture and scale based on measured bottlenecks.

### 2.2 User roles

A user may hold more than one role, including in different institutions.

- **Platform Super Admin:** platform-wide configuration and institution management.
- **Support Staff:** limited, audited support access.
- **Institution Owner/Admin:** institution settings, staff, academics, and reports.
- **Teacher:** classes, lessons, attendance, assignments, assessments, and grading.
- **Student:** enrolled classes/courses, lessons, attendance, assignments, exams, grades, and payments.
- **Guardian:** access to linked students’ permitted attendance, results, notices, and fees.
- **Accountant:** invoices, payment reconciliation, receipts, and financial reports.
- **Content Manager (optional):** course and learning-content administration.

Do not use a single `User.role` field as the entire authorization model. Use platform roles and institution-scoped memberships/permissions.

---

## 3. Recommended Technology Stack

| Layer | Recommendation | Purpose / notes |
|---|---|---|
| Framework | Next.js App Router | Routing, React server rendering, server-side application logic |
| Language | TypeScript | Safer refactoring and typed interfaces |
| UI | React | Component-based interfaces |
| Styling | Tailwind CSS | Consistent, responsive design |
| Component system | shadcn/ui | Accessible reusable UI components |
| Forms | React Hook Form + Zod | Form state and validation |
| Database | PostgreSQL | Relational application data |
| ORM | Prisma ORM | Typed database access and migrations |
| Authentication | Auth.js or Better Auth | Sessions, sign-in and identity flows; choose one after a proof of concept |
| Authorization | Application RBAC + institution scope | Resource-level permission checks |
| API | Next.js Route Handlers and service layer | HTTP endpoints and integrations |
| Rich text | Tiptap (optional) | Course descriptions and lesson content |
| Server-state cache | TanStack Query where useful | Client-side server state; avoid adding without a need |
| Recorded video | Mux or Cloudflare Stream | Encoding, adaptive playback, protected video access |
| Live classes | Zoom or Google Meet integration | Avoid building custom WebRTC infrastructure initially |
| File storage | S3-compatible storage such as Amazon S3 or Cloudflare R2 | Documents, attachments, exports |
| Local payments | SSLCommerz, bKash, or another eligible local gateway | Confirm merchant and payment-method eligibility |
| International payments | Stripe or another eligible provider | Availability, settlement, currencies, and business eligibility must be confirmed |
| Background jobs | Managed job service, or Redis + BullMQ | Email, reports, scheduled tasks, and retries |
| Cache / rate limits | Redis when required | Rate limiting, caching, job queue support |
| Email | Resend or another transactional email provider | Verification, notices, receipts |
| Testing | Vitest + Playwright | Unit, integration, and browser end-to-end tests |
| Monitoring | Sentry + structured logs | Error visibility and debugging |
| CI/CD | GitHub Actions | Lint, type checks, tests, and deployment workflow |
| Hosting | Managed Next.js hosting + managed PostgreSQL | Minimize early operational overhead |

### Stack selection rules

- Start with PostgreSQL and Prisma; do not add a second database without a clear need.
- Start with a single Next.js application and modular service layer.
- Add Redis only when caching, rate limiting, or background jobs justify it.
- Use managed video and live-class services initially.
- Confirm payment provider support, settlement, refunds, recurring billing, and currency handling before choosing the final provider.
- Pin compatible dependency versions and update them through reviewed pull requests.

---

## 4. High-Level Architecture

```text
Users
  |
  v
Next.js App Router
  |-- Public website / course catalog
  |-- Authentication
  |-- Platform admin
  |-- Institution workspaces
  |-- Student / teacher / guardian dashboards
  |
  v
Application service layer
  |-- Identity & access
  |-- Institutions & campuses
  |-- Admissions & academics
  |-- Attendance & timetable
  |-- LMS & assessments
  |-- Live learning
  |-- Billing & payments
  |-- Notifications & reports
  |
  +-----------> PostgreSQL via Prisma
  |
  +-----------> Object storage / CDN
  +-----------> Video provider
  +-----------> Live-class provider
  +-----------> Payment gateways / webhooks
  +-----------> Email provider
  +-----------> Background job runner
```

### Architectural principles

1. **Modular monolith first:** modules have clear boundaries and APIs within the codebase.
2. **Server-authoritative logic:** pricing, permissions, exam timing, and payment state are decided on the server.
3. **Tenant-aware data access:** every tenant-owned record is scoped to the active institution.
4. **Provider adapters:** payment, video, email, and live-class integrations sit behind interfaces.
5. **Async work:** reports, emails, bulk imports, and scheduled notices should not block normal page requests.
6. **Observable operations:** structured logs, error monitoring, health checks, and backups are part of the initial production plan.
7. **Measured scaling:** optimize from load-test and production metrics, not assumptions.

---

## 5. Multi-Institution / Multi-Tenant Design

The platform will serve multiple institutions. Each institution can have one or more campuses.

### Core rules

- `Institution` is the primary tenant boundary.
- `Campus` belongs to one institution.
- A `Membership` connects a user to an institution and defines the user’s institutional role/status.
- A person can have memberships in multiple institutions and multiple roles where allowed.
- Platform-wide roles are separate from institution roles.
- A URL slug identifies a requested institution but does **not** prove authorization.
- Every server action, route handler, service method, and data query must verify membership and permission.
- Never trust an `institutionId`, `userId`, role, price, or payment status sent by the browser.
- Where feasible, use composite constraints and/or PostgreSQL Row-Level Security as defense in depth. RLS policies require careful design and integration tests, especially with connection pooling.

### Suggested tenant-owned records

Most institution-owned models should contain `institutionId` directly or through a strongly enforced parent relationship. For security-sensitive and frequently queried tables, a direct tenant key can simplify filtering and indexing.

### Tenant-isolation tests

Create automated tests proving that:
- A teacher from Institution A cannot view or edit Institution B’s classes.
- A student cannot access another student’s submissions or grades.
- A guardian can only access explicitly linked students.
- An accountant cannot change academic grades unless separately authorized.
- A normal institution administrator cannot access platform-wide administration.
- Changing a URL slug or object ID cannot bypass authorization.

---

## 6. Functional Modules

### 6.1 Public website

- Home page, about, contact, and institution pages
- Public course catalog and course detail pages
- Search, categories, filters, and course previews
- SEO metadata and sitemap where appropriate
- Login, registration, and password/account recovery

### 6.2 Identity and access

- Sign up / invitation-based account creation
- Email or phone verification, depending on selected providers
- Secure session management and session revocation
- Password reset or passwordless flows as supported by the chosen auth library
- Optional multi-factor authentication
- Platform roles, institution roles, permissions, and resource checks
- Login attempt throttling and abuse protection

### 6.3 Institution management

- Create and configure institutions
- Institution type: school, college, or madrasah
- Campus management
- Academic calendar and academic years
- Institution branding and settings
- Staff invitations and membership management
- Institution status and plan/limits (if SaaS billing is introduced)

### 6.4 Admissions and student records

- Student profile and admission number
- Admission applications and approval workflow
- Academic year and class placement
- Student status and transfer history
- Guardian relationships
- Document upload with private access controls
- Bulk CSV import with validation and error reports

### 6.5 Academic management

- Academic years and terms/semesters
- Class levels, sections, subjects, and subject assignments
- Teacher-to-subject/class assignment
- Timetable, rooms, and class sessions
- Attendance records and correction audit trail
- Assessment schedules and grading scales
- Report cards and academic history
- Class promotion and year rollover workflow

### 6.6 LMS

- Course creation, editing, approval, and publication
- Course sections/modules and lessons
- Video, text, attachments, and downloadable resources
- Course prerequisites and enrollment rules (optional)
- Student progress and lesson completion
- Bookmarks and learning history
- Instructor analytics
- Course reviews (optional)

### 6.7 Live learning

- Schedule live sessions with time zone support
- Store provider meeting IDs, not publicly exposed credentials
- Generate or retrieve authorized join links
- Attendance through provider reports or controlled check-in
- Notifications before class
- Recording metadata and access rules
- Handle provider API failures and cancelled sessions

### 6.8 Assessment and exams

- Question bank and question types
- Quiz and exam configuration
- Randomized questions/options where appropriate
- Start/end windows and server-authoritative timers
- Attempt limits and submission validation
- Auto-grading for objective questions
- Manual grading and rubric support for written answers
- Assignment submission and file attachments
- Grade release, feedback, and appeals/corrections if needed
- Audit trail for grading changes

### 6.9 Fees, billing, and payments

- Tuition and course invoices
- Invoice line items and currency
- Payment attempts and provider references
- Receipts and payment history
- Partial payments if required
- Refund workflow and reconciliation
- Coupon/discount support where relevant
- Provider webhook handling and idempotency
- Separate institution fees from platform subscription/revenue if the business model requires both

### 6.10 Guardians and communications

- Verified guardian-student links
- Notices, announcements, and reminders
- Attendance and result visibility based on permissions
- In-app notifications and email
- Push/SMS notifications only when a provider and budget are selected

### 6.11 Certificates and reports

- Certificate templates and unique verification IDs
- Public verification page with minimal data exposure
- Student progress and attendance reports
- Academic results and finance reports
- CSV export with permission checks and audit logging
- Background generation for large reports

### 6.12 Platform operations

- Institution onboarding and suspension
- Support access with explicit permissions and audit logs
- Platform-level metrics
- Audit log search
- Feature flags and institution configuration
- Data export and retention workflows

---

## 7. Database Design

Use PostgreSQL as the source of truth. The list below is a logical model catalogue, not a complete production Prisma schema. Model names and relationships should be finalized before migrations are created.

### 7.1 Identity and authorization

- `User`
- `Account` and `Session` (as required by the chosen auth adapter)
- `PlatformRole` / `UserPlatformRole` or equivalent
- `Role`
- `Permission`
- `RolePermission`
- `Membership`
- `Invitation`
- `AuditLog`

Avoid relying on a single `User.role` field. Roles should be assigned at the correct scope.

### 7.2 Institutions and academics

- `Institution`
- `Campus`
- `AcademicYear`
- `Term` / `Semester`
- `ClassLevel`
- `Section`
- `Subject`
- `Room`
- `TeacherProfile`
- `StudentProfile`
- `GuardianProfile` (optional, depending on identity model)
- `GuardianStudent`
- `AdmissionApplication`
- `StudentEnrollment` (student-to-section/academic-year placement)
- `TeacherAssignment`
- `TimetableEntry`
- `ClassSession`
- `AttendanceRecord`
- `GradingScale`
- `Assessment`
- `Grade`
- `ReportCard`

**Important:** school/class enrollment and online-course enrollment are different concepts. Keep them in separate models.

### 7.3 LMS and content

- `Course`
- `CourseCategory`
- `CourseInstructor`
- `CourseSection`
- `Lesson`
- `MediaAsset`
- `LessonAttachment`
- `CourseEnrollment`
- `LessonProgress`
- `Bookmark`
- `Quiz`
- `Question`
- `AnswerOption`
- `QuizAttempt`
- `QuizResponse`
- `Assignment`
- `Submission`
- `Grade`
- `Certificate`

If a model named `Section` is already used for school class sections, name LMS curriculum modules `CourseSection` to avoid confusion.

### 7.4 Live learning

- `LiveClass`
- `LiveClassParticipant` (if required)
- `LiveClassAttendance`
- `ProviderMeetingReference`
- `RecordingAsset`

Store provider references and metadata securely. Do not expose provider credentials or privileged meeting data to unauthorized clients.

### 7.5 Finance

- `FeeStructure`
- `FeeInvoice`
- `InvoiceItem`
- `Payment`
- `PaymentAttempt`
- `PaymentProviderEvent` / `WebhookEvent`
- `Refund`
- `Coupon` (optional)
- `FinancialLedgerEntry` (only if a properly designed ledger is needed)

Use integer minor units or a carefully specified decimal representation for monetary amounts, always with a currency code. Do not use floating-point numbers for money. Decide how each currency is represented and validated.

### 7.6 Communication and system operations

- `Announcement`
- `Notification`
- `NotificationPreference`
- `EmailDelivery` (optional)
- `BackgroundJob` only if the job system requires application-level tracking
- `AuditLog`
- `ImportJob`
- `ExportJob`

### 7.7 Schema standards

- Use foreign keys and unique constraints to protect relationships.
- Add indexes based on actual query patterns, especially tenant scope and status.
- Use explicit `createdAt` and `updatedAt` timestamps where appropriate.
- Use soft deletion only where there is a clear retention/business need; do not soft-delete every table automatically.
- Preserve audit history for financial changes, grades, attendance corrections, and administrative actions.
- Use database transactions for related operations such as successful payment plus invoice update.
- Plan deletion, archival, privacy, and retention policies before production.

---

## 8. Prisma Starter Schema (Illustrative)

This is a **starter example**, not the full schema. It demonstrates institution membership and basic profiles. Add the remaining models and relations incrementally, and test the generated migrations.

```prisma
enum InstitutionType {
  SCHOOL
  COLLEGE
  MADRASAH
}

enum MembershipStatus {
  INVITED
  ACTIVE
  SUSPENDED
}

enum InstitutionRole {
  OWNER
  ADMIN
  TEACHER
  STUDENT
  GUARDIAN
  ACCOUNTANT
}

model User {
  id           String   @id @default(cuid())
  name         String
  email        String?  @unique
  phone        String?  @unique
  passwordHash String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  memberships Membership[]
  student     StudentProfile?
  teacher     TeacherProfile?
}

model Institution {
  id          String          @id @default(cuid())
  name        String
  slug        String          @unique
  type        InstitutionType
  createdAt   DateTime        @default(now())

  campuses    Campus[]
  memberships Membership[]
  courses     Course[]
}

model Campus {
  id            String      @id @default(cuid())
  institutionId String
  name          String

  institution   Institution @relation(
    fields: [institutionId],
    references: [id],
    onDelete: Restrict
  )
  sections      Section[]

  @@index([institutionId])
  @@unique([institutionId, name])
}

model Membership {
  id            String           @id @default(cuid())
  userId        String
  institutionId String
  role          InstitutionRole
  status        MembershipStatus @default(INVITED)
  createdAt     DateTime         @default(now())

  user          User        @relation(
    fields: [userId], references: [id], onDelete: Restrict
  )
  institution   Institution @relation(
    fields: [institutionId],
    references: [id],
    onDelete: Restrict
  )

  @@unique([userId, institutionId, role])
  @@index([institutionId, role, status])
}

model StudentProfile {
  id              String @id @default(cuid())
  userId          String @unique
  admissionNumber String @unique

  user User @relation(
    fields: [userId],
    references: [id],
    onDelete: Restrict
  )
}

model TeacherProfile {
  id             String @id @default(cuid())
  userId         String @unique
  employeeNumber String @unique

  user User @relation(
    fields: [userId],
    references: [id],
    onDelete: Restrict
  )
}

model Section {
  id         String @id @default(cuid())
  campusId   String
  name       String
  classLevel String

  campus Campus @relation(
    fields: [campusId],
    references: [id],
    onDelete: Restrict
  )

  @@unique([campusId, classLevel, name])
}

model Course {
  id            String   @id @default(cuid())
  institutionId String
  title         String
  slug          String
  published     Boolean  @default(false)
  createdAt     DateTime @default(now())

  institution Institution @relation(
    fields: [institutionId],
    references: [id],
    onDelete: Restrict
  )

  @@unique([institutionId, slug])
  @@index([institutionId, published])
}
```

### Before using this schema in production

- Confirm the chosen authentication provider’s required models and fields.
- Decide whether `email` and `phone` must be mandatory, and how verification works.
- Decide whether admission numbers are unique globally or only within an institution/campus/academic year. In most multi-tenant systems, scoped uniqueness is more flexible.
- Scope `employeeNumber`, student identifiers, and similar values correctly.
- Add tenant-safe relations, including composite constraints where useful.
- Do not treat `passwordHash` as proof that custom password authentication should be written; prefer the selected auth library’s supported integration.
- Add all academic, LMS, assessment, finance, live-class, and audit models before their feature migrations.

---

## 9. Suggested Project Folder Structure

```text
education-lms/
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
├── .github/
│   └── workflows/
├── .env.example
├── package.json
└── README.md
```

### Folder structure principles

- Keep `app/` focused on routing, layouts, and page composition.
- Keep business rules in modules/services rather than duplicating them across pages.
- Validate all external input with schemas.
- Keep provider adapters isolated from business logic.
- Never commit `.env` files containing secrets.
- Store only a safe `.env.example` with placeholder values.

---

## 10. Security Design

Security must be designed into the first release.

### 10.1 Authentication

- Use a maintained authentication library and supported adapter.
- Enforce secure cookies and appropriate session expiry/revocation.
- Verify email or phone when required by the account flow.
- Implement secure recovery and anti-enumeration protections.
- Consider MFA for platform and institution administrators.
- Apply rate limits and abuse detection to login, reset, invitation, and verification flows.

### 10.2 Authorization

- Check authorization on the server for every protected resource and mutation.
- Separate platform-wide roles from institution-specific roles.
- Validate membership status and active institution context.
- Verify resource ownership and relationship, not just the user’s role.
- Never rely on hiding buttons or protecting pages only in the UI.
- Use least privilege and audited support access.

### 10.3 Tenant isolation

- Scope queries by institution and, where relevant, campus and academic year.
- Test direct-object-reference attacks by changing IDs in requests.
- Consider PostgreSQL RLS as defense in depth, not a replacement for application authorization.
- Ensure background jobs and exports preserve tenant scope.
- Prevent cross-tenant leakage through cache keys, search results, logs, and generated file links.

### 10.4 Payments

- Calculate prices and invoice totals on the server.
- Verify provider webhook signatures and transaction status.
- Check amount, currency, order reference, and merchant reference.
- Make webhook processing idempotent.
- Use database transactions for financial state changes.
- Never trust a browser redirect as definitive payment confirmation.
- Restrict access to receipts, refunds, and financial reports.
- Keep provider secrets server-side and out of logs.

### 10.5 Exams and learning content

- Use server-authoritative exam timing and submission windows.
- Validate answer ownership and attempt limits.
- Protect answer keys until release is permitted.
- Use signed/private media access where supported.
- Check authorization for every file download and recording.
- Audit manual grade changes and attendance corrections.

### 10.6 Operational security

- Enforce HTTPS.
- Keep secrets in environment/secret management.
- Apply security headers and a carefully tested Content Security Policy.
- Validate and sanitize user input and rich text.
- Add upload size/type limits and malware scanning where appropriate.
- Encrypt backups and test restoration.
- Define retention, deletion, and incident-response procedures.
- Avoid logging passwords, access tokens, session cookies, or sensitive payment data.

---

## 11. Recorded Video and Live-Class Design

### Recorded video

Use a managed video provider such as Mux or Cloudflare Stream initially.

- Store provider asset ID, duration, processing status, and metadata.
- Store lesson relationships and visibility in PostgreSQL.
- Deliver video through the provider/CDN, not through the Next.js application server.
- Use signed playback or provider access controls where supported.
- Track progress with throttled updates and avoid writing on every playback event.
- Define how lesson completion is calculated.
- Keep uploaded documents in private object storage and serve them through authorized URLs.

### Live classes

Use Zoom or Google Meet integration before considering custom WebRTC.

- Store provider, meeting ID, schedule, status, and institution/course association.
- Store dates in UTC and display them in the institution/user’s intended time zone.
- Create or retrieve join links through server-side provider integration.
- Never expose provider API secrets to the browser.
- Notify participants before class and when schedules change.
- Record attendance using provider reports or controlled check-in, with a clear correction process.
- Handle cancellations, expired links, and provider outages gracefully.
- Apply recording access rules independently from meeting access rules.

---

## 12. Payment Architecture

Implement a provider-independent payment service so that gateways can be changed or added without rewriting course and fee logic.

### Provider adapter

A conceptual interface could look like:

```typescript
interface PaymentProvider {
  createCheckout(input: {
    orderId: string;
    amountMinor: bigint;
    currency: string;
  }): Promise<{
    checkoutUrl: string;
    providerReference: string;
  }>;

  verifyPayment(providerReference: string): Promise<{
    status: "PENDING" | "SUCCEEDED" | "FAILED";
    amountMinor: bigint;
    currency: string;
  }>;
}
```

This is an architectural illustration. Actual adapters must implement each provider’s documented request formats, signature verification, error handling, and currency rules.

### Payment lifecycle

1. Create an invoice/order on the server.
2. Persist a pending payment attempt.
3. Create the provider checkout session.
4. Receive the provider webhook.
5. Verify the signature and transaction with the provider as appropriate.
6. Validate order reference, amount, currency, and transaction state.
7. Update payment and invoice records in a database transaction.
8. Activate the enrollment or mark the fee paid only after verified success.
9. Generate a receipt and notify the user.
10. Make retries and duplicate webhook delivery safe through idempotency.

### Currency and accounting

- Never store money in floating-point fields.
- Store currency explicitly with every monetary amount.
- Use integer minor units or a rigorously defined decimal model.
- Keep original transaction currency and amount for audit/reconciliation.
- Define refund, partial-payment, and failed-payment workflows.
- Verify provider eligibility and settlement rules before production.

### Provider selection checklist

For each local or international provider, confirm:

- Business and merchant eligibility
- Supported payment methods
- Settlement account and settlement currency
- Fees and chargeback process
- Refund API and reconciliation support
- Webhook signature and retry behavior
- Recurring/subscription support, if required
- Sandbox availability and production approval

Do not assume a provider supports every payment method or subscription model.

---

## 13. Scaling to 10,000+ Students

### Database

- Use managed PostgreSQL with connection pooling.
- Index common filters such as tenant, status, academic year, course, and created date.
- Measure slow queries and use query plans to optimize them.
- Paginate large tables and reports.
- Use transactions for related state changes.
- Add read replicas or partitioning only when measured workload justifies them.

### Application

- Keep application instances stateless where possible.
- Move email, bulk import, exports, scheduled reminders, and heavy reports to background jobs.
- Avoid expensive computation in page rendering and request handlers.
- Use caching for appropriate read-heavy data, with tenant-aware cache keys and invalidation rules.
- Add rate limiting and backpressure for expensive endpoints.

### Video and files

- Use dedicated video hosting/CDN.
- Use object storage for attachments and exports.
- Do not proxy all video traffic through application servers.
- Keep private files private and generate short-lived authorized links.

### Capacity testing

Test realistic scenarios:

- Many students logging in at the same time
- Large class attendance updates
- Concurrent exam submissions near the deadline
- Course catalog traffic
- Payment webhook retries
- Bulk CSV imports and report generation
- Peak live-class join traffic

Measure response latency, error rate, database connections, query duration, job queue depth, and provider rate limits.

---

## 14. Testing and Quality Gates

### Unit tests

Test isolated business rules:

- Grade calculation
- Fee and discount calculation
- Enrollment eligibility
- Exam timing and attempt limits
- Permission decision helpers
- Payment state transitions

### Integration tests

Test:

- Database constraints and migrations
- Institution-scoped service queries
- Authentication adapter integration
- Payment webhook signature/idempotency handling
- File access control
- Background job retry behavior

### End-to-end tests

At minimum:

1. Institution admin creates a class and invites a teacher.
2. Teacher creates a course and lesson.
3. Student enrolls and completes a lesson.
4. Student submits an exam and receives a permitted result.
5. Guardian views only their linked student’s information.
6. Student starts a payment and the verified webhook updates the invoice.
7. Institution A users cannot access Institution B’s private data.

### Release quality gates

- Formatting and lint pass
- TypeScript type check passes
- Unit and integration tests pass
- Critical E2E tests pass
- No known high-severity dependency/security issue without an accepted mitigation
- Migration reviewed and tested against a staging database
- Backup and rollback plan documented for risky releases

---

## 15. Phased Implementation Roadmap

These are planning estimates, not guaranteed delivery dates. Team experience, scope, provider approvals, and existing code quality will affect delivery.

| Phase | Estimated time | Deliverables |
|---|---:|---|
| 1. Foundation and website migration | 1–2 weeks | Audit current site, Next.js scaffold, UI migration, PostgreSQL, Prisma, CI |
| 2. Identity and institutions | 2–3 weeks | Authentication, memberships, permissions, campuses, dashboards |
| 3. Academic ERP | 3–5 weeks | Admissions, academic years, classes, sections, subjects, attendance, timetable, grades |
| 4. LMS and assessments | 3–5 weeks | Courses, lessons, video, progress, quizzes, assignments, grading, certificates |
| 5. Live learning and payments | 2–4 weeks | Live provider integration, local gateway, eligible international gateway, webhooks, receipts |
| 6. Production hardening and scale | 2–4 weeks | Security testing, load tests, monitoring, backups, recovery drills, pilot rollout |

The phases can overlap when separate developers own well-defined modules. For a small team or a solo developer, allow additional time for QA, integrations, data modelling, and production support.

### Phase 1 — Foundation and existing website migration

- Inspect the current ZIP and inventory HTML, CSS, JS, SVGs, images, and external dependencies.
- Preserve useful branding, layout, and responsive behavior.
- Convert shared header, navigation, footer, cards, and forms into React components.
- Set up Next.js App Router and TypeScript.
- Set up Tailwind CSS and shadcn/ui.
- Configure PostgreSQL and Prisma.
- Add linting, formatting, environment validation, and CI.
- Create initial migration and safe development seed data.

### Phase 2 — Identity and institution foundation

- Select and integrate the authentication provider.
- Implement platform roles and institution memberships.
- Build institution/campus creation and configuration.
- Add authorization service helpers.
- Build admin, teacher, student, and guardian dashboard shells.
- Add tenant-isolation integration tests before broad feature work.

### Phase 3 — Academic ERP

- Academic years and terms
- Class levels, sections, and subjects
- Student admission and placement
- Teacher assignments
- Timetable and attendance
- Grading and report cards
- Guardian relationships and views
- Fee invoice foundation

### Phase 4 — LMS and assessment

- Course authoring and publication
- Lesson and media management
- Course enrollment and progress tracking
- Quiz and question bank
- Assignment submissions and grading
- Certificates and verification
- Instructor/student analytics

### Phase 5 — Live learning and payments

- Live-class provider integration
- Session scheduling and notifications
- Local payment integration and sandbox testing
- International gateway integration only after eligibility confirmation
- Verified webhooks, idempotency, receipts, refunds, reconciliation
- End-to-end payment tests

### Phase 6 — Production readiness

- Security review and tenant-isolation tests
- Load and concurrency testing
- Database and API optimization
- Monitoring, alerts, and structured logs
- Backup/restore rehearsal
- Staging acceptance tests
- Gradual pilot rollout and feedback cycle
- Production deployment and incident runbooks

---

## 16. Existing ZIP Migration Plan

The existing `Education-Website-main.zip` is the starting point. The project has been described as containing files such as:

- `index.html`
- `style.css`
- `responsive.css`
- `extra.css`
- `script.js`
- `Images/`
- `svgs/`

These names should be verified against the actual archive before implementation.

### Migration approach

1. Inventory all pages, assets, CSS rules, JavaScript behavior, fonts, and third-party dependencies.
2. Identify reusable design elements and any existing forms or interactions.
3. Preserve the current visual identity wherever practical.
4. Convert shared layout and UI into React components.
5. Create real routes for public pages and dashboards.
6. Replace placeholder/static data with server-backed features in phases.
7. Test responsive layouts and keyboard/accessibility behavior.
8. Remove obsolete scripts and dependencies after verifying no remaining usage.

Do not rebuild the entire UI unnecessarily. Migrate the useful presentation layer, but do not assume the existing static website already has a secure backend, authentication, database, or payment system.

---

## 17. Suggested Initial Development Backlog

### Sprint 0: Audit and decisions

- [ ] Inspect ZIP structure and list all pages/assets
- [ ] Confirm whether the platform is SaaS for multiple institutions
- [ ] Choose authentication provider
- [ ] Choose hosting and PostgreSQL provider
- [ ] Confirm local payment provider and merchant requirements
- [ ] Select recorded-video and live-class providers
- [ ] Document role/permission matrix
- [ ] Define first-release scope

### Sprint 1: Application foundation

- [ ] Create Next.js + TypeScript application
- [ ] Configure Tailwind CSS and shadcn/ui
- [ ] Configure environment validation
- [ ] Configure PostgreSQL and Prisma
- [ ] Add initial schema and migration
- [ ] Set up lint, typecheck, and test scripts
- [ ] Configure CI workflow
- [ ] Migrate public homepage and shared layout

### Sprint 2: Identity and tenant boundary

- [ ] Implement sign-in and account recovery
- [ ] Implement user and membership models
- [ ] Implement institution creation and campus management
- [ ] Implement server-side authorization helpers
- [ ] Add role-aware navigation
- [ ] Add tenant-isolation tests
- [ ] Add basic audit logging

### Sprint 3: Academic foundation

- [ ] Academic year and term models
- [ ] Class level, section, subject models
- [ ] Student and teacher profile flows
- [ ] Admissions and class placement
- [ ] Guardian relationships
- [ ] Attendance and timetable foundations

### Sprint 4 onward

- [ ] Build course authoring and lessons
- [ ] Add video and progress tracking
- [ ] Add quiz and assignment workflows
- [ ] Add billing and verified payment flow
- [ ] Add live-class scheduling
- [ ] Add reports and certificates
- [ ] Perform load/security testing and pilot deployment

---

## 18. Environment Variables

Use an `.env.example` file with placeholder values only. The exact names depend on selected providers.

```dotenv
NODE_ENV=development
APP_URL=http://localhost:3000

DATABASE_URL=
DIRECT_URL=

AUTH_SECRET=
AUTH_URL=http://localhost:3000

STORAGE_ENDPOINT=
STORAGE_BUCKET=
STORAGE_ACCESS_KEY_ID=
STORAGE_SECRET_ACCESS_KEY=

VIDEO_PROVIDER=
VIDEO_API_KEY=

LIVE_CLASS_PROVIDER=
LIVE_CLASS_CLIENT_ID=
LIVE_CLASS_CLIENT_SECRET=

PAYMENT_LOCAL_PROVIDER=
PAYMENT_LOCAL_STORE_ID=
PAYMENT_LOCAL_STORE_PASSWORD=

PAYMENT_INTERNATIONAL_PROVIDER=
PAYMENT_INTERNATIONAL_SECRET_KEY=

EMAIL_PROVIDER_API_KEY=
REDIS_URL=

SENTRY_DSN=
```

Notes:

- Never commit real credentials.
- Use the selected authentication library’s current environment variable names.
- Use separate sandbox and production credentials.
- Keep payment secrets and privileged provider keys on the server.
- Validate required environment variables at startup.
- `DIRECT_URL` is only needed if the chosen PostgreSQL provider/Prisma configuration requires a separate direct migration connection.

---

## 19. Definition of Done for the First Production Pilot

The first pilot should not be considered ready until:

- An institution can be created and configured.
- Admins can invite staff and manage roles.
- Students can be admitted and assigned to an academic class.
- Teachers can manage assigned classes.
- Attendance and basic academic records work end to end.
- Students can access authorized lessons and track progress.
- Assessment submission and grading work correctly.
- Payments are confirmed server-side before entitlements change.
- Tenant-isolation tests pass.
- Critical user flows have automated tests.
- Error monitoring and backups are configured.
- A restore test has been completed.
- Admin and support workflows are documented.
- Known limitations and incident response steps are documented.

---

## 20. Final Recommendation

Build this platform with:

**Next.js + TypeScript + PostgreSQL + Prisma + Tailwind CSS + shadcn/ui + secure institution-scoped RBAC + managed video/live services + provider-based payment adapters.**

Begin with the current website’s audit and design migration. Then implement authentication, institutions, tenant isolation, and academic management before adding the more complex LMS, exams, live classes, and payment workflows.

Keep the first release focused and production-safe. Add Redis, read replicas, partitioning, or separate services only when measured load or operational requirements justify them.

### Official documentation starting points

- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- PostgreSQL: https://www.postgresql.org/docs/
- Auth.js: https://authjs.dev/
- Better Auth: https://www.better-auth.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com/docs
- Playwright: https://playwright.dev/docs/intro
- Vitest: https://vitest.dev/guide/
- SSLCommerz: https://developer.sslcommerz.com/
- Mux: https://docs.mux.com/
- Cloudflare Stream: https://developers.cloudflare.com/stream/
- Stripe: https://docs.stripe.com/

**Document note:** This is an architecture and implementation blueprint. It is not yet a complete working codebase or a guarantee that every provider is available to the business. Confirm provider terms and current documentation before implementing integrations.
