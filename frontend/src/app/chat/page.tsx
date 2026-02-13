/** Chat page for AI-powered task management.

[Task]: T020, T024
[From]: specs/004-ai-chatbot/tasks.md
[From]: specs/010-chatkit-migration/tasks.md - T024

This page provides the main chat interface where users can interact
with the AI assistant to create and manage tasks through natural language.

MIGRATION (Phase 010-chatkit-migration):
- Replaced ChatInterface with ChatKit-powered TaskChat component
- SSE streaming replaces WebSocket for real-time updates
- Custom authentication via httpOnly cookies
- Tool execution visualization built into ChatKit UI
- Now uses DashboardLayout for consistent sidebar navigation
*/
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth";
import { TaskChat } from "@/components/chat/TaskChat";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function ChatPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useSession();
  const [currentThreadId, setCurrentThreadId] = useState<string>();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">
              AI Task Assistant
            </h1>
            <p className="text-sm text-muted-foreground">
              Create and manage tasks using natural language
            </p>
          </div>
        </div>
      </header>

      {/* ChatKit TaskChat component */}
      {/* [From]: T024 - Update dashboard to use TaskChat instead of ChatInterface */}
      <main className="flex-1 p-4 lg:p-6 h-[calc(100vh-8rem)]">
        <div className="bg-card border border-border rounded-xl h-full overflow-hidden">
          <TaskChat
            userId={user?.id || ""}
            initialThreadId={currentThreadId}
            className="h-full w-full"
          />
        </div>
      </main>
    </DashboardLayout>
  );
}
