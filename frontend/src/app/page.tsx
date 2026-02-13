/* Homepage with redirect logic.

[Task]: T027
[From]: specs/003-frontend-task-manager/plan.md

Redirects unauthenticated users to /login and authenticated users to /dashboard.
Modern loading state with TaskFlow branding.
*/
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ListTodo } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await authClient.getSession();

        if (error || !data) {
          // Not authenticated - redirect to login
          router.push('/login');
        } else {
          // Authenticated - redirect to dashboard
          router.push('/dashboard');
        }
      } catch {
        // Error checking auth - redirect to login
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <ListTodo className="w-7 h-7 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">TaskFlow</span>
        </div>

        {/* Loading indicator */}
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading your workspace...</p>
      </div>
    </div>
  );
}
