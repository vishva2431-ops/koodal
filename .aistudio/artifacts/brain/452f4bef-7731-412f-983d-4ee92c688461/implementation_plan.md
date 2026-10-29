# Personal AI Job Search & Application Assistant

A secure, zero-cost (₹0), compliant personal job discovery and application platform tailored for React JS, Frontend, and Full Stack Developer roles across Tamil Nadu (Chennai, Coimbatore, Madurai, Trichy, Salem, and remote). The application automates matching, assisted submissions, root-cause recovery, and outreach without requiring paid AI APIs or violating portal access terms.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were confirmed during the initial requirement discovery:

- **Confirmed Decision 1 (Backend Architecture)**: Live preview Express REST API running seamlessly within this container to power all interactive frontend capabilities, accompanied by a complete, buildable, standalone Spring Boot 3 + MongoDB project tree (models, repositories, services, controllers, Spring Security configuration, and `pom.xml`) for production deployment.
- **Confirmed Decision 2 (Portal Discovery & Compliance)**: Multi-portal job discovery operates strictly within official boundaries: verified public RSS/JSON feeds, authorized job board integrations, compliant search link generators (Naukri, LinkedIn, Indeed with targeted Tamil Nadu filters), and a quick-capture job importer with duplicate detection. No unauthorized scraping, headless bots, or CAPTCHA bypasses.
- **Confirmed Decision 3 (Resume Text Extraction)**: Client-side PDF and DOCX text extraction with live review and editing before profile updates, guaranteeing complete privacy, offline resilience, and zero API costs.
- **Confirmed Decision 4 (AI-Free Matching Engine)**: Weighted rules-based matching engine evaluating skill overlap, experience levels, location suitability across Tamil Nadu, work arrangements, and salary expectations with transparent match breakdowns and missing skill diagnostics.

---

## 1. Overview & Core Concept

- **What It Does**: Centralizes personal job hunting across Naukri, LinkedIn, Indeed, and company career pages. Discovers Tamil Nadu tech jobs, calculates transparent match scores, validates profile readiness, guides assisted and authorized automatic submissions, diagnoses failed submissions with verifiable root-cause evidence, and generates one-click email and WhatsApp outreach.
- **Target User & Persona**: A personal software developer targeting React JS Developer, Frontend Developer, and Full Stack Developer roles across Tamil Nadu, operating on a strict ₹0 hosting budget.
- **Key Value**: Replaces chaotic manual job applications with an organized, evidence-backed workflow that ensures high application quality, zero TOS violations, and zero recurring cloud costs.

---

## 2. User Experience & Visual Design

Following the **Universal Frontend Design Constitution** and **SaaS Dashboard Guidelines**:

- **Layout Structure**:
  - **Sidebar Navigation (260px)**: Compact, accessible navigation with sections for:
    - *Overview*: Dashboard
    - *Job Hunting*: Discover Jobs, Selected Queue, Application Tracker
    - *Intelligence & Recovery*: Error & Recovery Center, Job Matcher
    - *Profile & Assets*: Profile Editor, Resume Manager, Outreach Templates
    - *System*: Standalone Spring Boot Files, Free-Tier Deployment & Costs
  - **Top Bar Contract**: Breadcrumb trail (`Job Assistant / Dashboard`), Active Tamil Nadu Location Scope, Quick Stats (Discovered, Ready, In Progress), and Profile Completeness Indicator.
  - **Main Viewport**: High-density, single-elevation cards with clean 1px hairline dividers (`border-slate-200 dark:border-slate-800`), tabular numerals for statistics, and zero decorative pills or fake telemetry.

- **Color Palette & Visual Restraint**:
  - *Dominant Canvas (60%)*: Neutral crisp slate background (`#F8FAFC` light, `#0F172A` dark).
  - *Structural Surfaces (30%)*: Crisp white cards (`#FFFFFF`) with subtle 1px slate borders (`#E2E8F0`).
  - *Accent Budget (10%)*: High-intent indigo (`#4F46E5`) for primary actions, emerald (`#059669`) for submitted status, amber (`#D97706`) for blocked/warning, and rose (`#E11D48`) for confirmed errors.
  - *Metadata & Badges*: Strict zero-pill discipline. Metadata rendered as unboxed typography with typographic dots (`React JS · Chennai · ₹6-10 LPA · Full-time`). Interactive filters use clean segmented controls.

