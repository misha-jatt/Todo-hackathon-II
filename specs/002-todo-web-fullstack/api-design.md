# API Design: RESTful API for Phase II

**Feature Branch**: `002-todo-web-fullstack`
**Created**: 2026-01-02
**Status**: Draft
**Related Documents**: spec.md, data-model.md, plan.md

---

## Overview

This document defines the REST API architecture for the full-stack Todo web application. The API follows REST principles with proper HTTP methods, JSON request/response format, authentication protection, and Prisma ORM integration.

### API Philosophy

- **Resource-Oriented**: Each endpoint operates on a specific resource (tasks, users, sessions)
- **Stateless**: All authentication/authorization is handled via HTTP headers (no server session state)
- **RESTful**: Standard HTTP methods for resource operations (GET, POST, PUT, DELETE, PATCH)
- **Secure**: All protected endpoints require authentication; public routes only for signup/signin
- **Type-Safe**: Strong typing with TypeScript and Prisma auto-generated types
- **Error-First**: Consistent error handling with proper HTTP status codes and messages

---

## API Endpoint Structure

```
/api/
├── auth/
│   ├── signup          (POST)  - Public
│   ├── signin          (POST)  - Public
│   ├── signout         (POST)  - Protected
│   ├── session          (GET)  - Public
│   ├── callback/
│   │   ├── google      (GET)  - Public
│   │   └── github       (GET)  - Public
│
└── tasks/
    ├── (GET)            - Protected  - List all tasks
    ├── (POST)           - Protected  - Create task
    ├── [id]/ (GET)      - Protected  - Get single task
    ├── [id]/ (PUT)       - Protected  - Update task
    ├── [id]/ (DELETE)     - Protected  - Delete task
    └── [id]/status/ (PATCH) - Protected  - Toggle status
```

---

## Authentication Endpoints

### POST /api/auth/signup

**Purpose**: Create new user account with email/password or OAuth.

**HTTP Method**: POST

**Request Body**:
```typescript
{
  email: string;      // Required, RFC 5322 format
  password?: string;     // Optional, min 8 chars
  name?: string;       // Optional display name
}
```

**Authentication**: None (public endpoint)

**Success Response** (201 Created):
```json
{
  "id": "uuid-string",
  "email": "user@example.com",
  "name": "John Doe" | null,
  "emailVerified": false,
  "createdAt": "2026-01-02T10:00:00Z",
  "updatedAt": "2026-01-02T10:00:00Z"
}
```

**Error Response** (400 Bad Request):
```json
{
  "error": "Validation failed",
  "details": "Email must be a valid RFC 5322 address"
}
```

**Error Response** (409 Conflict):
```json
{
  "error": "Email already exists"
  "details": "An account with this email already exists"
}
```

**Error Response** (500 Internal Server Error):
```json
{
  "error": "Failed to create user account",
  "details": "An unexpected error occurred"
}
```

**Implementation Notes**:
- Validate email format with regex or library
- Hash password using bcrypt (cost factor 10)
- Use `gen_random_uuid()` for user IDs
- Set `emailVerified: false` by default (OAuth users verified later)
- Return 409 if email already exists
- Return 500 for database errors

---

### POST /api/auth/signin

**Purpose**: Authenticate existing user and create session.

**HTTP Method**: POST

**Request Body**:
```typescript
{
  email: string;      // Required
  password: string;     // Required
}
```

**Authentication**: None (public endpoint)

**Success Response** (200 OK):
```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "John Doe",
    "emailVerified": true
  },
  "session": {
    "token": "session-token-string",
    "expiresAt": "2026-01-17T10:00:00Z"
  }
}
```

**Error Response** (401 Unauthorized):
```json
{
  "error": "Invalid credentials",
  "details": "Email or password is incorrect"
}
```

**Error Response** (500 Internal Server Error):
```json
{
  "error": "Authentication failed",
  "details": "An unexpected error occurred"
}
```

**Implementation Notes**:
- Verify credentials with database query
- Compare password hash with bcrypt (cost factor 10)
- Use `gen_random_uuid()` for session tokens
- Create session record in Prisma
- Set session expiration to 30 days from creation
- Return HttpOnly, Secure, SameSite cookie
- Return 401 for invalid credentials
- Return 500 for database errors

