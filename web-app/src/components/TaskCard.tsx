"use client";

import { Task, Priority, Status } from "@/types";
import { cn, formatDate } from "@/lib/utils";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Circle,
  MoreVertical,
  Pencil,
  Trash2,
  AlertCircle
} from "lucide-react";
import React from "react";

interface TaskCardProps {
  task: Task;
  onStatusToggle: (id: string, currentStatus: Status) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  [Priority.High]: "text-red-600 bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-900/30",
  [Priority.Medium]: "text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-900/30",
  [Priority.Low]: "text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900/30",
};

const statusIcons = {
  [Status.Pending]: Circle,
  [Status.InProgress]: Clock,
  [Status.Completed]: CheckCircle2,
};

export function TaskCard({ task, onStatusToggle, onEdit, onDelete }: TaskCardProps) {
  const StatusIcon = statusIcons[task.status];
  const isCompleted = task.status === Status.Completed;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted;

  return (
    <div className={cn(
      "group relative flex flex-col space-y-3 rounded-2xl border p-5 transition-all duration-200",
      "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800",
      "hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-none hover:-translate-y-0.5",
      isCompleted && "bg-gray-50/50 dark:bg-gray-950/50 opacity-75"
    )}>
      <div className="flex items-start justify-between">
        <button
          onClick={() => onStatusToggle(task.id, task.status)}
          className={cn(
            "mt-1 flex-shrink-0 transition-colors focus:outline-none",
            isCompleted ? "text-emerald-500" : "text-gray-400 hover:text-blue-500"
          )}
        >
          <StatusIcon className="h-5 w-5" />
        </button>

        <div className="ml-3 flex-1">
          <h3 className={cn(
            "text-base font-semibold transition-all",
            isCompleted ? "text-gray-500 line-through" : "text-gray-900 dark:text-white"
          )}>
            {task.title}
          </h3>
          {task.description && (
            <p className={cn(
              "mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2",
              isCompleted && "text-gray-400"
            )}>
              {task.description}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-2">
        <span className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
          priorityColors[task.priority]
        )}>
          {task.priority}
        </span>

        {task.dueDate && (
          <span className={cn(
            "inline-flex items-center text-xs text-gray-500 dark:text-gray-400",
            isOverdue && "text-red-600 font-medium"
          )}>
            <Calendar className="mr-1 h-3 w-3" />
            {formatDate(task.dueDate)}
            {isOverdue && <AlertCircle className="ml-1 h-3 w-3" />}
          </span>
        )}

        <span className="ml-auto text-[10px] text-gray-400 uppercase tracking-wider font-medium">
          {task.status.replace("InProgress", "In Progress")}
        </span>
      </div>
    </div>
  );
}
