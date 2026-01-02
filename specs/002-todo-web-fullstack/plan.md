# Implementation Plan: Full-Stack Todo Web Application

**Feature Branch**: `002-todo-web-fullstack`
**Created**: 2026-01-02
**Status**: Draft
**Related Documents**: spec.md, data-model.md, migration-strategy.md

---

## Technical Context

### Technology Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|
| Framework | Next.js | 14.0 | Full-stack React framework |
| UI Library | React | 18.2 | Component library |
| Language | TypeScript | 5.3 | Type safety |
| Styling | Tailwind CSS | 3.4 | Utility-first CSS |
| Database | Neon PostgreSQL | Latest | Serverless managed database |
| ORM | Prisma | 5.7 | Type-safe database access |
| Validation | Zod | 3.22 | Schema validation |
| Authentication | Better Auth | Latest | Modern auth solution |
| Icons | Lucide React | 0.294 | Icon library |
| Animations | Framer Motion | 10.16 | Animation library |
| State Management | React Context | Built-in | Local state |
| Server Data | React Query | 5.28 | Server state synchronization |

### Project Structure

```
web-app/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/
│   │   │   ├── auth/        # Authentication endpoints
│   │   │   │   ├── signup/route.ts
│   │   │   │   ├── signin/route.ts
│   │   │   │   ├── signout/route.ts
│   │   │   │   └── session/route.ts
│   │   │   └── tasks/         # Task CRUD endpoints
│   │   │       ├── route.ts      # GET /api/tasks
│   │   │       ├── [id]/route.ts # GET /api/tasks/:id
│   │   │       ├── route.ts      # POST /api/tasks
│   │   │       ├── [id]/route.ts # PUT /api/tasks/:id
│   │   │       ├── [id]/route.ts # DELETE /api/tasks/:id
│   │   │       └── [id]/status/route.ts # PATCH /api/tasks/:id/status
│   │   ├── layout.tsx            # Root layout with auth provider
│   │   ├── page.tsx              # Dashboard (main page)
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── TaskCard.tsx       # Individual task card
│   │   ├── TaskForm.tsx       # Add/edit task modal
│   │   ├── TaskList.tsx        # Task list with filters
│   │   ├── FilterBar.tsx       # Search and filter controls
│   │   ├── ProgressIndicator.tsx # Progress tracking
│   │   └── ThemeToggle.tsx    # Dark/light mode
│   ├── lib/
│   │   ├── db.ts               # Prisma client
│   │   ├── auth.ts             # Better Auth configuration
│   │   └── utils.ts            # Utility functions
│   └── context/
│       └── TodoContext.tsx    # Global state management
├── prisma/
│   └── schema.prisma             # Database schema
├── public/                         # Static assets
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── tailwind.config.ts              # Tailwind config
├── next.config.js                   # Next.js config
└── README.md                        # Documentation
```

### External Services

| Service | Purpose | Configuration |
|---------|---------|-------------|
| Neon PostgreSQL | Primary database | `DATABASE_URL` env variable |
| Better Auth | Authentication | `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` |
| Vercel | Deployment | Auto-deployment from git push |

---

## Architecture Overview

### Layered Architecture

```
┌─────────────────────────────────────────┐
│         Presentation Layer (React)        │
├──────────────────────────────────────────┤
│       Application Layer (Next.js API)     │
├──────────────────────────────────────────┤
│     Data Access Layer (Prisma ORM)    │
├──────────────────────────────────────────┤
│       Neon PostgreSQL Database              │
└─────────────────────────────────────────┘
```

### Request Flow

```
Client (Browser)
    │
    ├─ GET /api/tasks
    ├─ POST /api/tasks
    ├─ GET /api/tasks/:id
    ├─ PUT /api/tasks/:id
    ├─ DELETE /api/tasks/:id
    ├─ PATCH /api/tasks/:id/status
    │
    ↓ API Routes
    │
    ├─ Validation (Zod schemas)
    ├─ Authentication Check (middleware)
    │
    ↓ Prisma ORM
    │
    ↓ Neon PostgreSQL
```

---

## Constitution Check

### Applicable Principles