---

### POST /api/auth/signout

**Purpose**: Invalidate user session and logout.

**HTTP Method**: POST

**Request Body**:
```typescript
{}
```

**Authentication**: Required (valid JWT token in cookie)

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Error Response** (401 Unauthorized):
```json
{
  "error": "No active session found",
  "details": "You are not logged in"
}
```

**Implementation Notes**:
- Extract and verify JWT from cookie
- Find session by token in database
- Delete session record (or mark as expired)
- Clear HttpOnly cookie
- Return 200 even if session not found (idempotent)
- Return 401 if no valid token provided
- Return 500 for database errors

---

### GET /api/auth/session

**Purpose**: Check if user has valid active session.

**HTTP Method**: GET

**Authentication**: None (public endpoint)

**Success Response** (200 OK):
```json
{
  "authenticated": true,
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "expiresIn": 2592000  // Seconds until session expires
}
```

**Error Response** (200 OK - Not Authenticated):
```json
{
  "authenticated": false,
  "user": null
}
```

**Implementation Notes**:
- Extract and verify JWT from HttpOnly cookie
- Query sessions table for active, non-expired session
- Calculate `expiresIn` based on session `expiresAt` and current time
- Return user object if authenticated
- Return `authenticated: false` if no valid session
- No authentication required (public endpoint)

---

### GET /api/auth/callback/google

**Purpose**: Handle Google OAuth callback after user authorization.

**HTTP Method**: GET

**Query Parameters**:
- `code` - OAuth authorization code
- `state` - CSRF protection token

**Authentication**: None (public endpoint)

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Google authentication successful",
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "John Doe",
    "emailVerified": true
  },
  "session": {
    "token": "session-token-string",
    "expiresAt": "2026-01-17T10:00:00Z"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "error": "OAuth callback failed",
  "details": "Invalid code or state parameter"
}
```

**Implementation Notes**:
- Validate `code` and `state` parameters
- Exchange authorization code for tokens via Better Auth
- Create or update user if Google account
- Create session record
- Generate Better Auth session token
- Return 200 with session details
- Handle error states from Better Auth SDK
- Set `emailVerified: true` for OAuth users
- Redirect to `/` after successful callback

---

### GET /api/auth/callback/github

**Purpose**: Handle GitHub OAuth callback after user authorization.

**HTTP Method**: GET

**Query Parameters**:
- `code` - OAuth authorization code
- `state` - CSRF protection token

**Authentication**: None (public endpoint)

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "GitHub authentication successful",
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "John Doe",
    "emailVerified": true
  },
  "session": {
    "token": "session-token-string",
    "expiresAt": "2026-01-17T10:00:00Z"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "error": "OAuth callback failed",
  "details": "Invalid code or state parameter"
}
```

**Implementation Notes**:
- Validate `code` and `state` parameters
- Exchange authorization code for tokens via Better Auth
- Create or update user if GitHub account
- Create session record
- Generate Better Auth session token
- Return 200 with session details
- Handle error states from Better Auth SDK
- Set `emailVerified: true` for OAuth users
- Redirect to `/` after successful callback

---

## Task Endpoints

### GET /api/tasks

**Purpose**: Retrieve all tasks for the authenticated user.

**HTTP Method**: GET

**Authentication**: Required (JWT token in cookie)

**Success Response** (200 OK):
```json
{
  "tasks": [
    {
      "id": "uuid-string",
      "userId": "user-uuid-string",
      "title": "Buy groceries",
      "description": "Weekly grocery shopping",
      "priority": "Medium",
      "status": "Pending",
      "dueDate": "2024-01-15T10:00:00Z",
      "sortOrder": 0,
      "createdAt": "2026-01-02T12:00:00Z",
      "updatedAt": "2026-01-02T12:00:00Z"
    },
    ...
  ]
}
```

**Error Response** (401 Unauthorized):
```json
{
  "error": "Authentication required",
  "details": "You must be logged in to access tasks"
}
```

**Error Response** (500 Internal Server Error):
```json
{
  "error": "Failed to retrieve tasks",
  "details": "An unexpected error occurred"
}
```

