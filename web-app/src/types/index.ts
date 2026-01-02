import { User as PrismaUser, Task as PrismaTask, Session as PrismaSession, Priority, Status } from "@prisma/client";

export { Priority, Status };

export interface User extends Omit<PrismaUser, "createdAt" | "updatedAt"> {
  createdAt: string;
  updatedAt: string;
}

export interface Task extends Omit<PrismaTask, "createdAt" | "updatedAt" | "dueDate"> {
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Session extends Omit<PrismaSession, "createdAt" | "updatedAt" | "expiresAt"> {
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateTaskInput = Pick<Task, "title" | "description" | "priority" | "status" | "dueDate">;
export type UpdateTaskInput = Partial<CreateTaskInput>;
