# Data Model: Phase II Persistent Storage

**Feature Branch**: `002-todo-web-fullstack`
**Created**: 2026-01-02
**Status**: Draft
**Schema Type**: Prisma ORM with Neon PostgreSQL

---

## Overview

Phase II data models provide persistent storage for users and tasks using Neon PostgreSQL database. The schema supports multi-user authentication, task management with enhanced properties, and session management.

### Migration from Phase I

**Phase I (In-Memory)**:
- Task dataclass with auto-increment integer IDs
- Single session, all data lost on exit
- Simple schema: `id`, `description`, `completed`

**Phase II (Persistent Database)**:
- UUID-based identifiers for scalability
- Multi-user data isolation
- Enhanced task properties (priority, status, due dates)
- Session management for authentication
- Persistent storage across sessions

---

## Technology Choice

### ORM: Prisma

**Decision**: Prisma ORM selected for type-safe database access.

**Rationale**:
- Type safety with TypeScript
- Auto-generated TypeScript types from schema
- Excellent Neon PostgreSQL integration
- Migration support built-in
- Clean API for database operations
- Well-documented and widely adopted

**Alternatives Considered**:
1. **Drizzle ORM** - More control but requires more boilerplate
2. **TypeORM** - Mature but heavier runtime
3. **Raw SQL with `pg`** - Maximum control but no type safety

---

## Database Schema

### User Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);
```

**Purpose**: Stores user account information for authentication and authorization.

**Constraints**:
- `email` must be unique across all users
- `email` must be valid RFC 5322 format
- `name` is optional (display name only)
- `email_verified` tracks OAuth verification status

### Session Table (Better Auth Managed)

```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

**Purpose**: Stores active user sessions managed by Better Auth.

**Constraints**:
- `user_id` references a valid user (cascade delete on user deletion)
- `token` is a secure session token
- `expires_at` determines session validity (30 days default)

### Task Table

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'Medium',
  status TEXT NOT NULL DEFAULT 'Pending',
  due_date TIMESTAMP WITH TIME ZONE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_sort_order ON tasks(user_id, sort_order);
```

**Purpose**: Stores user todo items with enhanced properties and persistent storage.

**Constraints**:
- `user_id` must reference a valid user (cascade delete on user deletion)
- `title` is required (1-100 characters)
- `description` is optional (max 1000 characters)
- `priority` defaults to 'Medium' (valid: 'High', 'Medium', 'Low')
- `status` defaults to 'Pending' (valid: 'Pending', 'In Progress', 'Completed')
- `due_date` is optional (timestamp or null)
- `sort_order` for custom manual ordering
- All tasks owned by exactly one user

---

## Prisma Schema Definition

```prisma
generator client {
  provider = "postgresql"
}

datasource db {
  url = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  emailVerified Boolean @default(false) @map("email_verified")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  @@index([email])
}

model Session {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  token     String
  expiresAt DateTime @map("expires_at")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([userId])
  @@index([token])
  @@index([expiresAt])
  @@relation(fields: [userId], references: [User], onDelete: Cascade)
}

model Task {
  id         String    @id @default(uuid())
  userId     String    @map("user_id")
  title      String
  description String?
  priority   Priority   @default(Medium)
  status     Status     @default(Pending)
  dueDate    DateTime? @map("due_date")
  sortOrder  Int        @default(0) @map("sort_order")
  createdAt  DateTime  @default(now()) @map("created_at")
  updatedAt  DateTime  @updatedAt @map("updated_at")

  @@index([userId])
  @@index([status])
  @@index([priority])
  @@index([dueDate])
  @@index([userId, sortOrder])
  @@relation(fields: [userId], references: [User], onDelete: Cascade)
}

enum Priority {
  High
  Medium
  Low
}

enum Status {
  Pending
  InProgress @map("In Progress")
  Completed
}
```

---

## Entity Relationships

### User to Tasks (One-to-Many)

```
User (1) ─────┐
                  │
                  ├─ Task 1
                  ├─ Task 2
                  ├─ Task 3
                  ├─ Task ...
                  └─ Task N

Relationship: User.id = Task.user_id
Delete Behavior: CASCADE (delete user → delete all tasks)
```

### User to Sessions (One-to-Many)

```
User (1) ─────┐
                  │
                  ├─ Session 1
                  ├─ Session 2
                  ├─ Session 3
                  ├─ ... (active + expired)
                  └─ Session N

