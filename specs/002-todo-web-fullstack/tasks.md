# Tasks: Full-Stack Todo Web Application

**Input**: Design documents from `/specs/002-todo-web-fullstack/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md
**Tests**: NOT requested in feature specification - no test tasks included

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create Next.js project structure in web-app/
- [ ] T002 Install and configure Prisma in web-app/package.json
- [ ] T003 Set up Neon PostgreSQL database connection in web-app/.env.example
- [ ] T004 Configure Better Auth environment variables in web-app/.env.example
- [ ] T005 Create base TypeScript configuration in web-app/tsconfig.json
- [ ] T006 Set up Tailwind CSS configuration in web-app/tailwind.config.ts
- [ ] T007 [P] Configure Next.js for optimal performance in web-app/next.config.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T008 Create Prisma schema with User, Session, and Task models in web-app/prisma/schema.prisma
- [ ] T009 Define indexes for optimal query performance in web-app/prisma/schema.prisma
- [ ] T010 Set up database relationship cascades in web-app/prisma/schema.prisma
- [ ] T011 Run initial database migration via npx prisma migrate dev
- [ ] T012 Create TypeScript types for all entities in web-app/src/types/index.ts
- [ ] T013 [P] Install and configure Better Auth in web-app/src/lib/auth.ts
- [ ] T014 Create Prisma client instance in web-app/src/lib/db.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Registration and Authentication (Priority: P1) 🎯 MVP

**Goal**: Enable users to register, login securely, and maintain persistent sessions with OAuth support

**Independent Test**: Register a new user, log in, verify session persistence across page refreshes, confirm tasks created by one user are not visible to another user

### Implementation for User Story 1

- [ ] T015 [P] Set up OAuth providers (Google, GitHub) in web-app/src/lib/auth.ts
- [ ] T016 Create authentication middleware for protected routes in web-app/src/middleware.ts
- [ ] T017 Implement session management utilities in web-app/src/lib/auth.ts
- [ ] T018 [P] Create POST /api/auth/signup endpoint in web-app/src/app/api/auth/signup/route.ts
- [ ] T019 [P] Create POST /api/auth/signin endpoint in web-app/src/app/api/auth/signin/route.ts
- [ ] T020 [P] Create POST /api/auth/signout endpoint in web-app/src/app/api/auth/signout/route.ts
- [ ] T021 [P] Create GET /api/auth/session endpoint in web-app/src/app/api/auth/session/route.ts
- [ ] T022 [P] Set up OAuth callback route for Google in web-app/src/app/api/auth/callback/google/route.ts
- [ ] T023 [P] Set up OAuth callback route for GitHub in web-app/src/app/api/auth/callback/github/route.ts
- [ ] T024 Implement Zod validation schemas for auth requests in web-app/src/lib/schemas/auth.ts
- [ ] T025 Create auth utility functions in web-app/src/lib/auth.ts
- [ ] T026 Set up auth context for React in web-app/src/context/AuthContext.tsx
- [ ] T027 Create signup page in web-app/src/app/signup/page.tsx
- [ ] T028 Create signin page in web-app/src/app/signin/page.tsx
- [ ] T029 Add error handling for auth scenarios in web-app/src/lib/auth.ts

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Task Creation and Management (Priority: P1) 🎯 MVP

**Goal**: Enable users to create, view, edit, and delete tasks through modern web interface

**Independent Test**: Create tasks via web UI, view them in task list, edit task details, delete tasks, verify all operations persist to database

### Implementation for User Story 2

- [ ] T030 [P] Create TaskCard component in web-app/src/components/TaskCard.tsx
- [ ] T031 [P] Create TaskForm component in web-app/src/components/TaskForm.tsx
- [ ] T032 [P] Create TaskList component in web-app/src/components/TaskList.tsx
- [ ] T033 Create POST /api/tasks endpoint in web-app/src/app/api/tasks/route.ts
- [ ] T034 Create GET /api/tasks endpoint in web-app/src/app/api/tasks/route.ts
- [ ] T035 Create GET /api/tasks/[id] endpoint in web-app/src/app/api/tasks/[id]/route.ts
- [ ] T036 Create PUT /api/tasks/[id] endpoint in web-app/src/app/api/tasks/[id]/route.ts
- [ ] T037 Create DELETE /api/tasks/[id] endpoint in web-app/src/app/api/tasks/[id]/route.ts
- [ ] T038 Implement Zod validation schemas for task operations in web-app/src/lib/schemas/task.ts
- [ ] T039 Create task repository with Prisma in web-app/src/lib/repositories/task.ts
- [ ] T040 Add error handling for task operations in web-app/src/app/api/tasks/route.ts

**Checkpoint**: At this point, User Story 2 should be fully functional and testable independently

---

## Phase 5: User Story 3 - Task Search and Filtering (Priority: P1) 🎯 MVP

**Goal**: Enable users to quickly find specific tasks via text search and filter by priority, status, and due date

**Independent Test**: Create multiple tasks with different properties, use search and filters to verify only matching tasks are displayed

### Implementation for User Story 3

- [ ] T041 [P] Create FilterBar component in web-app/src/components/FilterBar.tsx
- [ ] T042 [P] Implement search logic with debouncing in web-app/src/components/FilterBar.tsx
- [ ] T043 [P] Implement priority filter logic in web-app/src/lib/hooks/useTasks.ts
- [ ] T044 [P] Implement status filter logic in web-app/src/lib/hooks/useTasks.ts
- [ ] T045 [P] Implement due date filter logic in web-app/src/lib/hooks/useTasks.ts
- [ ] T046 Add empty state message when no tasks match filters in web-app/src/components/TaskList.tsx
- [ ] T047 Update TaskList component to accept filter props in web-app/src/components/TaskList.tsx

**Checkpoint**: At this point, User Story 3 should be fully functional and testable independently

---

## Phase 6: User Story 4 - Task Prioritization and Status Tracking (Priority: P2)

**Goal**: Enable users to categorize tasks by importance and track progress through different stages

**Independent Test**: Create tasks with different priorities and statuses, update them, verify UI correctly reflects properties with visual indicators

### Implementation for User Story 4

- [ ] T048 [P] Update TaskCard to display priority indicators in web-app/src/components/TaskCard.tsx
- [ ] T049 [P] Update TaskCard to display status badges in web-app/src/components/TaskCard.tsx
- [ ] T050 [P] Update TaskForm to include priority selection in web-app/src/components/TaskForm.tsx
- [ ] T051 [P] Update TaskForm to include status dropdown in web-app/src/components/TaskForm.tsx
- [ ] T052 Create PATCH /api/tasks/[id]/status endpoint in web-app/src/app/api/tasks/[id]/status/route.ts
- [ ] T053 Create ProgressIndicator component in web-app/src/components/ProgressIndicator.tsx
- [ ] T054 Add visual overdue warning indicator in web-app/src/components/TaskCard.tsx

**Checkpoint**: At this point, User Story 4 should be fully functional and testable independently

---

## Phase 7: User Story 5 - Responsive and Accessible UI (Priority: P2)

**Goal**: Ensure UI adapts to different screen sizes and is accessible to users with disabilities

**Independent Test**: Access application on devices with different screen sizes, test keyboard navigation, verify screen reader compatibility

### Implementation for User Story 5

- [ ] T055 [P] Create root layout.tsx with Better Auth provider in web-app/src/app/layout.tsx
- [ ] T056 [P] Create globals.css with responsive styles in web-app/src/app/globals.css
- [ ] T057 [P] Add responsive Tailwind classes to TaskCard in web-app/src/components/TaskCard.tsx
- [ ] T058 [P] Add responsive Tailwind classes to TaskList in web-app/src/components/TaskList.tsx
- [ ] T059 [P] Add ARIA labels to interactive elements in web-app/src/components/TaskCard.tsx
- [ ] T060 Add keyboard navigation support in web-app/src/components/TaskForm.tsx
- [ ] T061 Add touch targets for mobile (min 44px) in web-app/src/components/TaskCard.tsx
- [ ] T062 Create main page.tsx dashboard in web-app/src/app/page.tsx

**Checkpoint**: At this point, User Story 5 should be fully functional and testable independently

---

## Phase 8: User Story 6 - Dark Mode and Theme Customization (Priority: P3)

**Goal**: Enable users to toggle between light and dark themes with system preference detection

**Independent Test**: Toggle theme switcher, verify UI updates, refresh page to confirm persistence, check system preference detection

### Implementation for User Story 6

- [ ] T063 [P] Create ThemeToggle component in web-app/src/components/ThemeToggle.tsx
- [ ] T064 [P] Add theme context in web-app/src/context/ThemeContext.tsx
- [ ] T065 Persist theme preference in localStorage in web-app/src/context/ThemeContext.tsx
- [ ] T066 Detect system theme preference in web-app/src/context/ThemeContext.tsx
- [ ] T067 Apply dark mode CSS classes in web-app/src/app/globals.css
- [ ] T068 Integrate ThemeToggle component in web-app/src/app/layout.tsx
- [ ] T069 Add smooth theme transitions in web-app/src/app/globals.css

**Checkpoint**: At this point, User Story 6 should be fully functional and testable independently

---

## Phase 9: User Story 7 - Task Reordering and Drag-and-Drop (Priority: P3)

**Goal**: Enable users to manually reorder tasks through drag-and-drop for personalized workflow

**Independent Test**: Create multiple tasks, drag them to different positions, verify new order persists across sessions

### Implementation for User Story 7

- [ ] T070 Install drag-and-drop library in web-app/package.json
- [ ] T071 Add drag handle indicator in web-app/src/components/TaskCard.tsx
- [ ] T072 Implement drag-and-drop in TaskList component in web-app/src/components/TaskList.tsx
- [ ] T073 Create API endpoint to update sort_order in web-app/src/app/api/tasks/[id]/reorder/route.ts
- [ ] T074 Update task list to sort by sortOrder in web-app/src/lib/hooks/useTasks.ts
- [ ] T075 Disable drag-and-drop when filters/sorting applied in web-app/src/components/TaskList.tsx
- [ ] T076 Add visual feedback during drag operation in web-app/src/components/TaskList.tsx

**Checkpoint**: At this point, User Story 7 should be fully functional and testable independently

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T077 Connect frontend to API routes in web-app/src/context/TodoContext.tsx
- [ ] T078 [P] Implement optimistic UI updates with React Query in web-app/src/lib/hooks/useTasks.ts
- [ ] T079 [P] Add loading states for async operations in web-app/src/components/TaskForm.tsx
- [ ] T080 [P] Add error notifications (toasts) in web-app/src/components/Toast.tsx
- [ ] T081 Add confirmation dialogs for destructive actions in web-app/src/components/TaskCard.tsx
- [ ] T082 Create TodoContext for global state management in web-app/src/context/TodoContext.tsx
- [ ] T083 Optimize for performance with code splitting in web-app/src/app/layout.tsx
- [ ] T084 Update README.md with deployment instructions in web-app/README.md
- [ ] T085 Create .env.production.example template in web-app/.env.production.example
- [ ] T086 [P] Create vitest configuration in web-app/vitest.config.ts
- [ ] T087 [P] Create Playwright configuration in web-app/playwright.config.ts

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-9)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 10)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Should integrate with US1 auth but independently testable
- **User Story 3 (P1)**: Can start after Foundational (Phase 2) - Depends on US2 for TaskList component
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Depends on US2 for TaskCard and TaskForm components
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - Integrates all previous stories' components
- **User Story 6 (P3)**: Can start after Foundational (Phase 2) - Standalone theme feature
- **User Story 7 (P3)**: Can start after Foundational (Phase 2) - Depends on US2 and US3 for TaskList component

### Within Each User Story

- Components marked [P] can run in parallel (different files)
- UI components before API endpoints
- API endpoints before integration
- Core implementation before polish
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, user stories can start in parallel (if team capacity allows)
- All UI components within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 2

```bash
# Launch all UI components for User Story 2 together:
Task: "Create TaskCard component in web-app/src/components/TaskCard.tsx"
Task: "Create TaskForm component in web-app/src/components/TaskForm.tsx"
Task: "Create TaskList component in web-app/src/components/TaskList.tsx"

