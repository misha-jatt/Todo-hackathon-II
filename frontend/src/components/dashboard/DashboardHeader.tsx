/* DashboardHeader component - compact header for sidebar layout.

[Task]: T072
[From]: specs/005-ux-improvement/tasks.md

This client component:
- Displays page title and search
- Create task button
- Works with sidebar layout
*/
"use client";

import { useState } from "react";
import { Plus, Search, Bell, Menu } from "lucide-react";
import { TaskForm } from "@/components/tasks/TaskForm";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface DashboardHeaderProps {
  title?: string;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function DashboardHeader({
  title = "Dashboard",
  onMenuClick,
  showMenuButton = false
}: DashboardHeaderProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Left: Menu button (mobile) + Title */}
          <div className="flex items-center gap-4">
            {showMenuButton && (
              <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
            <h1 className="text-xl font-semibold text-foreground tracking-tight">
              {title}
            </h1>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications placeholder */}
            <button
              className="p-2 rounded-lg hover:bg-muted transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Create task button */}
            <Button
              onClick={() => setShowCreateModal(true)}
              className="gap-2"
              size="sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Task</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Create Task Modal */}
      {showCreateModal && (
        <TaskForm
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          mode="create"
        />
      )}
    </>
  );
}