**Implementation Notes**:
- Extract user ID from JWT token
- Query tasks table with `where: { userId }`
- Order by `sortOrder` ASC, then `createdAt` DESC (newest first)
- Return empty array `[]` if no tasks found
- Implement pagination support (limit/offset) for large datasets
- Return 500 for database errors
- Set proper `Content-Type: application/json` header

---

### GET /api/tasks/:id

**Purpose**: Retrieve a specific task by its ID.

**HTTP Method**: GET

**Authentication**: Required (JWT token in cookie)

**Path Parameter**: `id` - Task UUID

**Success Response** (200 OK):
```json
{
  "task": {
    "id": "uuid-string",
    "userId": "user-uuid-string",
    "title": "Buy groceries",
    "description": "Weekly grocery shopping",
    "priority": "Medium",
    "status": "Pending",
    "dueDate": "2024-01-15T10:00:00Z",
    "sortOrder": 0,
    "createdAt": "2026-01-02T12:00:00Z",
    "updatedAt": "2026-01-02T12:00:00Z"
  }
}
```

**Error Response** (401 Unauthorized):
```json
{
  "error": "Task not found",
  "details": "No task exists with the specified ID"
}
```

**Error Response** (403 Forbidden):
```json
{
  "error": "Access denied",
  "details": "You do not have permission to access this task"
}
```

**Error Response** (500 Internal Server Error):
```json
{
  "error": "Failed to retrieve task",
  "details": "An unexpected error occurred"
}
```

**Implementation Notes**:
- Extract user ID from JWT token
- Query tasks table with `where: { id, userId }`
- Verify task belongs to authenticated user (user_id match)
- Return 404 if task doesn't exist or doesn't belong to user
- Return 500 for database errors
- Set proper `Content-Type: application/json` header

---

### POST /api/tasks

**Purpose**: Create a new task for the authenticated user.

**HTTP Method**: POST

**Authentication**: Required (JWT token in cookie)

**Request Body**:
```typescript
{
  "title": "Buy groceries",           // Required, 1-1000 chars
  "description": "Weekly grocery shopping",  // Optional, max 1000 chars
  "priority": "Medium",               // Required, High|Medium|Low
  "status": "Pending",               // Required, Pending|InProgress|Completed
  "dueDate": "2024-01-15T10:00:00Z" // Optional, ISO 8601 format or null
  "sortOrder": 0                    // Optional, integer >= 0
}
```

**Success Response** (201 Created):
```json
{
  "task": {
    "id": "uuid-string",
    "userId": "user-uuid-string",
    "title": "Buy groceries",
    "description": "Weekly grocery shopping",
    "priority": "Medium",
    "status": "Pending",
    "dueDate": "2024-01-15T10:00:00Z",
    "sortOrder": 0,
    "createdAt": "2026-01-02T14:00:00Z",
    "updatedAt": "2026-01-02T14:00:00Z"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "error": "Validation failed",
  "details": "Title must be between 1 and 1000 characters"
}
```

**Error Response** (400 Bad Request):
```json
{
  "error": "Validation failed",
  "details": "Priority must be High, Medium, or Low"
}
```

**Error Response** (401 Unauthorized):
```json
{
  "error": "Authentication required",
  "details": "You must be logged in to create tasks"
}
```

**Error Response** (500 Internal Server Error):
```json
{
  "error": "Failed to create task",
  "details": "An unexpected error occurred"
}
```

**Implementation Notes**:
- Extract user ID from JWT token
- Validate request body with Zod schema
- Check title length (1-1000 chars, required)
- Check description length (max 1000 chars, optional)
- Validate priority enum
- Validate status enum
- Validate due date format (ISO 8601 or null)
- Create task with Prisma
- Auto-generate UUID
- Set defaults: status=Pending, priority=Medium, sortOrder=user's max+1
- Set `createdAt` and `updatedAt` to current timestamp
- Return 201 with created task
- Return 400/401 for validation errors
- Return 500 for database errors

---

### PUT /api/tasks/:id

**Purpose**: Update an existing task.

**HTTP Method**: PUT

**Authentication**: Required (JWT token in cookie)

**Path Parameter**: `id` - Task UUID

