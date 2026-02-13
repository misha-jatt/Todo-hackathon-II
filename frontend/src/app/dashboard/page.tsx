/* Dashboard page - main task management interface with sidebar layout.

[Task]: T021-T024, T072
[From]: specs/005-ux-improvement/tasks.md

This Server Component:
- Fetches initial tasks server-side for fast page load
- Passes data to TaskListClient for client-side interactions
- Modern sidebar-based layout with statistics
*/
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { TaskListClient } from '@/components/tasks/TaskListClient';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { fetchTasks } from '@/lib/api/server';
import { getTaskUrgency } from '@/lib/utils';
import type { Task } from '@/types/task';

const ITEMS_PER_PAGE = 50;

async function DashboardContent() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth_token');

  // Redirect to login if not authenticated
  if (!authToken) {
    redirect('/login');
  }

  // Fetch initial tasks server-side
  let initialTasks: Task[] = [];
  let initialTotal = 0;

  try {
    const response = await fetchTasks({
      limit: ITEMS_PER_PAGE,
      offset: 0,
    });

    if (response) {
      // Add computed urgency to each task
      initialTasks = response.tasks.map(task => ({
        ...task,
        urgency: getTaskUrgency(task.due_date),
      })) as Task[];
      initialTotal = response.total;
    }
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <DashboardHeader title="Dashboard" />

      {/* Main content */}
      <main className="p-4 lg:p-6">
        {/* Welcome section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-1">
            Welcome back!
          </h2>
          <p className="text-muted-foreground">
            Here's an overview of your tasks
          </p>
        </div>

        {/* Statistics Cards */}
        <StatsCards tasks={initialTasks} />

        {/* Task List */}
        <div className="bg-card border border-border rounded-xl p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Your Tasks
          </h3>
          <TaskListClient
            initialTasks={initialTasks}
            initialTotal={initialTotal}
          />
        </div>
      </main>
    </DashboardLayout>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