| Principle | Status | Compliance |
|-----------|--------|-------------|
| V. Persistent Storage | ✅ COMPLIANT | Phase II uses Neon PostgreSQL |
| VII. Multi-User Support | ✅ COMPLIANT | Phase II supports multiple users via Better Auth |
| IV. Terminal UI Excellence | N/A | Not applicable to web application |
| III. REPL Architecture | N/A | Not applicable to web application |
| II. Single User, Single Session | ✅ COMPLIANT | Users isolated by user_id foreign keys |
| I. Incremental Evolution | ✅ COMPLIANT | Phase II builds on Phase I concepts |

**Conclusion**: All applicable constitution principles from Phase I are maintained in Phase II.

---

## Dependencies

### External Dependencies

| Dependency | Version | Purpose | Integration Point |
|-----------|----------|---------|-------------------|
| @prisma/client | 5.7 | Database access | API routes |
| next-auth | Latest | Better Auth | auth endpoints |
| better-auth | Latest | Better Auth | Session management |
| zod | 3.22 | Schema validation | API routes |
| lucide-react | 0.294 | Icons | Components |
| framer-motion | 10.16 | Animations | Components |
| @auth/prisma-adapter | Latest | Prisma adapter for Better Auth | Auth |
| next-auth/core | Latest | Auth core utilities | Auth |

### Internal Dependencies

| Module | Purpose | Location |
|--------|-------|----------|
| src/lib/db.ts | Prisma client initialization | lib/db.ts |
| src/lib/auth.ts | Better Auth configuration | lib/auth.ts |
| src/middleware/auth.ts | Authentication middleware | middleware/ |
| src/context/TodoContext.tsx | State management | context/ |

---

## Implementation Phases

### Phase 1: Project Setup (Week 1)

#### Tasks
- [ ] T001 Create Next.js project structure
- [ ] T002 Install and configure Prisma
- [ ] T003 Set up Neon PostgreSQL database connection
- [ ] T004 Configure Better Auth environment variables
- [ ] T005 Create base TypeScript configuration
- [ ] T006 Set up Tailwind CSS configuration
- [ ] T007 Configure Next.js for optimal performance

#### Acceptance Criteria
- [ ] Next.js project builds successfully
- [ ] Prisma client can connect to Neon database
- [ ] Tailwind CSS generates styles correctly
- [ ] TypeScript compilation succeeds with no errors
- [ ] Environment variables are documented in .env.example

---

### Phase 2: Database Schema & Models (Week 1)

#### Tasks
- [ ] T008 Create Prisma schema with User, Session, and Task models
- [ ] T009 Define indexes for optimal query performance
- [ ] T010 Set up database relationship cascades
- [ ] T011 Run initial database migration
- [ ] T012 Create TypeScript types for all entities

#### Deliverables
- `prisma/schema.prisma` - Complete schema with models
- `src/types/index.ts` - TypeScript interfaces
- Database migration file (auto-generated by Prisma)

#### Acceptance Criteria
- [ ] Schema compiles without errors
- [ ] Prisma generates correct TypeScript types
- [ ] Migration creates tables successfully in Neon
- [ ] Indexes are created and verified via SQL

---

### Phase 3: Authentication System (Week 2)

#### Tasks
- [ ] T013 Install and configure Better Auth
- [ ] T014 Set up OAuth providers (Google, GitHub)
- [ ] T015 Create authentication middleware for protected routes
- [ ] T016 Implement session management
- [ ] T017 Create auth utility functions
- [ ] T018 Set up auth context for React

#### Acceptance Criteria
- [ ] Users can register with email/password
- [ ] Users can authenticate with Google OAuth
- [ ] Users can authenticate with GitHub OAuth
- [ ] Sessions are created and validated on successful auth
- [ ] Sessions are invalidated on logout
- [ ] Protected routes return 401 for unauthenticated users

---

### Phase 4: API Routes - Authentication (Week 2)

#### Tasks
- [ ] T019 Create POST /api/auth/signup endpoint
- [ ] T020 Create POST /api/auth/signin endpoint
- [ ] T021 Create POST /api/auth/signout endpoint
- [ ] T022 Create GET /api/auth/session endpoint
- [ ] T023 Set up OAuth callback routes
- [ ] T024 Implement Zod validation for auth requests