- **Typography**:
  - Display and brand: `Plus Jakarta Sans`
  - Body and controls: `Plus Jakarta Sans` / `DM Sans`
  - Data tables, match percentages, timestamps: Monospace tabular numerals (`font-mono tabular-nums`)

---

## 3. Key Product Modules & Architectural Trade-Offs

### Module 1: Personal Dashboard & Metric Hub
- Real-time counters: Total Discovered, High Match ($\ge 75\%$), Selected for Application, Submitted, In Progress / Blocked, Failed / Uncertain.
- Multi-dimensional filter bar: Job Title, Location (Chennai, Coimbatore, Madurai, Trichy, Salem, Remote), Portal Source, Experience Level, Match Range, Application Status.
- Bulk actions: Select All in view, Prepare Batch, Export to CSV, Mark Status.

### Module 2: Profile & Resume Intelligence
- Comprehensive fields: Personal details, links (LinkedIn, GitHub, Portfolio), career preferences (roles, TN locations, notice period, expected CTC), technical skills (languages, frameworks, libraries, tools), projects, and education.
- Resume Manager: Upload PDF/DOCX, in-browser text extraction, editable extracted text review before saving, multiple resume version management, and profile completeness score (with blocking validation before application).

### Module 3: Multi-Portal Job Discovery Engine
- Dedicated source adapters:
  - **Naukri**: Official search link generator with Tamil Nadu location IDs, authorized XML/RSS feeds, and deep direct portal links.
  - **LinkedIn**: Compliant boolean query generator (`React AND (Chennai OR Coimbatore OR "Tamil Nadu")`), direct application search URLs, and quick manual job-spec parser.
  - **Indeed**: Compliant query builder with location radius, publisher feed parser, and direct application links.
  - **Company Career Portals & Custom Feeds**: Direct import via URL or structured paste, normalization, and duplicate detection (hash of title + company + normalized location).
- Demo Mode Toggle: Clear visual distinction between live verified feeds and labeled sample demo data for Tamil Nadu roles.

### Module 4: Rules-Based AI-Free Matching Engine
- Multi-factor scoring algorithm:
  - Skill Match (50%): Exact and synonym matching across technical stack (e.g. React.js, Next.js, TypeScript, Tailwind, REST API, Node.js).
  - Location Preference (20%): Exact match for Chennai, Coimbatore, Madurai, Trichy, or Remote.
  - Experience Level (15%): Matches years required against profile experience.
  - Work Arrangement & Role Type (15%): Remote/Hybrid/On-site compatibility.
- Transparent score breakdown modal: Shows matching skills, missing skills, and detailed rationale explaining why the score was assigned.

### Module 5: Application Workflow & Submission Engine
- Strict two-tier submission workflow:
  1. *Tier 1 (Officially Authorized Automatic Submission)*: Active only when an official API key or authorized webhook endpoint is configured for that portal.
  2. *Tier 2 (Assisted Submission)*: Opens the official application page, auto-copies tailored answers and cover letter, validates profile prerequisites, and guides user to record confirmation ID upon completion.
- Safeguards: Prevents duplicate applications, flags unverified declarations (salary, legal, notice period), and records timestamped audit trails.

### Module 6: Root-Cause Analysis & Recovery Center
- Strict categorization of interrupted applications:
  - Statuses: `READY`, `IN_PROGRESS`, `SUBMITTED`, `BLOCKED`, `FAILED`, `SUBMISSION_UNKNOWN`.
  - Evidence-backed error tracking: Failure Stage, Error Code, Verifiable Evidence, Confirmed Root Cause vs. Likely Cause, Recovery Action, Retry Safety Flag.
  - Explicit "Cause not confirmed" designation for network timeouts or ambiguous third-party portal responses. Never retries uncertain submissions blindly.