Relationship: User.id = Session.user_id
Delete Behavior: CASCADE (delete user → delete all sessions)
```

---

## Data Types

### User

| Field | Type | Required | Constraints | Validation |
|--------|-------|----------|-------------|
| id | UUID (String) | Yes | Auto-generated via uuid() |
| email | String | Yes | RFC 5322 format, unique |
| name | String | No | Optional display name |
| emailVerified | Boolean | No | Default: false |
| createdAt | DateTime | No | Auto-set: now() |
| updatedAt | DateTime | No | Auto-set on update |

### Task

| Field | Type | Required | Constraints | Validation |
|--------|-------|----------|-------------|
| id | UUID (String) | Yes | Auto-generated via uuid() |
| userId | UUID (String) | Yes | References User.id |
| title | String | Yes | Min: 1, Max: 100 chars |
| description | String | No | Max: 1000 chars, Optional |
| priority | Enum | No | Values: High, Medium, Low |
| status | Enum | No | Values: Pending, InProgress, Completed |
| dueDate | DateTime | No | Optional, can be null |
| sortOrder | Int | No | Default: 0, >= 0 |
| createdAt | DateTime | No | Auto-set: now() |
| updatedAt | DateTime | No | Auto-set on update |

### Session

| Field | Type | Required | Constraints | Validation |
|--------|-------|----------|-------------|
| id | UUID (String) | Yes | Auto-generated via uuid() |
| userId | UUID (String) | Yes | References User.id |
| token | String | Yes | Generated by Better Auth |
| expiresAt | DateTime | Yes | Default: 30 days from now() |
| createdAt | DateTime | No | Auto-set: now() |
| updatedAt | DateTime | No | Auto-set on update |

### Enums

#### Priority

```typescript
enum Priority {
  High = "High"
  Medium = "Medium"
  Low = "Low"
}
```

- **High**: Urgent, time-sensitive tasks
- **Medium**: Normal priority tasks
- **Low**: Optional, nice-to-have tasks

#### Status

```typescript
enum Status {
  Pending = "Pending"
  InProgress = "In Progress"
  Completed = "Completed"
}
```

- **Pending**: Not yet started
- **In Progress**: Currently being worked on
- **Completed**: Finished tasks

---

## Validation Rules

### Email Validation

- Must be valid RFC 5322 email format
- Must be unique across all users
- Cannot be null
- Case-insensitive for uniqueness check
- Trim whitespace before validation

### Password Validation (for email signup)

- Minimum 8 characters
- Recommended: Include uppercase, lowercase, numbers, special characters
- Maximum length: 128 characters (configurable)
- Hashed using bcrypt before storage

### Task Title Validation

- Required field (cannot be null or empty)
- Minimum length: 1 character
- Maximum length: 100 characters
- Trim whitespace before storage

### Task Description Validation

- Optional field (can be null or empty)
- Maximum length: 1000 characters
- Trim whitespace before storage

### Date Validation

- `due_date` must be a valid timestamp or null
- Can be any past or future date (no restriction)
- Timezone: stored as UTC, display in user's local timezone

### User Ownership Validation

- All task queries must filter by `user_id`
- Users cannot view or modify tasks belonging to other users
- `user_id` must exist in users table before creating task

---

## Index Strategy

### Performance Indexes

| Index | Columns | Purpose |
|--------|----------|---------|
| idx_users_email | users.email | Fast email uniqueness checks |
| idx_sessions_user_id | sessions.user_id | Fast session lookups by user |
| idx_sessions_expires_at | sessions.expires_at | Session cleanup queries |
| idx_tasks_user_id | tasks.user_id | Filter tasks by user |
| idx_tasks_status | tasks.status | Filter by status |
| idx_tasks_priority | tasks.priority | Sort/filter by priority |
| idx_tasks_due_date | tasks.due_date | Filter by due date |
| idx_tasks_sort_order | tasks(user_id, sortOrder) | Custom ordering |

**Query Performance Targets**:
- All queries should use indexes
- Estimated query time: < 50ms for 1,000 tasks
- Supports pagination for large datasets (N+1 queries with LIMIT/OFFSET)

---

## Data Access Patterns

### Repository Layer

```typescript
// Base repository with common CRUD operations
abstract class BaseRepository<T> {
  // Prisma client instance
  protected prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Create
  async create(data: Omit<T, 'id'>): Promise<T> {
    return this.prisma[this.modelName].create({ data });
  }

  // Find Many
  async findByUserId(userId: string): Promise<T[]> {
    return this.prisma[this.modelName].findMany({
      where: { userId }
    });
  }

  // Find One
  async findById(id: string): Promise<T | null> {
    return this.prisma[this.modelName].findUnique({
      where: { id }
    });
  }

  // Update
  async update(id: string, data: Partial<T>): Promise<T> {
    return this.prisma[this.modelName].update({
      where: { id },
      data: { ...data, updatedAt: new Date() }
    });
  }