#### Acceptance Criteria
- [ ] All auth endpoints return appropriate status codes
- [ ] Invalid credentials return generic error messages
- [ ] Successful auth creates secure sessions
- [ ] OAuth flows redirect to callback URLs correctly

---

### Phase 5: API Routes - Tasks (Week 3)

#### Tasks
- [ ] T025 Create GET /api/tasks endpoint (list all)
- [ ] T026 Create GET /api/tasks/:id endpoint (get one)
- [ ] T027 Create POST /api/tasks endpoint (create)
- [ ] T028 Create PUT /api/tasks/:id endpoint (update)
- [ ] T029 Create DELETE /api/tasks/:id endpoint (delete)
- [ ] T030 Create PATCH /api/tasks/:id/status endpoint (toggle)
- [ ] T031 Implement Zod validation schemas for task operations
- [ ] T032 Add error handling for common scenarios

#### Acceptance Criteria
- [ ] All CRUD endpoints functional
- [ ] Users can only access their own tasks (user_id filtering)
- [ ] Tasks are validated (title required, description limits)
- [ ] Error responses follow JSON format
- [ ] Appropriate HTTP status codes (200, 201, 400, 404, 500)

---

### Phase 6: Core UI Components (Week 4)

#### Tasks
- [ ] T033 Create ThemeToggle component
- [ ] T034 Create FilterBar component
- [ ] T035 Create ProgressIndicator component
- [ ] T036 Create TaskCard component
- [ ] T037 Create TaskForm component
- [ ] T038 Create TaskList component

#### Acceptance Criteria
- [ ] All components are TypeScript with proper types
- [ ] Components use Tailwind CSS classes
- [ ] Components are accessible (ARIA labels, keyboard navigation)
- [ ] Components are responsive (mobile, tablet, desktop)
- [ ] Components use Lucide icons correctly

---

### Phase 7: Layout & Pages (Week 4)

#### Tasks
- [ ] T039 Create root layout.tsx with Better Auth provider
- [ ] T040 Create globals.css with glassmorphism styles
- [ ] T041 Create main page.tsx (dashboard)
- [ ] T042 Create authentication pages (signin, signup)
- [ ] T043 Set up routing configuration

#### Acceptance Criteria
- [ ] Layout wraps application with Better Auth
- [ ] Dark/light mode is applied globally
- [ ] Pages load within 3 seconds
- [ ] Responsive layout works on all screen sizes

---

### Phase 8: Integration & Polish (Week 5)

#### Tasks
- [ ] T044 Connect frontend to API routes
- [ ] T045 Implement optimistic UI updates with React Query
- [ ] T046 Add loading states for async operations
- [ ] T047 Add error notifications (toasts)
- [ ] T048 Implement drag-and-drop reordering
- [ ] T049 Add confirmation dialogs for destructive actions
- [ ] T050 Optimize for performance (code splitting, lazy loading)

#### Acceptance Criteria
- [ ] Frontend successfully consumes all API endpoints
- [ ] UI updates are reflected within 100ms
- [ ] Error states are handled gracefully
- [ ] Drag-and-drop works smoothly
- [ ] Confirmation dialogs prevent accidental deletions

---

### Phase 9: Testing (Week 6)

#### Tasks
- [ ] T051 Write unit tests for API routes
- [ ] T052 Write component tests
- [ ] T053 Write integration tests for auth flow
- [ ] T054 Write E2E tests with Playwright
- [ ] T055 Set up test database (or use test environment)

#### Acceptance Criteria
- [ ] Unit test coverage > 80%
- [ ] All user stories have passing tests
- [ ] E2E tests cover critical paths (auth, CRUD)
- [ ] Accessibility tests pass WCAG AA
- [ ] Performance tests meet NFR-001 (< 500ms response time)

---

### Phase 10: Deployment (Week 6)

#### Tasks
- [ ] T056 Configure Vercel deployment
- [ ] T057 Set up environment variables for production
- [ ] T058 Configure Neon database for production
- [ ] T059 Set up Better Auth production configuration
- [ ] T060 Test deployment in staging environment
- [ ] T061 Deploy to production