### Module 7: Outreach & Message Templates
- Customizable templates with safe variable substitution (`{{jobTitle}}`, `{{companyName}}`, `{{yourName}}`, `{{skills}}`, `{{portfolioUrl}}`).
- One-click actions: Open prefilled `mailto:` client draft and prefilled WhatsApp Web link (`https://wa.me/?text=...`) for personal review before sending. Zero unsolicited automation, ₹0 cost.

### Module 8: Application Tracker & CSV Export
- Searchable, sortable tracking table with status filters, resume version used, notes editor, follow-up scheduler, and one-click RFC 4180 compliant CSV export.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                   React + Vite Frontend (Port 3000)                    │
│                                                                        │
│  ┌─────────────────────────┐  ┌─────────────────────────────────────┐  │
│  │   Navigation Sidebar    │  │  Top Bar: Context & Readiness       │  │
│  └───────────┬─────────────┘  └──────────────────┬──────────────────┘  │
│              │                                   │                     │
│  ┌───────────▼───────────────────────────────────▼──────────────────┐  │
│  │ Active Views:                                                    │  │
│  │  • Dashboard & KPIs          • Job Discovery & Filters           │  │
│  │  • Profile & Resume Extractor• Matching Engine Breakdown         │  │
│  │  • Assisted Application Flow • Error & Recovery Center           │  │
│  │  • Outreach & Templates      • Application Tracker & CSV Export  │  │
│  │  • Spring Boot Project Tree  • Zero-Cost Hosting & Limits Guide  │  │
│  └───────────────────────────┬──────────────────────────────────────┘  │
│                              │                                         │
│  ┌───────────────────────────▼──────────────────────────────────────┐  │
│  │ State Layer: React Context + LocalStorage / IndexedDB            │  │
│  │  (Zero-latency, offline-first, instant ₹0 zero-setup persistence)│  │
│  └───────────────────────────┬──────────────────────────────────────┘  │
└──────────────────────────────┼─────────────────────────────────────────┘
                               │ Axios REST API Calls (/api/*)
┌──────────────────────────────▼─────────────────────────────────────────┐
│              Live Preview Express Backend (server.ts)                  │
│                                                                        │
│  • Profile endpoints:        GET/PUT /api/profile                      │
│  • Resume parser endpoint:   POST /api/profile/resume/extract          │
│  • Job discovery endpoints:  GET /api/jobs, POST /api/jobs/refresh     │
│  • Application workflow:     POST /api/applications/prepare            │
│  • Outcome & Recovery:       POST /api/applications/:id/outcome        │
│  • Templates & Outreach:     GET/POST/PUT/DELETE /api/templates        │
│  • Spring Boot Exporter:     GET /api/backend/code-bundle              │
└────────────────────────────────────────────────────────────────────────┘
                               ▲
                               │ Direct 1:1 Parity
┌──────────────────────────────┴─────────────────────────────────────────┐
│     Complete Standalone Spring Boot 3 + MongoDB Project Tree           │
│                                                                        │
│  ├── pom.xml (Java 21, Spring Boot 3.3.x, Spring Data MongoDB)         │
│  ├── src/main/resources/application.yml (MongoDB Atlas URI, Security)  │
│  ├── src/main/java/com/jobassistant/                                   │
│  │   ├── config/ (SecurityConfig, MongoConfig, WebCorsConfig)          │
│  │   ├── controller/ (JobController, ProfileController, AppController) │
│  │   ├── model/ (JobListing, Profile, ApplicationRecord, ErrorRecord)  │
│  │   ├── repository/ (JobRepository, ProfileRepository, etc.)          │
│  │   └── service/ (MatchingEngineService, ApplicationService)          │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Models & Schemas

1. **Profile**:
   `id`, `fullName`, `email`, `phone`, `currentLocation`, `linkedInUrl`, `gitHubUrl`, `portfolioUrl`, `preferredRoles[]`, `preferredLocations[]` (e.g., Chennai, Coimbatore, Madurai, Trichy, Salem, Remote), `workArrangement`, `experienceYears`, `expectedSalaryMin`, `expectedSalaryMax`, `noticePeriodDays`, `skills[]`, `projects[]`, `education[]`, `resumeVersions[]`, `completenessScore`.
2. **JobListing**:
   `id`, `title`, `company`, `location`, `description`, `requiredSkills[]`, `experienceMin`, `experienceMax`, `salary`, `employmentType`, `workArrangement`, `source` (Naukri, LinkedIn, Indeed, Company), `originalUrl`, `dateDiscovered`, `applicationMethod` (DIRECT_URL, AUTHORIZED_API, EMAIL), `status` (OPEN, EXPIRED), `isDemoData`.
3. **ApplicationRecord**:
   `id`, `jobId`, `jobTitle`, `company`, `source`, `status` (`READY`, `IN_PROGRESS`, `SUBMITTED`, `BLOCKED`, `FAILED`, `SUBMISSION_UNKNOWN`), `resumeVersionId`, `appliedDate`, `confirmationReference`, `coverLetterUsed`, `notes`, `followUpDate`.
4. **ErrorLog**:
   `id`, `applicationId`, `jobId`, `source`, `timestamp`, `stage`, `errorCode`, `errorMessage`, `evidence`, `rootCauseConfirmed` (boolean), `causeDescription`, `recoveryAction`, `isSafeToRetry`.
5. **MessageTemplate**:
   `id`, `name`, `type` (EMAIL, WHATSAPP, FOLLOW_UP, COVER_LETTER), `subject`, `body`, `isDefault`.

---

## 5. Free-Tier Deployment & ₹0 Cost Verification Guide

A dedicated in-app documentation module and deployment audit checklist:
- **MongoDB Atlas**: M0 Shared Free Cluster (512MB storage, free forever, no credit card required).
- **Backend (Spring Boot)**: Deployable to Render free web service or Railway free tier, Fly.io, or Oracle Cloud Always Free compute.
- **Frontend (React)**: Deployable to Vercel, Netlify, Cloudflare Pages, or GitHub Pages ($0/month, unlimited bandwidth for personal use).
- **Free Subdomain Strategy**: `*.onrender.com`, `*.vercel.app`, `*.pages.dev`.
- **Pre-Launch Zero-Cost Checklist**:
  1. MongoDB Atlas cluster is confirmed on tier `M0 Free`.
  2. Spring Boot backend uses internal environment variables without paid add-ons.
  3. No third-party paid AI APIs (Gemini/OpenAI) required for core matching.
  4. WhatsApp outreach uses free `wa.me` links without paid Twilio/Meta Business API fees.
  5. Cold start tolerance noted (free web services spin down after inactivity, ~30-50s initial wake-up).

---

## 6. Execution Plan & Stages

- **Stage 1 (UI & Interaction Architecture)**:
  - Set up routing, full Tailwind styling, responsive sidebar navigation, and modern top bar.
  - Implement comprehensive Personal Dashboard with dynamic counters, multi-attribute filter bar, batch selection, and Tamil Nadu target presets.
- **Stage 2 (Profile, Resume Text Extraction & Zero-Cost Parser)**:
  - Build the Profile Editor with validation and completion indicator.
  - Implement client-side PDF/DOCX file uploader with text extraction preview and editable field mapper.
- **Stage 3 (Multi-Portal Job Discovery & Rules-Based Matcher)**:
  - Implement adapters for Naukri, LinkedIn, Indeed, and Company feeds with duplicate detection.
  - Implement transparent, AI-free scoring engine with matching and missing skills diagnostics.
- **Stage 4 (Assisted & Authorized Application Workflows & Recovery Center)**:
  - Build application preparation modal, prerequisite validator, and confirmation recorder.
  - Build the comprehensive Error & Recovery Center with evidence-based diagnostics and safe retries.
- **Stage 5 (Outreach Templates & Application Tracker with CSV Export)**:
  - Implement editable message template manager with prefilled mailto and WhatsApp generator.
  - Implement Application Tracker table with status editing, follow-up reminders, and CSV download.
- **Stage 6 (Live REST API & Standalone Spring Boot 3 MongoDB Project)**:
  - Build the live Express server endpoints in `/server.ts` for full preview execution.
  - Provide complete, cleanly structured Spring Boot 3 Java files (`pom.xml`, controllers, models, security config, services) downloadable/viewable in-app.
  - Verify complete build with `compile_applet`.