**Request Body** (All fields optional except title must be provided):
```typescript
{
  "title": "Buy groceries",           // Optional update
  "description": "Updated description", // Optional update
  "priority": "High",                  // Optional update
  "status": "Completed",             // Optional update
  "dueDate": "2024-02-01T10:00:00Z" // Optional update
  "sortOrder": 1                      // Optional update
}
```

**Success Response** (200 OK):
```json
{
  "task": {
    "id": "uuid-string",
    "userId": "user-uuid-string",
    "title": "Buy groceries",
    "description": "Updated description",
    "priority": "High",
    "status": "Completed",
    "dueDate": "2024-02-01T10:00:00Z",
    "sortOrder": 1,
    "createdAt": "2026-01-02T12:00:00Z",
    "updatedAt": "2026-01-02T14:00:00Z"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "error": "Validation failed",
  "details": "At least one field must be provided"
}
```

**Error Response** (401 Unauthorized):
```json
{
  "error": "Task not found",
  "details": "No task exists with the specified ID"
}
```

**Error Response** (403 Forbidden):
```json
{
  "error": "Access denied",
  "details": "You do not have permission to update this task"
}
```

**Error Response** (500 Internal Server Error):
```json
{
  "error": "Failed to update task",
  "details": "An unexpected error occurred"
}
```

**Implementation Notes**:
- Extract user ID from JWT token
- Query tasks table with `where: { id, userId }`
- Verify task belongs to authenticated user (user_id match)
- Validate request body with Zod schema
- Update only provided fields
- Auto-update `updatedAt` timestamp
- Return 200 with updated task
- Return 404 if task doesn't exist or doesn't belong to user
- Return 403 if no permission
- Return 400/500 for validation/database errors

---

### DELETE /api/tasks/:id

**Purpose**: Delete a task by its ID.

**HTTP Method**: DELETE

**Authentication**: Required (JWT token in cookie)

**Path Parameter**: `id` - Task UUID

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Error Response** (401 Unauthorized):
```json
{
  "error": "Authentication required",
  "details": "You must be logged in to delete tasks"
}
```

**Error Response** (403 Forbidden):
```json
{
  "error": "Access denied",
  "details": "You do not have permission to delete this task"
}
```

**Error Response** (404 Not Found):
```json
{
  "error": "Task not found",
  "details": "No task exists with the specified ID"
}
```

**Error Response** (500 Internal Server Error):
```json
{
  "error": "Failed to delete task",
  "details": "An unexpected error occurred"
}
```

**Implementation Notes**:
- Extract user ID from JWT token
- Query tasks table with `where: { id, userId }`
- Verify task belongs to authenticated user (user_id match)
- Delete task record with Prisma
- Cascade delete will remove task record automatically
- Return 200 with success message
- Return 401 if not authenticated
- Return 403/404 if no permission
- Return 500 for database errors

---

### PATCH /api/tasks/:id/status

**Purpose**: Toggle task completion status (Pending ↔ Completed).

**HTTP Method**: PATCH

**Authentication**: Required (JWT token in cookie)

**Path Parameter**: `id` - Task UUID

**Request Body**:
```typescript
{
  "status": "Completed"    // Required, Pending|InProgress|Completed
}
```

**Success Response** (200 OK):
```json
{
  "task": {
    "id": "uuid-string",
    "userId": "user-uuid-string",
    "title": "Buy groceries",
    "description": "Weekly grocery shopping",
    "priority": "Medium",
    "status": "Completed",
    "dueDate": "2024-01-15T10:00:00Z",
    "sortOrder": 0,
    "createdAt": "2026-01-02T12:00:00Z",
    "updatedAt": "2026-01-02T14:00:00Z"
  }
}
```

**Error Response** (401 Unauthorized):
```json
{
  "error": "Authentication required",
  "details": "You must be logged in to update tasks"
}
```

**Error Response** (404 Not Found):
```json
{
  "error": "Task not found",
  "details": "No task exists with the specified ID"
}
```

**Error Response** (403 Forbidden):
```json
{
  "error": "Access denied",
  "details": "You do not have permission to update this task"
}
```

**Error Response** (500 Internal Server Error):
```json
{
  "error": "Failed to update task status",
  "details": "An unexpected error occurred"
}
```

