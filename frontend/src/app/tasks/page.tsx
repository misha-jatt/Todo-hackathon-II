/* Tasks page - displays list of tasks for authenticated user.

[Task]: T034, T041, T048, T055, T057
[From]: specs/003-frontend-task-manager/plan.md

This client component:
- Fetches tasks using taskApi.listTasks with filters and pagination
- Renders TaskList component
- Handles loading and error states
- Manages TaskForm modal for creating tasks
- Implements filter logic from URL params
- Integrates pagination with offset calculation (T055)
- Preserves filters across pages (T057)
- Uses DashboardLayout for consistent sidebar navigation
*/
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { taskApi } from "@/lib/task-api";
import { TaskList } from "@/components/tasks/TaskList";
import { FilterBar } from "@/components/tasks/FilterBar";
import { Pagination } from "@/components/tasks/Pagination";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { Task } from "@/types/task";

const ITEMS_PER_PAGE = 50;

export default function TasksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      // Read status, search, and page from URL params (T048, T055, T057)
      const statusParam = searchParams.get("status");
      const searchParam = searchParams.get("search");
      const pageParam = searchParams.get("page");

      // Convert page to offset: offset = (page - 1) * limit (T055)
      const page = pageParam ? parseInt(pageParam, 10) : 1;
      const offset = (page - 1) * ITEMS_PER_PAGE;

      const params: {
        limit: number;
        offset: number;
        completed?: boolean;
        search?: string;
      } = {
        limit: ITEMS_PER_PAGE,
        offset,
      };

      // Convert status filter to completed boolean
      if (statusParam === "active") {
        params.completed = false;
      } else if (statusParam === "completed") {
        params.completed = true;
      }

      // Add search query if present
      if (searchParam) {
        params.search = searchParam;
      }

      // API now returns full response with total count
      const response = await taskApi.listTasks(params);
      setTasks(response.tasks);
      setTotal(response.total);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load tasks";
      if (errorMessage === "Session expired") {
        router.push("/login");
        return;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: session, error } = await authClient.getSession();

        if (error || !session) {
          router.push("/login");
          return;
        }

        // Authenticated - load tasks
        loadTasks();
      } catch {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]); // Run once on mount

  // Reload tasks when URL params change (preserves filters across pages - T057)
  useEffect(() => {
    loadTasks();
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // Get current page from URL params
  const currentPage = searchParams.get("page")
    ? parseInt(searchParams.get("page")!, 10)
    : 1;

  return (
    <DashboardLayout>
      {/* Header with create task button */}
      <DashboardHeader title="All Tasks" />

      {/* Main content */}
      <main className="p-4 lg:p-6">
        {/* Filter and search bar */}
        <div className="bg-card border border-border rounded-xl p-4 lg:p-6 mb-6">
          <FilterBar />
        </div>

        {/* Task list container */}
        <div className="bg-card border border-border rounded-xl p-4 lg:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
              {error}
            </div>
          ) : (
            <>
              <TaskList tasks={tasks} />
              {/* Pagination component (T055, T057) */}
              <Pagination
                total={total}
                limit={ITEMS_PER_PAGE}
                currentPage={currentPage}
              />
            </>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
}