# Launch all API endpoints for User Story 2 together:
Task: "Create POST /api/tasks endpoint in web-app/src/app/api/tasks/route.ts"
Task: "Create GET /api/tasks endpoint in web-app/src/app/api/tasks/route.ts"
Task: "Create GET /api/tasks/[id] endpoint in web-app/src/app/api/tasks/[id]/route.ts"
```

---

## Implementation Strategy

### MVP First (User Stories 1, 2, 3)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Auth)
4. Complete Phase 4: User Story 2 (Task CRUD)
5. Complete Phase 5: User Story 3 (Search/Filter)
6. **STOP and VALIDATE**: Test MVP independently
7. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (Auth) → Test independently → Deploy/Demo
3. Add User Story 2 (Tasks) → Test independently → Deploy/Demo (MVP!)
4. Add User Story 3 (Search) → Test independently → Deploy/Demo
5. Add User Story 4 (Priority/Status) → Test independently → Deploy/Demo
6. Add User Story 5 (Responsive/Accessible) → Test independently → Deploy/Demo
7. Add User Story 6 (Dark Mode) → Test independently → Deploy/Demo
8. Add User Story 7 (Drag-and-Drop) → Test independently → Deploy/Demo
9. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Auth)
   - Developer B: User Story 2 (Tasks)
   - Developer C: User Story 3 (Search)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Tests not included as they were not requested in specification
- MVP scope: US1 (Auth) + US2 (Task CRUD) + US3 (Search/Filter)