**Implementation Notes**:
- Extract user ID from JWT token
- Query tasks table with `where: { id, userId }`
- Verify task belongs to authenticated user (user_id match)
- Validate status enum value
- Update task status
- Auto-update `updatedAt` timestamp
- Return 200 with updated task
- Return 401 if not authenticated
- Return 403/404 if no permission
- Return 500 for database errors

---

## Authentication Strategy

### Session Management

**Framework**: Better Auth (server-side session management)

**Session Flow**:
1. **Signup/Signin** → User authenticates
   - Create session in Prisma
   - Generate session token (JWT)
   - Set HttpOnly, Secure, SameSite cookie
   - Set expiration to 30 days
   - Return session to client

2. **Protected Route Access** → User accesses protected API
   - Verify JWT token from HttpOnly cookie
   - Validate session exists and not expired
   - Extract user ID from token
   - Allow access if valid session

3. **Signout** → User logs out
   - Delete session from Prisma
   - Clear HttpOnly cookie
   - Return success

**Session Storage Schema**:
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Security Considerations**:
- **HttpOnly**: Prevents client-side JavaScript access to cookies
- **Secure**: Encrypts cookie over HTTPS only
- **SameSite**: Prevents CSRF attacks across origins
- **Expiration**: 30 days default, configurable
- **Token**: Secure JWT signed by Better Auth

---

## Data Isolation

### User Ownership

**Rule**: All tasks MUST be filtered by `user_id` in database queries.

**Implementation**:
```typescript
// Every task query includes user filter
const tasks = await prisma.task.findMany({
  where: {
    userId: session.userId,  // Extracted from JWT
    ...otherFilters
  }
});
```

**Cascade Delete**:
```sql
-- Prisma schema automatically cascades deletes
ON DELETE CASCADE
```

When a user account is deleted:
- All tasks associated with that user are automatically deleted
- Sessions associated with that user are automatically deleted

---

## Error Handling Strategy

### Error Response Format

**Standard Error Structure**:
```typescript
interface ApiError {
  error: string;
  details?: string;
}

// Usage in API routes
return NextResponse.json<ApiError>(
  { error: "Validation failed", details: "..." },
  { status: 500, error: "Database error" }
);
```

### HTTP Status Codes

| Status Code | Usage | Meaning |
|-------------|-------|---------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | No valid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Server-side error |

**Status Code Selection**:
- Use 200 for successful operations (GET, PATCH, DELETE)
- Use 201 for creation (POST)
- Use 400 for validation errors
- Use 401 for authentication issues
- Use 403 for permission issues
- Use 404 for not found resources
- Use 500 for database/unknown errors

---

## Validation Strategy

### Zod Schema Validation

**Task Creation Schema**:
```typescript
import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1).max(1000),
  description: z.string().max(1000).optional(),
  priority: z.enum(['High', 'Medium', 'Low']),
  status: z.enum(['Pending', 'In Progress', 'Completed']),
  dueDate: z.string().datetime().optional(),
  sortOrder: z.number().int().optional().default(0),
});
```

**Task Update Schema**:
```typescript
export const updateTaskSchema = z.object({
  title: z.string().min(1).max(1000).optional(),
  description: z.string().max(1000).optional(),
  priority: z.enum(['High', 'Medium', 'Low']).optional(),
  status: z.enum(['Pending', 'In Progress', 'Completed']).optional(),
  dueDate: z.string().datetime().optional(),
  sortOrder: z.number().int().optional(),
});
```

**Task Status Toggle Schema**:
```typescript
export const toggleStatusSchema = z.object({
  status: z.enum(['Pending', 'In Progress', 'Completed']),
});
```

**Implementation**:
```typescript
// In API route
import { createTaskSchema, updateTaskSchema, toggleStatusSchema } from '@/lib/schemas/task';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  const body = createTaskSchema.parse(request.body);
  // ... validation and creation
}

// In API route
import { updateTaskSchema } from '@/lib/schemas/task';
import { z } from 'zod';

export async function PUT(request: NextRequest) {
  const body = updateTaskSchema.parse(request.body);
  // ... validation and update
}
```

### Validation Rules

1. **Title**: Required, 1-1000 characters
2. **Description**: Optional, max 1000 characters
3. **Priority**: Required, must be valid enum value
4. **Status**: Required, must be valid enum value
5. **Due Date**: Optional, must be valid ISO 8601 timestamp
6. **Sort Order**: Optional, must be non-negative integer