#### Acceptance Criteria
- [ ] Application is accessible via Vercel URL
- [ ] Database connection works in production
- [ ] Better Auth OAuth providers are configured
- [ ] All environment variables are set securely
- [ ] Application responds to health checks

---

## Task Execution Order

### Dependencies

1. **Must Complete Before** (Sequential):
   - Phase 2 (Database) → Phase 3 (Auth) → Phase 4 (Auth API) → Phase 5 (Task API)
   - Phase 3 and 4 can partially proceed in parallel
   - Phase 5 (Task API) → Phase 6 (UI) → Phase 7 (Layout) → Phase 8 (Integration)

2. **Can Run in Parallel**:
   - Phase 4 (Auth API) and Phase 5 (Task API) - both depend on Phase 3 (Auth)
   - Phase 6 (UI) and Phase 7 (Layout) - both depend on Phase 5 (Task API)

### Parallel Execution Strategy

- **Weeks 1-2**: Sequential (foundational layers first)
- **Weeks 3-4**: Parallel where possible to accelerate development
- **Weeks 5**: Sequential (integration and testing)
- **Weeks 6**: Sequential (deployment only)

---

## Risk Mitigation

### Identified Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Better Auth Configuration** | Medium | Use Better Auth documentation; test auth flow early |
| **Prisma Schema Migration** | High | Test migrations in development before production; use reversible migrations |
| **Performance Bottlenecks** | Medium | Profile queries with EXPLAIN; add indexes early; implement pagination |
| **TypeScript Complexity** | Low | Use strict mode; leverage Prisma auto-generated types |
| **OAuth Provider Downtime** | Low | Provide clear error messaging if providers unavailable; allow email/password fallback |
| **Database Connection Limits** | Medium | Use connection pooling; implement retry logic with exponential backoff |
| **Responsive Design Challenges** | Medium | Test on real devices early; use Tailwind responsive utilities |
| **Authentication Security** | High | Use HttpOnly, Secure, SameSite cookies; implement CSRF protection; hash passwords with bcrypt |

### Rollback Plan

- Vercel preview deployments can be rolled back instantly
- Prisma migrations are reversible (use `migrate resolve`)
- Database can be restored from automated backups (30-day retention)
- Feature flags can be used to disable new features if issues arise

---

## Success Criteria

### Overall Metrics

- [ ] All Phase 1-9 tasks completed successfully
- [ ] Application is deployed to production
- [ ] All functional requirements met (FR-001 to FR-070)
- [ ] All non-functional requirements met (NFR-001 to NFR-030)
- [ ] User stories can be completed independently and tested
- [ ] Accessibility audit passes WCAG 2.1 AA
- [ ] Performance benchmarks met (API < 500ms p95, load < 3s)

### Milestone Markers

- **Week 2**: Database and authentication ready
- **Week 4**: API endpoints functional
- **Week 5**: UI components complete
- **Week 6**: Integration and testing complete
- **Week 6**: Production deployment

---

## Notes

### Key Design Decisions

**Better Auth Integration**:
- Using server-side session management for security
- Supporting both email/password and OAuth
- HttpOnly cookies prevent XSS attacks

**Database Design**:
- UUIDs instead of auto-increment for scalability
- Foreign keys with CASCADE for referential integrity
- Indexed columns for query performance

**State Management**:
- React Context for UI state
- React Query for server state synchronization
- Optimistic updates for better UX

**UI/UX Approach**:
- Glassmorphism for modern aesthetic
- Dark/light mode with system preference detection
- Responsive design with mobile-first approach
- Accessible components with ARIA labels

### Development Workflow

1. **Feature Branching**: Each major feature in separate branch
2. **Pull Requests**: Code review required before merge
3. **Testing**: All changes must pass tests before merge
4. **Documentation**: Update README for new features
5. **Deployment**: Auto-deploy via Vercel on merge to main

---

## Conclusion

This implementation plan provides a phased approach to building the full-stack Todo web application, starting with foundational infrastructure and progressing through authentication, API development, UI components, and finally testing and deployment. Each phase builds upon the previous, with clear acceptance criteria and risk mitigation strategies.

**Estimated Timeline**: 6 weeks for full implementation
**Total Tasks**: 61 (T001 to T061)
**Parallel Opportunities**: Phase 4 and 5 can run concurrently with Phase 3