  // Delete
  async delete(id: string): Promise<void> {
    await this.prisma[this.modelName].delete({
      where: { id }
    });
  }
}
```

### Transaction Safety

```typescript
// All multi-step operations use transactions
async function transferTaskWithTransaction(prisma: PrismaClient, taskId: string, newUserId: string) {
  await prisma.$transaction([
    // Validate ownership
    prisma.task.findUnique({ where: { id: taskId } }),
    prisma.task.update({
      where: { id: taskId },
      data: { userId: newUserId, updatedAt: new Date() }
    })
  ]);
}
```

---

## Data Lifecycle

### User Lifecycle

1. **Registration** → User created with email/password or OAuth
2. **Email Verification** → `emailVerified` set to true (OAuth only)
3. **First Login** → Initial session created
4. **Subsequent Sessions** → New sessions created, old sessions invalidated
5. **Profile Update** → `name` and other optional fields updated
6. **Account Deletion** → User deleted, all tasks cascaded

### Task Lifecycle

1. **Creation** → Task created with defaults (status=Pending, priority=Medium)
2. **Update** → Any field modified, `updatedAt` timestamp updated
3. **Status Change** → Status transitions recorded, `updatedAt` updated
4. **Reorder** → `sort_order` updated
5. **Deletion** → Task removed permanently

### Session Lifecycle

1. **Creation** → Session created on successful authentication
2. **Validation** → Better Auth validates session on each request
3. **Expiration** → Sessions expire after 30 days (configurable)
4. **Refresh** → Session extended on active use
5. **Termination** → Session deleted on logout

---

## Migration Strategy

### Initial Migration

```sql
-- Run after Prisma schema generation
-- Creates tables, indexes, and constraints
BEGIN;

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);

-- Sessions table (Better Auth)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'Medium',
  status TEXT NOT NULL DEFAULT 'Pending',
  due_date TIMESTAMP WITH TIME ZONE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_sort_order ON tasks(user_id, sort_order);

COMMIT;
```

### Rollback Support

All Prisma migrations are reversible:

```bash
# Create migration
npx prisma migrate dev --name init_schema

# Rollback if needed
npx prisma migrate resolve --name init_schema
```

---

## Data Privacy & Security

### Privacy

- User data isolated by `user_id`
- No cross-user data access
- Email addresses used for authentication only
- Passwords hashed and never logged

### Security

- All IDs are UUIDs (not guessable integers)
- Foreign key relationships prevent orphaned data
- CASCADE deletes maintain referential integrity
- Prepared statements prevent SQL injection
- Connection strings stored as environment variables
- Session tokens not exposed in logs

---

## TypeScript Types

### User Type

```typescript
export interface User {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Task Type

```typescript
export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  dueDate: Date | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export type Priority = 'High' | 'Medium' | 'Low';
export type Status = 'Pending' | 'In Progress' | 'Completed';
```

### Session Type

```typescript
export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Data Consistency

### Constraint Enforcement

1. **Referential Integrity**: Foreign keys ensure valid relationships
2. **Unique Constraints**: Email uniqueness, UUID uniqueness
3. **Cascade Deletes**: User deletion removes all associated data
4. **Transaction Safety**: Multi-step operations wrapped in transactions
5. **Optimistic Locking**: Version fields for concurrent updates (future consideration)

### Concurrency Handling

- Database connections use pooling (default: 10 connections)
- Transactions prevent race conditions
- Deadlock detection and retry logic
- Query timeout set to prevent long-running queries

---

## Testing Data Layer

### Unit Test Examples

```typescript
describe('Task Repository', () => {
  it('should create task with valid data', async () => {
    const task = await taskRepo.create({
      userId: 'user-123',
      title: 'Test Task',
      status: 'Pending'
    });

    expect(task.id).toBeDefined();
    expect(task.title).toBe('Test Task');
    expect(task.status).toBe('Pending');
  });

  it('should enforce unique email', async () => {
    // Should throw error for duplicate email
    await expect(
      userRepo.create({ email: 'existing@example.com' })
    ).rejects.toThrow();
  });

  it('should cascade delete tasks on user deletion', async () => {
    await userRepo.delete('user-123');

    const tasks = await taskRepo.findByUserId('user-123');
    expect(tasks).toHaveLength(0);
  });
});
```

---

## Scaling Considerations

### Current Design Supports

- 1,000 concurrent users
- 1,000,000+ tasks per user
- Automatic database scaling with Neon
- Connection pooling for performance
- Indexed queries for fast lookups

### Future Scaling

If needed:
- Add read replicas for heavy read loads
- Consider database sharding at 10M+ users
- Implement caching layer (Redis) for frequently accessed data
- Add query result caching

---

## Database Backup Strategy

### Neon Platform Features

- Automated daily backups
- 30-day retention
- Point-in-time recovery (PITR)
- On-demand snapshots before major changes

### Backup Schedule

```
Daily at 00:00 UTC:
  - Full database snapshot
  - Retained for 30 days

On-demand:
  - Before schema migrations
  - Before major releases
  - Manual trigger via Neon console
```

---

## Summary

Phase II data model provides:

1. **Persistent Storage**: Neon PostgreSQL database
2. **Multi-User Support**: User isolation with foreign keys
3. **Enhanced Task Properties**: Priority, status, due dates, sorting
4. **Session Management**: Better Auth integration
5. **Type Safety**: Full TypeScript support via Prisma
6. **Performance**: Indexed queries, connection pooling
7. **Security**: UUID IDs, prepared statements, environment variables
8. **Scalability**: Designed for 1,000+ concurrent users

The data model satisfies all Phase II requirements while maintaining data consistency and security.