---

## Security Headers

### Standard Headers

```typescript
// In all API routes
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json(
    data,
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    }
  );
}
```

### Authentication Headers

```typescript
// For protected routes
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function protectedRoute(request: NextRequest) {
  const session = await validateSession(request);

  return NextResponse.json(
    data,
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `session=${session.token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=2592000`,
      },
    }
  );
}
```

---

## Rate Limiting

### Strategy

**Implementation**: Middleware-based rate limiting per user.

**Configuration**:
```typescript
const RATE_LIMIT = 100; // requests per minute per user
const RATE_LIMIT_WINDOW = 60 * 1000; // 60 seconds window

// In middleware/auth.ts
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  limiter: Ratelimit.slidingWindow(RATE_LIMIT_WINDOW, RATE_LIMIT),
  keyGenerator: (req) => req.headers.get('authorization')?.replace('Bearer ', '') || 'anonymous',
});
```

**Response on Rate Limit Exceeded**:
```json
{
  "error": "Too many requests",
  "details": `You have exceeded the rate limit of ${RATE_LIMIT} requests per minute. Please try again later.`,
}
```

---

## Pagination Strategy

### Cursor-Based Pagination

**Request Parameters**:
- `limit` - Number of items per page (default: 20)
- `cursor` - Opaque cursor for next page (optional)

**Response Format**:
```json
{
  "tasks": [...],
  "pagination": {
    "nextCursor": "cursor-string",
    "hasMore": true
  }
}
```

**Implementation**:
```typescript
// In GET /api/tasks route
import { z } from 'zod';

const listTasksSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const { limit, cursor } = listTasksSchema.parse(request.query);

  const tasks = await prisma.task.findMany({
    take: limit + 1, // Fetch one extra to check for more
    where: {
      userId: session.userId,
      createdAt: cursor ? { lt: cursor } : undefined,
      ...otherFilters
    },
    orderBy: { createdAt: 'desc' }
  });

  const hasMore = tasks.length > limit;
  const nextCursor = hasMore ? tasks[tasks.length - 1].createdAt : null;

  return NextResponse.json(
    {
      tasks,
      pagination: { nextCursor, hasMore }
    }
  );
}
```

---

## Performance Optimization

### Database Indexes

From data-model.md:

```sql
-- Critical indexes for query performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(dueDate);
CREATE INDEX idx_tasks_sort_order ON tasks(user_id, sort_order);
```

### Query Optimization

1. **Use `select` wisely** - Only fetch needed fields
2. **Connection Pooling** - Reuse Prisma client instances
3. **Prepared Statements** - Use Prisma transactions when needed
4. **Avoid N+1 queries** - Use indexes and proper filtering
5. **Lazy Loading** - Implement for large datasets (future enhancement)

---

## TypeScript Types

### API Types

```typescript
// types/index.ts
export interface User {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
  pagination?: {
    nextCursor?: string;
    hasMore?: boolean;
  };
}
```

---

## Testing Strategy

### API Testing Approach

**Unit Tests**:
- Mock Prisma client for database operations
- Test all CRUD operations (create, read, update, delete, toggle)
- Test validation logic
- Test error handling scenarios

**Integration Tests**:
- Test authentication flows (signup, signin, signout)
- Test OAuth callbacks
- Test task CRUD workflows
- Test pagination

---

## API Design Summary

**Complete RESTful API** with:
- ✅ 7 task endpoints (GET, POST, PUT, DELETE, PATCH)
- ✅ 4 authentication endpoints (signup, signin, signout, session, 2 OAuth callbacks)
- ✅ Proper HTTP status codes
- ✅ JSON request/response format
- ✅ Better Auth integration for session management
- ✅ Prisma ORM for type-safe database access
- ✅ User data isolation with foreign keys and cascade deletes
- ✅ Comprehensive error handling
- ✅ Input validation with Zod schemas
- ✅ Security (HttpOnly cookies, rate limiting, prepared statements)
- ✅ Pagination support for large datasets
- ✅ Performance optimization with indexes and connection pooling
- ✅ TypeScript types for all entities

**Ready for implementation!** The API design provides complete contracts for all Phase II endpoints.
