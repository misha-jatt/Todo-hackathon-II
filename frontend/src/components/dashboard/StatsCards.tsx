"use client";

import { useMemo } from "react";
import { CheckCircle2, Circle, Clock, AlertTriangle, ListTodo, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

interface StatsCardsProps {
  tasks: Task[];
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  percentage?: number;
}

function StatCard({ title, value, icon, color, bgColor, percentage }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {percentage !== undefined && (
            <p className={cn("text-xs font-medium", color)}>
              {percentage > 0 ? "+" : ""}{percentage.toFixed(0)}%
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", bgColor)}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export function StatsCards({ tasks }: StatsCardsProps) {
  const stats = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.filter(t => !t.completed).length;
    const overdue = tasks.filter(t => {
      if (!t.due_date || t.completed) return false;
      const dueDate = new Date(t.due_date);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < now;
    }).length;
    const dueToday = tasks.filter(t => {
      if (!t.due_date || t.completed) return false;
      const dueDate = new Date(t.due_date);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === now.getTime();
    }).length;

    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return { total, completed, pending, overdue, dueToday, completionRate };
  }, [tasks]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
      <StatCard
        title="Total Tasks"
        value={stats.total}
        icon={<ListTodo className="w-5 h-5 text-blue-600" />}
        color="text-blue-600"
        bgColor="bg-blue-100 dark:bg-blue-950"
      />
      <StatCard
        title="Completed"
        value={stats.completed}
        icon={<CheckCircle2 className="w-5 h-5 text-green-600" />}
        color="text-green-600"
        bgColor="bg-green-100 dark:bg-green-950"
        percentage={stats.completionRate}
      />
      <StatCard
        title="Pending"
        value={stats.pending}
        icon={<Circle className="w-5 h-5 text-amber-600" />}
        color="text-amber-600"
        bgColor="bg-amber-100 dark:bg-amber-950"
      />
      <StatCard
        title="Overdue"
        value={stats.overdue}
        icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
        color="text-red-600"
        bgColor="bg-red-100 dark:bg-red-950"
      />
      <StatCard
        title="Due Today"
        value={stats.dueToday}
        icon={<Clock className="w-5 h-5 text-purple-600" />}
        color="text-purple-600"
        bgColor="bg-purple-100 dark:bg-purple-950"
      />
      <StatCard
        title="Completion"
        value={Math.round(stats.completionRate)}
        icon={<TrendingUp className="w-5 h-5 text-indigo-600" />}
        color="text-indigo-600"
        bgColor="bg-indigo-100 dark:bg-indigo-950"
      />
    </div>
  );
}
