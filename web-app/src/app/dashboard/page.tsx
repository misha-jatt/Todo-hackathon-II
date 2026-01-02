"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, LogOut, Settings, LayoutGrid, List } from "lucide-react";
import { Task, Status, Priority } from "@/types";
import { TaskList } from "@/components/TaskList";
import { TaskForm } from "@/components/TaskForm";
import { FilterBar } from "@/components/FilterBar";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const { data: session, isPending: isSessionLoading } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  // Filter state
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState<Priority | "ALL">("ALL");
  const [status, setStatus] = useState<Status | "ALL">("ALL");

  // Redirect if not authenticated
  if (!isSessionLoading && !session) {
    router.push("/signin");
    return null;
  }

  // Fetch tasks
  const { data: tasks = [], isLoading: isTasksLoading } = useQuery<Task[]>({
    queryKey: ["tasks", { search, priority, status }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (priority !== "ALL") params.append("priority", priority);
      if (status !== "ALL") params.append("status", status);

      const response = await fetch(`/api/tasks?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch tasks");
      return response.json();
    },
  });

  // Create Task Mutation
  const createTaskMutation = useMutation({
    mutationFn: async (newTask: any) => {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      if (!response.ok) throw new Error("Failed to create task");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsFormOpen(false);
    },
  });

  // Update Task Mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update task");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsFormOpen(false);
      setEditingTask(undefined);
    },
  });

  // Toggle Status Mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Status }) => {
      const nextStatus =
        status === Status.Completed ? Status.Pending :
        status === Status.Pending ? Status.InProgress :
        Status.Completed;

      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!response.ok) throw new Error("Failed to update status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  // Delete Task Mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete task");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleCreateTask = async (data: any) => {
    await createTaskMutation.mutateAsync(data);
  };

  const handleUpdateTask = async (data: any) => {
    if (editingTask) {
      await updateTaskMutation.mutateAsync({ id: editingTask.id, data });
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(undefined);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/signin");
  };

  if (isSessionLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Todo Evolution
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex flex-col items-end mr-2 text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {session?.user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {session?.user.email}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              My Tasks
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage and organize your progress efficiently.
            </p>
          </div>

          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="h-5 w-5" />
            <span>Create Task</span>
          </button>
        </div>

        <FilterBar
          onSearch={setSearch}
          onPriorityFilter={setPriority}
          onStatusFilter={setStatus}
        />

        <TaskList
          tasks={tasks}
          isLoading={isTasksLoading}
          onStatusToggle={(id, status) => toggleStatusMutation.mutate({ id, status })}
          onEdit={handleEditClick}
          onDelete={(id) => deleteTaskMutation.mutate(id)}
        />
      </main>

      {/* Task Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <TaskForm
            initialData={editingTask}
            onClose={handleCloseForm}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            title={editingTask ? "Edit Task" : "Create New Task"}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
