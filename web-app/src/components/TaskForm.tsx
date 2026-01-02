"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema, CreateTaskInput } from "@/lib/schemas/task";
import { Priority, Status, Task } from "@/types";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface TaskFormProps {
  initialData?: Task;
  onClose: () => void;
  onSubmit: (data: CreateTaskInput) => Promise<void>;
  title: string;
}

export function TaskForm({ initialData, onClose, onSubmit, title }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          priority: initialData.priority,
          status: initialData.status,
          dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split("T")[0] : undefined,
        }
      : {
          priority: Priority.Medium,
          status: Status.Pending,
        },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                {...register("title")}
                className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-800 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="What needs to be done?"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={3}
                className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-800 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="Optional details..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Priority
                </label>
                <select
                  {...register("priority")}
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 dark:bg-gray-800 focus:border-blue-500 outline-none sm:text-sm"
                >
                  <option value={Priority.Low}>Low</option>
                  <option value={Priority.Medium}>Medium</option>
                  <option value={Priority.High}>High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Due Date
                </label>
                <input
                  {...register("dueDate")}
                  type="date"
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 dark:bg-gray-800 focus:border-blue-500 outline-none sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                {...register("status")}
                className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 dark:bg-gray-800 focus:border-blue-500 outline-none sm:text-sm"
              >
                <option value={Status.Pending}>Pending</option>
                <option value={Status.InProgress}>In Progress</option>
                <option value={Status.Completed}>Completed</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : initialData ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
