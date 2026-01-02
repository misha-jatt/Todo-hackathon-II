"use client";

import { Task, Status } from "@/types";
import { TaskCard } from "./TaskCard";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { ClipboardList } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onStatusToggle: (id: string, currentStatus: Status) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskList({
  tasks,
  isLoading,
  onStatusToggle,
  onEdit,
  onDelete,
}: TaskListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-48 w-full animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800"
          />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 px-4 text-center"
      >
        <div className="rounded-full bg-blue-50 dark:bg-blue-900/20 p-6 mb-4">
          <ClipboardList className="h-12 w-12 text-blue-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          No tasks found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
          You haven't created any tasks yet, or no tasks match your current filters.
          Start by adding a new task!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <TaskCard
              task={task}
              onStatusToggle={onStatusToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
