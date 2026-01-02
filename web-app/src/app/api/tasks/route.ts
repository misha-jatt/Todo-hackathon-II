import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { taskRepository } from "@/lib/repositories/task";
import { createTaskSchema } from "@/lib/schemas/task";
import { Priority, Status } from "@prisma/client";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") || undefined;
  const priority = (searchParams.get("priority") as Priority) || undefined;
  const status = (searchParams.get("status") as Status) || undefined;

  try {
    const tasks = await taskRepository.findByUserId(session.user.id, {
      search,
      priority,
      status,
    });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = createTaskSchema.parse(body);
    const task = await taskRepository.create(session.user.id, validatedData);
    return NextResponse.json(task, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
